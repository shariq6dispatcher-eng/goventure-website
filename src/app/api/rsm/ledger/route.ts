import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { Order, Payment, Customer, LedgerEntry } from "@/types/rsm";

// Ledger entries are computed live from rsm_orders + rsm_payments instead of
// read from the stored rsm_ledger collection. The stored collection only
// gets written by the order/payment create routes, so customers imported
// straight into MongoDB (bypassing those routes) would otherwise show an
// empty or stale ledger. Computing live guarantees the ledger always
// matches the current state of orders/payments, for every customer.
//
// Logic mirrors the one-off backfill route exactly (same event list, same
// sort, same running-balance calculation) — kept in sync intentionally.

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
  sortKey: string;
  seq: number;
};

async function computeEntriesByCustomer(): Promise<Map<string, LedgerEntry[]>> {
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

  const byCustomer = new Map<string, LedgerEvent[]>();
  for (const ev of events) {
    const list = byCustomer.get(ev.customerId) || [];
    list.push(ev);
    byCustomer.set(ev.customerId, list);
  }

  const result = new Map<string, LedgerEntry[]>();

  for (const [customerId, list] of byCustomer) {
    list.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      const sortKeyCompare = a.sortKey.localeCompare(b.sortKey);
      if (sortKeyCompare !== 0) return sortKeyCompare;
      return a.seq - b.seq;
    });

    let balance = 0;
    const entries: LedgerEntry[] = [];
    for (const ev of list) {
      balance += ev.debit - ev.credit;
      entries.push({
        _id: `${ev.type === "Invoice" ? "inv" : "pmt"}-${ev.referenceId}`,
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
        createdAt: ev.sortKey,
      });
    }
    // Newest first, to match the previous stored-ledger API's ordering
    // (createdAt desc) — the page reverses this for display.
    result.set(customerId, entries.reverse());
  }

  return result;
}

export async function GET(req: Request) {
  await getRsmAuth();

  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customerId");

  try {
    const byCustomer = await computeEntriesByCustomer();

    if (customerId) {
      return NextResponse.json({ entries: byCustomer.get(customerId) || [] });
    }

    // No customerId filter: flatten everything (kept for parity with the
    // old route's behavior; not used by the ledger page today).
    const all: LedgerEntry[] = [];
    for (const list of byCustomer.values()) all.push(...list);
    return NextResponse.json({ entries: all });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load ledger", details: `${err}` },
      { status: 500 }
    );
  }
}

export { computeEntriesByCustomer };
