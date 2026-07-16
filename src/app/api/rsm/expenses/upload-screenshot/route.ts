import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getRsmAuth } from "@/lib/rsm-auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Authenticated uploader for the RSM Expenses editor — lets staff attach a
// receipt/invoice screenshot to an expense they're logging. Mirrors
// /api/rsm/payments/upload-screenshot but uses its own Cloudinary folder.
export async function POST(req: Request) {
  await getRsmAuth();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Please upload an image (screenshot) of the receipt." },
        { status: 400 }
      );
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image is too large — please keep it under 8MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "goventure-rsm-expenses",
            resource_type: "image",
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

    return NextResponse.json({ success: true, url: result.secure_url });
  } catch (err) {
    console.error("RSM expense screenshot upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
