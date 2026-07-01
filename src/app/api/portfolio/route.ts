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
    console.log("Before Mongo");

    const client = await clientPromise;

    console.log("Mongo Connected");

    const db = client.db("goventure");

    console.log("Database Selected");

    const portfolio = await db
      .collection("portfolio")
      .find({})
      .toArray();

    console.log("Fetched", portfolio.length);

    return Response.json(portfolio);
  } catch (err) {
    console.error("ERROR:", err);

    return Response.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}

