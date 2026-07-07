import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getRsmAuth } from "@/lib/rsm-auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generic uploader for the digitizing workflow. Handles both the design
// reference image (jpg/png) AND the finished raw embroidery files
// (DST/PES/EXP/JEF/AI/PDF/etc). Cloudinary's "raw" resource type accepts
// any file extension, so non-image files won't fail upload.
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

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "goventure-rsm-digitizing",
            resource_type: isImage ? "image" : "raw",
           public_id: isImage ? file.name.replace(/\.[^/.]+$/, "") : file.name,
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
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
