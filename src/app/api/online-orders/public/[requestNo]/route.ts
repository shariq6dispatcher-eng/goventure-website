import { NextResponse } from "next/server";
import { mongo, toObjectId } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { notifyRsm } from "@/lib/rsm-notify";
import type { OnlineOrder } from "@/types/rsm";

interface RouteParams {
  params: Promise<{ requestNo: string }>;
}

// PUBLIC — fetch the current state of a request by requestNo. Used both
// for the initial page load and by the polling on the customer's
// order-status page, so it can pick up changes (a new quote, files ready,
// payment approved, etc.) without the customer manually refreshing.
export async function GET(_req: Request, { params }: RouteParams) {
  const { requestNo } = await params;

  try {
    const order = await mongo.findOne<OnlineOrder>(RSM_COLLECTIONS.onlineOrders, {
      requestNo: requestNo.toUpperCase(),
    });

    if (!order) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error("Public online order GET error:", err);
    return NextResponse.json({ error: "Failed to load request" }, { status: 500 });
  }
}

// PUBLIC — the customer's side of the pipeline. Keyed by requestNo (not
// _id) since that's the only identifier the customer's URL carries, same
// as /track/[orderNo]. Every action here re-checks the record's current
// status server-side before writing, so replaying an old link or double
// clicking can't push a record backwards or skip a step.
export async function PATCH(req: Request, { params }: RouteParams) {
  const { requestNo } = await params;
  const body = await req.json();

  try {
    const order = await mongo.findOne<OnlineOrder>(RSM_COLLECTIONS.onlineOrders, {
      requestNo: requestNo.toUpperCase(),
    });

    if (!order) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (body.action === "approve") {
      if (order.status !== "Quoted") {
        return NextResponse.json(
          { error: "This request isn't awaiting approval." },
          { status: 400 }
        );
      }

      await mongo.updateOne(
        RSM_COLLECTIONS.onlineOrders,
        { _id: toObjectId(order._id) },
        { status: "Approved", approvedAt: new Date().toISOString() }
      );

      await notifyRsm({
        title: "Quote Approved",
        message: `${order.customerName} approved the ${
          order.quoteAmount ? `$${order.quoteAmount.toFixed(2)} ` : ""
        }rate for ${order.requestNo}. Work can begin.`,
        orderId: order._id,
      });

      return NextResponse.json({ success: true });
    }

    if (body.action === "paymentSubmitted") {
      if (order.status !== "Files Ready") {
        return NextResponse.json(
          { error: "This request isn't awaiting payment yet." },
          { status: 400 }
        );
      }

      const screenshotUrl = typeof body.screenshotUrl === "string" ? body.screenshotUrl : "";
      if (!screenshotUrl) {
        return NextResponse.json(
          { error: "No payment screenshot was received." },
          { status: 400 }
        );
      }

      await mongo.updateOne(
        RSM_COLLECTIONS.onlineOrders,
        { _id: toObjectId(order._id) },
        {
          status: "Payment Submitted",
          paymentScreenshot: screenshotUrl,
          paymentSubmittedAt: new Date().toISOString(),
        }
      );

      await notifyRsm({
        title: "Payment Submitted",
        message: `${order.customerName} submitted payment proof for ${order.requestNo}. Review and approve to unlock their downloads.`,
        orderId: order._id,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("Public online order PATCH error:", err);
    return NextResponse.json({ error: "Failed to update your request" }, { status: 500 });
  }
}
