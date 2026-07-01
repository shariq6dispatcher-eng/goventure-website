import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function GET() {
  return Response.json({ message: "Upload route working" });
}
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

   const bytes = await file.arrayBuffer();

const base64 = Buffer.from(bytes).toString("base64");

const dataURI = `data:${file.type};base64,${base64}`;

const result = await cloudinary.uploader.upload(dataURI, {
  folder: "goventure-portfolio",
});

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
