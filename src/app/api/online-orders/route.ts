import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getNextRequestNo } from "@/lib/rsm-counters";
import { notifyRsm } from "@/lib/rsm-notify";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { OnlineOrder, OnlineOrderInput } from "@/types/rsm";

// PUBLIC — a customer with no login submits a new order request from
// /order. No auth check here on purpose: this is the entry point of the
// whole pipeline, same trust level as the existing /api/quotes route.
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as OnlineOrderInput;

    if (!body.customerName?.trim() || !body.customerEmail?.trim() || !body.category) {
      return NextResponse.json(
        { error: "Name, email, and category are required" },
        { status: 400 }
      );
    }

    const requestNo = await getNextRequestNo();

    const doc = {
      requestNo,
      customerName: body.customerName.trim(),
      customerEmail: body.customerEmail.trim(),
      customerPhone: body.customerPhone || "",
      category: body.category,
      designImageUrl: body.designImageUrl || "",
      size: body.size || "",
      formats: body.formats || [],
      needDate: body.needDate || "",
      urgent: !!body.urgent,
      notes: body.notes || "",
      status: "Requested" as const,
      files: [],
      createdAt: new Date().toISOString(),
    };

    const result = await mongo.insertOne(RSM_COLLECTIONS.onlineOrders, doc);

    await notifyRsm({
      title: "New Online Order Request",
      message: `${doc.customerName} requested a quote for ${doc.category}${
        doc.urgent ? " (URGENT)" : ""
      } — ${requestNo}.`,
      orderId: result.insertedId,
    });

    return NextResponse.json({
      success: true,
      requestNo,
      order: { _id: result.insertedId, ...doc },
    });
  } catch (err) {
    console.error("Online order POST error:", err);
    return NextResponse.json(
      { error: "Failed to submit your order request" },
      { status: 500 }
    );
  }
}

// ADMIN — list all requests for the RSM "Online Orders" tab.
export async function GET() {
  await getRsmAuth();

  try {
    const orders = await mongo.find<OnlineOrder>(
      RSM_COLLECTIONS.onlineOrders,
      {},
      { createdAt: -1 }
    );
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Online order GET error:", err);
    return NextResponse.json(
      { error: "Failed to load online orders" },
      { status: 500 }
    );
  }
}
