import { NextResponse } from "next/server";
import { mongo, toObjectId } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import { notifyRsm } from "@/lib/rsm-notify";
import type { OnlineOrder } from "@/types/rsm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ADMIN — fetch one request for the detail page.
export async function GET(_req: Request, { params }: RouteParams) {
  await getRsmAuth();
  const { id } = await params;

  try {
    const order = await mongo.findOne<OnlineOrder>(RSM_COLLECTIONS.onlineOrders, {
      _id: toObjectId(id),
    });

    if (!order) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error("Online order GET(id) error:", err);
    return NextResponse.json({ error: "Failed to load request" }, { status: 500 });
  }
}

// ADMIN — every write to a request goes through this single action-based
// endpoint rather than a generic PUT. Keeping each transition explicit
// (quote / reject, and later: uploadFiles / approvePayment) means the
// public status page and this admin page can never accidentally push a
// record into an invalid state by sending a stray field.
export async function PATCH(req: Request, { params }: RouteParams) {
  const auth = await getRsmAuth();
  const { id } = await params;
  const body = await req.json();

  try {
    const order = await mongo.findOne<OnlineOrder>(RSM_COLLECTIONS.onlineOrders, {
      _id: toObjectId(id),
    });

    if (!order) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (body.action === "quote") {
      const amount = Number(body.quoteAmount);
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { error: "Enter a valid rate greater than 0" },
          { status: 400 }
        );
      }

      await mongo.updateOne(
        RSM_COLLECTIONS.onlineOrders,
        { _id: toObjectId(id) },
        {
          status: "Quoted",
          quoteAmount: amount,
          quoteNote: body.quoteNote || "",
          quotedAt: new Date().toISOString(),
        }
      );

      return NextResponse.json({ success: true });
    }

    if (body.action === "reject") {
      await mongo.updateOne(
        RSM_COLLECTIONS.onlineOrders,
        { _id: toObjectId(id) },
        {
          status: "Rejected",
          rejectedReason: body.rejectedReason || "",
        }
      );

      return NextResponse.json({ success: true });
    }

    if (body.action === "uploadFiles") {
      const newFiles = Array.isArray(body.files) ? body.files : [];
      if (newFiles.length === 0) {
        return NextResponse.json(
          { error: "No files to add" },
          { status: 400 }
        );
      }

      const stamped = newFiles.map((f: { name: string; url: string }) => ({
        name: f.name,
        url: f.url,
        uploadedAt: new Date().toISOString(),
      }));

      const combinedFiles = [...(order.files || []), ...stamped];

      await mongo.updateOne(
        RSM_COLLECTIONS.onlineOrders,
        { _id: toObjectId(id) },
        {
          files: combinedFiles,
          status: "Files Ready",
          filesReadyAt: order.filesReadyAt || new Date().toISOString(),
        }
      );

      return NextResponse.json({ success: true });
    }

    if (body.action === "approvePayment") {
      if (order.status !== "Payment Submitted") {
        return NextResponse.json(
          { error: "This request isn't awaiting payment review." },
          { status: 400 }
        );
      }

      await mongo.updateOne(
        RSM_COLLECTIONS.onlineOrders,
        { _id: toObjectId(id) },
        {
          status: "Payment Approved",
          paymentApprovedAt: new Date().toISOString(),
          paymentApprovedBy: auth.username,
        }
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("Online order PATCH error:", err);
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 });
  }
}
