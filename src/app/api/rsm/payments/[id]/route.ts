import { NextResponse } from "next/server";
import { mongo, toObjectId } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { Payment, PaymentInput, Order, LedgerEntry } from "@/types/rsm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await getRsmAuth();
  const { id } = await params;

  try {
    const payment = await mongo.findOne<Payment>(RSM_COLLECTIONS.payments, {
      _id: toObjectId(id),
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({ payment });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load payment" },
      { status: 500 }
    );
  }
}

// Helper: reverse a confirmed payment's effect on its linked order
// (subtract the amount back out of amountPaid/balanceDue).
async function reverseOrderEffect(orderId: string, amount: number) {
  const order = await mongo.findOne<Order>(RSM_COLLECTIONS.orders, {
    _id: toObjectId(orderId),
  });
  if (!order) return;
  const newAmountPaid = order.amountPaid - amount;
  await mongo.updateOne(
    RSM_COLLECTIONS.orders,
    { _id: toObjectId(orderId) },
    { amountPaid: newAmountPaid, balanceDue: order.total - newAmountPaid }
  );
}

// Helper: apply a confirmed payment's effect onto its linked order
// (add the amount into amountPaid/balanceDue).
async function applyOrderEffect(orderId: string, amount: number) {
  const order = await mongo.findOne<Order>(RSM_COLLECTIONS.orders, {
    _id: toObjectId(orderId),
  });
  if (!order) return;
  const newAmountPaid = order.amountPaid + amount;
  await mongo.updateOne(
    RSM_COLLECTIONS.orders,
    { _id: toObjectId(orderId) },
    { amountPaid: newAmountPaid, balanceDue: order.total - newAmountPaid }
  );
}

// Helper: does a ledger entry already exist for this payment?
async function findLedgerEntryForPayment(paymentId: string) {
  const entries = await mongo.find<LedgerEntry>(RSM_COLLECTIONS.ledger, {
    referenceId: toObjectId(paymentId),
  });
  return entries[0] || null;
}

// Helper: drop a ledger entry for a payment (used when a payment is
// un-confirmed or deleted, so the ledger doesn't show money that isn't
// actually confirmed anymore).
async function removeLedgerEntryForPayment(paymentId: string) {
  await mongo.deleteOne(RSM_COLLECTIONS.ledger, {
    referenceId: toObjectId(paymentId),
  });
}

