import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

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
      {
        error: error instanceof Error ? error.message : "Database Error",
      },
      { status: 500 }
    );
  }
}
