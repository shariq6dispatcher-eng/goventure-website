import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getRsmAuth } from "@/lib/rsm-auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Authenticated uploader for the RSM Payments editor — lets staff attach a
// screenshot (bank transfer receipt, EasyPaisa/JazzCash confirmation, etc.)
// to a payment they're logging manually. Separate from
// /api/online-orders/upload-payment, which is the unauthenticated customer
// version used on the public order pipeline.
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
        { error: "Please upload an image (screenshot) of the payment." },
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
            folder: "goventure-rsm-payments",
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
    console.error("RSM payment screenshot upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