// Helper: create a ledger entry for a payment that just became confirmed
// (mirrors the logic in POST /api/rsm/payments). This covers the case
// where a payment was recorded as "pending" and only confirmed later via
// edit or the quick-confirm button, which previously left the ledger
// completely blank for that payment.
async function addLedgerEntryForPayment(payment: {
  _id: string;
  customerId: string;
  customerName: string;
  orderId?: string;
  orderNo?: string;
  amount: number;
  date: string;
  paymentNo: string;
}) {
  const lastEntry = await mongo.find<LedgerEntry>(
    RSM_COLLECTIONS.ledger,
    { customerId: payment.customerId },
    { createdAt: -1 }
  );
  const previousBalance = lastEntry[0]?.balance ?? 0;

  await mongo.insertOne(RSM_COLLECTIONS.ledger, {
    customerId: payment.customerId,
    customerName: payment.customerName,
    date: payment.date,
    type: "Payment" as const,
    referenceId: toObjectId(payment._id),
    referenceNo: payment.paymentNo,
    description: payment.orderNo ? `Payment for ${payment.orderNo}` : "Payment on account",
    debit: 0,
    credit: payment.amount,
    balance: previousBalance - payment.amount,
    createdAt: new Date().toISOString(),
  });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getRsmAuth();
  const { id } = await params;
  const body = (await req.json()) as Partial<PaymentInput> & { confirmed?: boolean };

  if (!body.amount || body.amount <= 0 || !body.paymentMethod || !body.date) {
    return NextResponse.json(
      { error: "A positive amount, payment method, and date are required" },
      { status: 400 }
    );
  }

  try {
    const existing = await mongo.findOne<Payment>(RSM_COLLECTIONS.payments, {
      _id: toObjectId(id),
    });
    if (!existing) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const newConfirmed = body.confirmed ?? existing.confirmed;

    // Reverse the OLD effect first (if it was confirmed and tied to an order),
    // then apply the NEW effect (if the updated version is confirmed and tied
    // to an order). This keeps order balances correct no matter what changed:
    // amount, confirmed status, or which order it's linked to.
    if (existing.confirmed && existing.orderId) {
      await reverseOrderEffect(existing.orderId, existing.amount);
    }

    const newOrderId = body.orderId ?? existing.orderId;
    if (newConfirmed && newOrderId) {
      await applyOrderEffect(newOrderId, body.amount);
    }

    // confirmedAt drives which month's "cash collected" figures a payment
    // counts toward — it's set to the moment confirmation happens (not the
    // original payment/order date), and re-set if a payment is unconfirmed
    // and later reconfirmed. This also sidesteps any inconsistent/legacy
    // `date` formatting on records imported from the old Firebase database.
    let newConfirmedAt = existing.confirmedAt;
    if (newConfirmed && !existing.confirmed) {
      newConfirmedAt = new Date().toISOString();
    } else if (!newConfirmed) {
      newConfirmedAt = undefined;
    }

    const update = {
      customerId: body.customerId ?? existing.customerId,
      orderId: newOrderId,
      amount: body.amount,
      paymentMethod: body.paymentMethod,
      date: body.date,
      reference: body.reference ?? existing.reference ?? "",
      screenshot: body.screenshot ?? existing.screenshot ?? "",
      notes: body.notes ?? existing.notes ?? "",
      confirmed: newConfirmed,
      confirmedBy: newConfirmed ? (existing.confirmedBy || auth.username) : undefined,
      confirmedAt: newConfirmedAt,
    };

    const result = await mongo.updateOne(
      RSM_COLLECTIONS.payments,
      { _id: toObjectId(id) },
      update
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Keep the customer ledger in sync with the confirmed status, the same
    // way order balances are kept in sync above. Previously the ledger was
    // only ever touched when a payment was first created — editing or
    // quick-confirming a payment afterwards silently left the ledger stale.
    if (newConfirmed && !existing.confirmed) {
      // Went pending -> confirmed: add the ledger entry if one doesn't
      // already exist for this payment.
      const already = await findLedgerEntryForPayment(id);
      if (!already) {
        let orderNo: string | undefined;
        if (newOrderId) {
          const linkedOrder = await mongo.findOne<Order>(RSM_COLLECTIONS.orders, {
            _id: toObjectId(newOrderId),
          });
          orderNo = linkedOrder?.orderNo;
        }
        await addLedgerEntryForPayment({
          _id: id,
          customerId: update.customerId,
          customerName: existing.customerName,
          orderId: newOrderId,
          orderNo,
          amount: body.amount,
          date: body.date,
          paymentNo: existing.paymentNo,
        });
      }
    } else if (!newConfirmed && existing.confirmed) {
      // Went confirmed -> pending: remove its ledger entry, since a pending
      // payment hasn't actually landed yet.
      await removeLedgerEntryForPayment(id);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await getRsmAuth();
  const { id } = await params;

  try {
    const existing = await mongo.findOne<Payment>(RSM_COLLECTIONS.payments, {
      _id: toObjectId(id),
    });
    if (!existing) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Undo this payment's effect on the order balance before deleting it.
    if (existing.confirmed && existing.orderId) {
      await reverseOrderEffect(existing.orderId, existing.amount);
    }

    // Also remove any ledger entry tied to this payment, so a deleted
    // payment doesn't keep showing up on the customer's ledger.
    if (existing.confirmed) {
      await removeLedgerEntryForPayment(id);
    }

    const result = await mongo.deleteOne(RSM_COLLECTIONS.payments, {
      _id: toObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete payment" },
      { status: 500 }
    );
  }
}
