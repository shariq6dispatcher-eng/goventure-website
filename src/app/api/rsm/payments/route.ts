import { NextResponse } from "next/server";
import { mongo, toObjectId } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import { getNextPaymentNo } from "@/lib/rsm-counters";
import type { Payment, PaymentInput, Customer, Order, LedgerEntry } from "@/types/rsm";

export async function GET() {
  await getRsmAuth();

  try {
    const payments = await mongo.find<Payment>(
      RSM_COLLECTIONS.payments,
      {},
      { createdAt: -1 }
    );
    return NextResponse.json({ payments });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load payments" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const auth = await getRsmAuth();
  const body = (await req.json()) as PaymentInput & { confirmed?: boolean };

  if (!body.customerId || !body.amount || body.amount <= 0 || !body.paymentMethod || !body.date) {
    return NextResponse.json(
      { error: "Customer, a positive amount, payment method, and date are required" },
      { status: 400 }
    );
  }

  try {
    const customer = await mongo.findOne<Customer>(RSM_COLLECTIONS.customers, {
      _id: toObjectId(body.customerId),
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Selected customer not found" },
        { status: 400 }
      );
    }

    // If this payment is tied to an order, make sure the order exists
    // before we commit to anything else.
    let order: Order | null = null;
    if (body.orderId) {
      order = await mongo.findOne<Order>(RSM_COLLECTIONS.orders, {
        _id: toObjectId(body.orderId),
      });
      if (!order) {
        return NextResponse.json(
          { error: "Selected order not found" },
          { status: 400 }
        );
      }
    }

    const paymentNo = await getNextPaymentNo();
    const confirmed = body.confirmed ?? true;

   const doc = {
      paymentNo,
      customerId: body.customerId,
      customerName: customer.name,
      orderId: body.orderId || undefined,
      amount: body.amount,
      paymentMethod: body.paymentMethod,
      date: body.date,
      reference: body.reference || "",
      screenshot: body.screenshot || "",
      notes: body.notes || "",
      bookedMonth: body.bookedMonth || undefined,
      confirmed,
      confirmedBy: confirmed ? auth.username : undefined,
      loggedBy: auth.username,
      createdAt: new Date().toISOString(),
    };

    const result = await mongo.insertOne(RSM_COLLECTIONS.payments, doc);

    // Only a confirmed payment actually moves money: update the linked
    // order's running balance and drop a ledger entry.
    if (confirmed) {
      if (order) {
        const newAmountPaid = order.amountPaid + body.amount;
        await mongo.updateOne(
          RSM_COLLECTIONS.orders,
          { _id: toObjectId(body.orderId!) },
          {
            amountPaid: newAmountPaid,
            balanceDue: order.total - newAmountPaid,
          }
        );
      }

      const lastEntry = await mongo.find<LedgerEntry>(
        RSM_COLLECTIONS.ledger,
        { customerId: body.customerId },
        { createdAt: -1 }
      );
      const previousBalance = lastEntry[0]?.balance ?? 0;

      const ledgerDoc = {
        customerId: body.customerId,
        customerName: customer.name,
        date: body.bookedMonth ? `${body.bookedMonth}-01` : body.date,
        type: "Payment" as const,
        referenceId: result.insertedId,
        referenceNo: paymentNo,
        description: order ? `Payment for ${order.orderNo}` : "Payment on account",
        debit: 0,
        credit: body.amount,
        balance: previousBalance - body.amount,
        createdAt: new Date().toISOString(),
      };
      await mongo.insertOne(RSM_COLLECTIONS.ledger, ledgerDoc);
    }

    return NextResponse.json({
      success: true,
      payment: { _id: result.insertedId, ...doc },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    );
  }
}
