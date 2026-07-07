import { NextResponse } from "next/server";
import { mongo, toObjectId } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import { notifyRsm } from "@/lib/rsm-notify";
import type { DigitizingJob, DigitizingJobFolder } from "@/types/rsm";

// POST: append a completed-work folder (name + files) to a digitizing job.
// This is what the digitizer uses to submit finished files. It does NOT
// change status automatically — the digitizer still clicks "Mark Completed"
// separately, since a folder might be a partial/interim submission.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getRsmAuth();
  const { id } = await params;
  const body = (await req.json()) as DigitizingJobFolder;

  if (!body.name?.trim() || !Array.isArray(body.files) || body.files.length === 0) {
    return NextResponse.json(
      { error: "Folder name and at least one file are required" },
      { status: 400 }
    );
  }

  try {
    const existing = await mongo.findOne<DigitizingJob>(
      RSM_COLLECTIONS.digitizingJobs,
      { _id: toObjectId(id) }
    );

    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const newFolder: DigitizingJobFolder = {
      name: body.name.trim(),
      files: body.files.map((f) => ({
        name: f.name,
        url: f.url,
        uploadedAt: new Date().toISOString(),
      })),
    };

    const updatedFolders = [...(existing.folders || []), newFolder];

    const result = await mongo.updateOne(
      RSM_COLLECTIONS.digitizingJobs,
      { _id: toObjectId(id) },
      { folders: updatedFolders, updatedAt: new Date().toISOString() }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    await notifyRsm({
      title: "Digitizing Files Submitted",
      message: `${auth.username} submitted "${newFolder.name}" (${newFolder.files.length} file${newFolder.files.length === 1 ? "" : "s"}) for ${existing.designName}.`,
      jobId: id,
      orderId: existing.orderId,
    });

    return NextResponse.json({ success: true, folder: newFolder });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to submit folder" },
      { status: 500 }
    );
  }
}
