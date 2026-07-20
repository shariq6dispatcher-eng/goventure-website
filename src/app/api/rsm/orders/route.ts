import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import { getNextOrderNo } from "@/lib/rsm-counters";
import { autoCreateDigitizingJobs } from "@/lib/rsm-auto-digitizing";
import type { Order, OrderInput, Customer, LedgerEntry } from "@/types/rsm";

export async function GET() {
  await getRsmAuth();

  try {
    const orders = await mongo.find<Order>(
      RSM_COLLECTIONS.orders,
      {},
      { createdAt: -1 }
    );
    return NextResponse.json({ orders });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const auth = await getRsmAuth();

  const body = (await req.json()) as OrderInput;

  if (!body.customerId || !body.items || body.items.length === 0) {
    return NextResponse.json(
      { error: "Customer and at least one line item are required" },
      { status: 400 }
    );
  }

  try {
   const isObjectId = /^[0-9a-fA-F]{24}$/.test(body.customerId);
const customer = await mongo.findOne<Customer>(RSM_COLLECTIONS.customers, {
  _id: isObjectId ? { $oid: body.customerId } : body.customerId,
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Selected customer not found" },
        { status: 400 }
      );
    }

    const orderNo = await getNextOrderNo();

    const doc = {
      orderNo,
      customerId: body.customerId,
      customerName: customer.name,
      items: body.items,
      status: body.status || "Pending",
      subtotal: body.subtotal,
      discount: body.discount || 0,
      tax: body.tax || 0,
      total: body.total,
      amountPaid: 0,
      balanceDue: body.total,
      orderDate: body.orderDate,
      dueDate: body.dueDate,
      designName: body.designName || "",
      stitchCount: body.stitchCount || undefined,
      notes: body.notes || "",
      createdAt: new Date().toISOString(),
    };

    const result = await mongo.insertOne(RSM_COLLECTIONS.orders, doc);

    // Write the matching ledger debit entry — every order is an invoice
    // that increases what the customer owes, until payments bring it down.
    const lastEntry = await mongo.find<LedgerEntry>(
      RSM_COLLECTIONS.ledger,
      { customerId: body.customerId },
      { createdAt: -1 }
    );
    const previousBalance = lastEntry[0]?.balance ?? 0;

    await mongo.insertOne(RSM_COLLECTIONS.ledger, {
      customerId: body.customerId,
      customerName: customer.name,
      date: body.orderDate,
      type: "Invoice",
      referenceId: result.insertedId,
      referenceNo: orderNo,
      description: `Invoice for ${orderNo}`,
      debit: body.total,
      credit: 0,
      balance: previousBalance + body.total,
      createdAt: new Date().toISOString(),
    });

    // Auto-create a Digitizing Job for any line item that needs one
    // (Embroidery Digitizing category + reference image attached), so
    // the digitizer sees it immediately without a second manual entry.
    const itemsWithJobs = await autoCreateDigitizingJobs(
      { _id: String(result.insertedId), orderNo, customerId: body.customerId, customerName: customer.name, designName: body.designName },
      body.items,
      auth.username
    );
    const jobsCreated = itemsWithJobs.some((it, i) => it.digitizingJobId && !body.items[i]?.digitizingJobId);
    if (jobsCreated) {
      await mongo.updateOne(
        RSM_COLLECTIONS.orders,
        { _id: result.insertedId },
        { ...doc, items: itemsWithJobs }
      );
    }

    return NextResponse.json({
      success: true,
      order: { _id: result.insertedId, ...doc, items: itemsWithJobs },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
