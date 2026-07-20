import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { notifyRsm } from "@/lib/rsm-notify";
import type { Order, OrderItem, DigitizingJob } from "@/types/rsm";

/**
 * Scans an order's line items for ones that need a digitizing job
 * (category "Embroidery Digitizing" with a reference image attached)
 * and don't have one yet, and creates a matching DigitizingJob for
 * each — linked back to the order — so the digitizer sees it
 * immediately without anyone having to create a second record by hand.
 *
 * Returns the items array with `digitizingJobId` filled in for any
 * item a job was just created for, so the caller can persist that
 * back onto the order (prevents duplicate jobs on future edits).
 *
 * Never throws — a failure here should never block saving the order.
 */
export async function autoCreateDigitizingJobs(
  order: { _id: string; orderNo: string; customerId: string; customerName: string },
  items: OrderItem[],
  uploadedBy: string
): Promise<OrderItem[]> {
  const updatedItems: OrderItem[] = [];

  for (const item of items) {
    const needsJob =
      item.category === "Embroidery Digitizing" &&
      !!item.imageUrl &&
      !item.digitizingJobId;

    if (!needsJob) {
      updatedItems.push(item);
      continue;
    }

    try {
      const doc: Omit<DigitizingJob, "_id"> = {
        customerId: order.customerId,
        customerName: order.customerName,
        designName: item.name || order.orderNo,
        imageUrl: item.imageUrl || "",
        uploadedBy,
        status: "Pending",
        orderId: order._id,
        folders: [],
        price: item.price || 0,
        format: item.format || "DST",
        notes: `Auto-created from order ${order.orderNo}`,
        createdAt: new Date().toISOString(),
      };

      const result = await mongo.insertOne(RSM_COLLECTIONS.digitizingJobs, doc);

      await notifyRsm({
        title: "New Digitizing Job",
        message: `${doc.designName} for ${doc.customerName} was auto-created from order ${order.orderNo}.`,
        jobId: String(result.insertedId),
        orderId: order._id,
      });

      updatedItems.push({ ...item, digitizingJobId: String(result.insertedId) });
    } catch (err) {
      console.error("Failed to auto-create digitizing job for order item:", err);
      updatedItems.push(item);
    }
  }

  return updatedItems;
}
