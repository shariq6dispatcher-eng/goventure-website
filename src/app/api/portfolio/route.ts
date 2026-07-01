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

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("goventure");

    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");

    let query = {};

    if (category) {
      query = {
        category: {
          $regex: new RegExp(category, "i"),
        },
      };
    }

    const portfolio = await db
      .collection("portfolio")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Database Error" },
      { status: 500 }
    );
  }
}
