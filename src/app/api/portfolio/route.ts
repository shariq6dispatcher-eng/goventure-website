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
  try {
    const client = await clientPromise;

    const db = client.db("goventure");

    const portfolio = await db
      .collection("portfolio")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Mongo Error:", error);

    return NextResponse.json(
      { error: "Database Error" },
      { status: 500 }
    );
  }
}
