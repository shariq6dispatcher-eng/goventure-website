import { NextResponse } from "next/server";
import { mongo, toObjectId } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { Order, OrderInput, Customer } from "@/types/rsm";
import { autoCreateDigitizingJobs } from "@/lib/rsm-auto-digitizing";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await getRsmAuth();
  const { id } = await params;

  try {
    const order = await mongo.findOne<Order>(RSM_COLLECTIONS.orders, {
      _id: toObjectId(id),
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load order" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getRsmAuth();
  const { id } = await params;
  const body = (await req.json()) as Partial<OrderInput> & {
    amountPaid?: number;
  };

  if (!body.items || body.items.length === 0) {
    return NextResponse.json(
      { error: "At least one line item is required" },
      { status: 400 }
    );
  }

  try {
    // Re-fetch the existing order so we don't clobber amountPaid/balanceDue
    // (those are kept in sync from the Payments module, not edited here
    // directly — unless the caller explicitly wants to recompute balance
    // after an item/total change, which we handle below).
    const existing = await mongo.findOne<Order>(RSM_COLLECTIONS.orders, {
      _id: toObjectId(id),
    });

    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let customerName = existing.customerName;
    if (body.customerId && body.customerId !== existing.customerId) {
      const customer = await mongo.findOne<Customer>(
        RSM_COLLECTIONS.customers,
        { _id: toObjectId(body.customerId) }
      );
      if (!customer) {
        return NextResponse.json(
          { error: "Selected customer not found" },
          { status: 400 }
        );
      }
      customerName = customer.name;
    }

    const total = body.total ?? existing.total;
    const amountPaid = existing.amountPaid; // unchanged here, Payments module owns this

    // Auto-create a Digitizing Job for any line item that needs one and
    // doesn't have one yet (e.g. an image was just added to an existing
    // order), so items keep their linked job through future edits.
    const itemsWithJobs = await autoCreateDigitizingJobs(
      { _id: id, orderNo: existing.orderNo, customerId: body.customerId ?? existing.customerId, customerName, designName: body.designName ?? existing.designName },
      body.items,
      auth.username
    );

    const update = {
      customerId: body.customerId ?? existing.customerId,
      customerName,
      items: itemsWithJobs,
      status: body.status ?? existing.status,
      subtotal: body.subtotal ?? existing.subtotal,
      discount: body.discount ?? existing.discount,
      tax: body.tax ?? existing.tax,
      total,
      amountPaid,
      balanceDue: total - amountPaid,
      orderDate: body.orderDate ?? existing.orderDate,
      dueDate: body.dueDate ?? existing.dueDate,
      designName: body.designName ?? existing.designName ?? "",
      stitchCount: body.stitchCount ?? existing.stitchCount,
      notes: body.notes ?? existing.notes ?? "",
      updatedAt: new Date().toISOString(),
    };

    const result = await mongo.updateOne(
      RSM_COLLECTIONS.orders,
      { _id: toObjectId(id) },
      update
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update order" },
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
    const result = await mongo.deleteOne(RSM_COLLECTIONS.orders, {
      _id: toObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
