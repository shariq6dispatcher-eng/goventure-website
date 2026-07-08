import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import digitizingData from "@/data/migration/part4-digitizing-jobs.json";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * ONE-TIME DATA MIGRATION ROUTE — Part 4 (digitizing jobs).
 *
 * Visit /api/rsm/migrate-part4-digitizing?key=YOUR_ADMIN_PASSWORD once.
 * Safe to re-run — already-inserted jobs are skipped, not duplicated.
 *
 * Note: the original DST/PES/EMB/PDF files themselves were not present in
 * the Firebase export (only filenames), so migrated folder entries carry
 * name + uploadedAt but an empty `url`. Re-upload actual files through the
 * app if needed.
 *
 * DELETE THIS FILE + part4-digitizing-jobs.json once confirmed in Atlas.
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!process.env.ADMIN_PASSWORD || key !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = {
    inserted: 0,
    skipped: 0,
    imagesUploaded: 0,
    errors: [] as string[],
  };

  for (const raw of digitizingData) {
    const doc: any = { ...raw };
    try {
      if (doc.imageUrl && doc.imageUrl.startsWith("data:")) {
        const upload = await cloudinary.uploader.upload(doc.imageUrl, {
          folder: "goventure-migration/digitizing",
        });
        doc.imageUrl = upload.secure_url;
        result.imagesUploaded++;
      }
      await mongo.insertOne(RSM_COLLECTIONS.digitizingJobs, doc);
      result.inserted++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("duplicate key") || msg.includes("E11000")) {
        result.skipped++;
      } else {
        result.errors.push(`${doc._id}: ${msg}`);
      }
    }
  }

  return NextResponse.json(result);
}
