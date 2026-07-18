import { NextResponse } from "next/server";
import { mongo, toObjectId } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import { sendDispatchEmail } from "@/lib/send-dispatch-email";
import type { DigitizingJob, DispatchLog } from "@/types/rsm";

// GET: list previous dispatch logs for this job's folder, newest first.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await getRsmAuth();
  const { id } = await params;

  try {
    const logs = await mongo.find<DispatchLog>(
      RSM_COLLECTIONS.dispatchLogs,
      { jobId: id },
      { createdAt: -1 }
    );
    return NextResponse.json({ logs });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load dispatch logs" }, { status: 500 });
  }
}

// POST: email the job's full production bundle to a customer, and log it.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getRsmAuth();
  const { id } = await params;
  const body = (await req.json()) as { recipientEmail?: string };
  const recipientEmail = body.recipientEmail?.trim();

  if (!recipientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
    return NextResponse.json({ error: "A valid recipient email is required" }, { status: 400 });
  }

  const job = await mongo.findOne<DigitizingJob>(
    RSM_COLLECTIONS.digitizingJobs,
    { _id: toObjectId(id) }
  );

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const files = (job.folders || []).flatMap((f) => f.files);

  if (files.length === 0) {
    return NextResponse.json({ error: "This job has no files to send yet" }, { status: 400 });
  }

  const result = await sendDispatchEmail({
    recipientEmail,
    designName: job.designName,
    files: files.map((f) => ({ name: f.name, url: f.url })),
  });

  const log: Omit<DispatchLog, "_id"> = {
    jobId: id,
    recipientEmail,
    fileCount: files.length,
    sentBy: auth.username,
    status: result.success ? "sent" : "failed",
    error: result.success ? undefined : result.error,
    createdAt: new Date().toISOString(),
  };

  await mongo.insertOne(RSM_COLLECTIONS.dispatchLogs, log);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || "Failed to send email" },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, log });
}
