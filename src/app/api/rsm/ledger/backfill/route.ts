import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { Order, Payment, Customer } from "@/types/rsm";

// TEMPORARY, ONE-OFF ROUTE.
// Rebuilds rsm_ledger from scratch out of rsm_orders + rsm_payments so that
// customers imported straight into MongoDB (bypassing the order/payment
// create routes, which are the only normal writers of rsm_ledger) get their
// invoice/payment history reflected in the Ledger page.
//
// Safe to run more than once — it always wipes rsm_ledger first, then
// regenerates every entry (imported customers and app-created ones alike)
// from the current state of rsm_orders/rsm_payments.
//
// DELETE THIS FILE (this whole `backfill` folder) once you've confirmed the
// ledger looks right — it has no auth beyond the existing RSM cookie check
// and shouldn't stay live as a route.

type LedgerEvent = {
  customerId: string;
  customerName: string;
  date: string;
  type: "Invoice" | "Payment";
  referenceId: string;
  referenceNo: string;
  description: string;
  debit: number;
  credit: number;
  sortKey: string; // createdAt if present, else date, used only for ordering
  seq: number; // original array position, tie-breaker for equal sortKey
};

export async function GET() {
  await getRsmAuth();

  try {
    const [customers, orders, payments] = await Promise.all([
      mongo.find<Customer>(RSM_COLLECTIONS.customers),
      mongo.find<Order>(RSM_COLLECTIONS.orders),
      mongo.find<Payment>(RSM_COLLECTIONS.payments),
    ]);

    const customerNameById = new Map(customers.map((c) => [c._id, c.name]));
    const orderById = new Map(orders.map((o) => [o._id, o]));

    const events: LedgerEvent[] = [];

    orders.forEach((order, i) => {
      events.push({
        customerId: order.customerId,
        customerName:
          order.customerName || customerNameById.get(order.customerId) || "Unknown",
        date: order.orderDate,
        type: "Invoice",
        referenceId: order._id,
        referenceNo: order.orderNo,
        description: `Invoice for ${order.orderNo}`,
        debit: order.total,
        credit: 0,
        sortKey: order.createdAt || order.orderDate,
        seq: i,
      });
    });

    payments.forEach((payment, i) => {
      if (!payment.confirmed) return; // unconfirmed payments never touch the ledger
      const order = payment.orderId ? orderById.get(payment.orderId) : undefined;
      events.push({
        customerId: payment.customerId,
        customerName:
          payment.customerName || customerNameById.get(payment.customerId) || "Unknown",
        date: payment.date,
        type: "Payment",
        referenceId: payment._id,
        referenceNo: payment.paymentNo,
        description: order ? `Payment for ${order.orderNo}` : "Payment on account",
        debit: 0,
        credit: payment.amount,
        sortKey: payment.createdAt || payment.date,
        seq: orders.length + i,
      });
    });

    // Group by customer, keep chronological order within each customer.
    const byCustomer = new Map<string, LedgerEvent[]>();
    for (const ev of events) {
      const list = byCustomer.get(ev.customerId) || [];
      list.push(ev);
      byCustomer.set(ev.customerId, list);
    }

    let inserted = 0;
    const now = Date.now();
    let msOffset = 0;

    // Wipe existing ledger — we're regenerating everything from source data.
    await mongo.deleteMany(RSM_COLLECTIONS.ledger, {});

    for (const [, list] of byCustomer) {
      list.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        const sortKeyCompare = a.sortKey.localeCompare(b.sortKey);
        if (sortKeyCompare !== 0) return sortKeyCompare;
        return a.seq - b.seq;
      });

      let balance = 0;
      for (const ev of list) {
        balance += ev.debit - ev.credit;
        // Space synthetic createdAt timestamps 1s apart, oldest first, so
        // future "last entry" lookups (sorted by createdAt desc) stay correct.
        msOffset += 1000;
        await mongo.insertOne(RSM_COLLECTIONS.ledger, {
          customerId: ev.customerId,
          customerName: ev.customerName,
          date: ev.date,
          type: ev.type,
          referenceId: ev.referenceId,
          referenceNo: ev.referenceNo,
          description: ev.description,
          debit: ev.debit,
          credit: ev.credit,
          balance,
          createdAt: new Date(now - 100000000 + msOffset).toISOString(),
        });
        inserted++;
      }
    }

    return NextResponse.json({
      success: true,
      customersProcessed: byCustomer.size,
      entriesInserted: inserted,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Backfill failed", details: `${err}` },
      { status: 500 }
    );
  }
}
