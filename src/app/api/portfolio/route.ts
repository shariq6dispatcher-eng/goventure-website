import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const client = await clientPromise;
  const db = client.db("goventure");

  await db.collection("portfolio").insertOne({
    title: body.title,
    image: body.image,
    category: body.category,
    createdAt: new Date(),
  });

  return NextResponse.json({
    success: true,
  });
}

export async function GET() {
  return Response.json({
    test: "Portfolio API works",
  });
}
