import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getRsmAuth } from "@/lib/rsm-auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Allow large batch/zip uploads through this route.
export const maxDuration = 60;

// Cloudinary public_ids only allow letters, numbers, underscores, hyphens,
// dots, and slashes. Customer/order names (e.g. "K and K Farms" -> "k&k.DST")
// or any arbitrary filename (spaces, #, +, etc.) can contain characters
// Cloudinary rejects outright, so we sanitize before using the filename
// as a public_id. This makes the route accept literally any filename.
function sanitizePublicId(name: string): string {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._/-]+/g, "-") // replace disallowed chars with "-"
    .replace(/-+/g, "-") // collapse repeats
    .replace(/^-+|-+$/g, ""); // trim leading/trailing "-"

  // Fallback in case sanitizing strips everything (e.g. filename was
  // entirely emoji/symbols) — never send an empty public_id.
  return cleaned || `file-${Date.now()}`;
}

// Generic uploader for the digitizing workflow. Handles the design
// reference image (jpg/png) AND ANY finished file type — DST/PES/EXP/JEF/
// AI/PDF/ZIP/etc. Cloudinary's "raw" resource type accepts any file
// extension and any archive, so nothing except a Cloudinary-side outage
// or account file-size limit will fail here.
export async function POST(req: Request) {
  await getRsmAuth();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isImage = file.type.startsWith("image/");

    const rawPublicId = isImage
      ? file.name.replace(/\.[^/.]+$/, "")
      : file.name;
    const safePublicId = sanitizePublicId(rawPublicId);

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "goventure-rsm-digitizing",
            resource_type: isImage ? "image" : "raw",
            public_id: safePublicId,
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      name: file.name,
    });
  } catch (err: any) {
    console.error(err);
    // Surface Cloudinary's actual message instead of a generic one, so
    // any future failure is immediately diagnosable from the response.
    return NextResponse.json(
      { error: err?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
