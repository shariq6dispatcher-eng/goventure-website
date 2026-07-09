import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { sendAdminEmail } from "@/lib/send-email";

interface CreateNotificationInput {
  title: string;
  message: string;
  forUsername?: string; // omit or "all" to broadcast to every staff member
  jobId?: string;
  orderId?: string;
}

/**
 * Fire-and-forget notification creator. Never throws — a failed
 * notification insert should never break the calling action (e.g. a
 * digitizing job status update should still succeed even if this fails).
 *
 * Also fires off an email alert in the background so you're notified
 * no matter where you are, not just when you're inside the RSM panel.
 */
export async function notifyRsm(input: CreateNotificationInput): Promise<void> {
  try {
    await mongo.insertOne(RSM_COLLECTIONS.notifications, {
      title: input.title,
      message: input.message,
      forUsername: input.forUsername || "all",
      read: false,
      jobId: input.jobId,
      orderId: input.orderId,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to create RSM notification:", err);
  }

// Must be awaited — Cloudflare Workers can terminate the request as
  // soon as the response is sent, killing any un-awaited background
  // fetch calls. sendAdminEmail never throws, so this can't break the
  // calling action even if the email fails.
  await sendAdminEmail(input.title, input.message);
}
