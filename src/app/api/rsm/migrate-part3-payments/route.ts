import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import paymentsData from "@/data/migration/part3-payments.json";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * ONE-TIME DATA MIGRATION ROUTE — Part 3 (payments).
 *
 * Visit /api/rsm/migrate-part3-payments?key=YOUR_ADMIN_PASSWORD once.
 * Safe to re-run — already-inserted payments are skipped, not duplicated.
 * (Re-running will re-upload screenshots for any payment that failed
 * partway through, which is harmless — just an extra Cloudinary image.)
 *
 * DELETE THIS FILE + part3-payments.json once confirmed in Atlas.
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

  for (const raw of paymentsData) {
    const doc: any = { ...raw };
    try {
      if (doc.screenshot && doc.screenshot.startsWith("data:")) {
        const upload = await cloudinary.uploader.upload(doc.screenshot, {
          folder: "goventure-migration/payments",
        });
        doc.screenshot = upload.secure_url;
        result.imagesUploaded++;
      }
      await mongo.insertOne(RSM_COLLECTIONS.payments, doc);
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
