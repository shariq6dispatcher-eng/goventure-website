import { NextResponse } from "next/server";
import { mongo, toObjectId } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { notifyRsm } from "@/lib/rsm-notify";
import type { OnlineOrder } from "@/types/rsm";

interface RouteParams {
  params: Promise<{ requestNo: string }>;
}

// PUBLIC — the actual file URLs are Cloudinary links, but we don't just
// hand those out directly on the status page. Routing every download
// through here means: (1) we can refuse to serve files until payment is
// actually approved, even if someone guesses/saves a Cloudinary link
// early, and (2) we can flag the very first download, which is what
// flips the order to "Completed".
export async function GET(req: Request, { params }: RouteParams) {
  const { requestNo } = await params;
  const { searchParams } = new URL(req.url);
  const idxParam = searchParams.get("idx");
  const legacyFileUrl = searchParams.get("file"); // kept for any old links already shared/bookmarked

  try {
    const order = await mongo.findOne<OnlineOrder>(RSM_COLLECTIONS.onlineOrders, {
      requestNo: requestNo.toUpperCase(),
    });

    if (!order) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (order.status !== "Payment Approved" && order.status !== "Completed") {
      return NextResponse.json(
        { error: "Downloads aren't unlocked for this request yet." },
        { status: 403 }
      );
    }

    let matchedFile = null;
    if (idxParam !== null) {
      const idx = Number(idxParam);
      matchedFile = Number.isInteger(idx) ? order.files[idx] ?? null : null;
    } else if (legacyFileUrl) {
      matchedFile = order.files.find((f) => f.url === legacyFileUrl) ?? null;
    }

    if (!matchedFile) {
      return NextResponse.json({ error: "File not found on this request." }, { status: 400 });
    }

    if (!order.downloadedAt) {
      await mongo.updateOne(
        RSM_COLLECTIONS.onlineOrders,
        { _id: toObjectId(order._id) },
        { status: "Completed", downloadedAt: new Date().toISOString() }
      );

      await notifyRsm({
        title: "Files Downloaded",
        message: `${order.customerName} downloaded their files for ${order.requestNo}. Request marked Completed.`,
        orderId: order._id,
      });
    }

    return NextResponse.redirect(matchedFile.url);
  } catch (err) {
    console.error("Online order download error:", err);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
