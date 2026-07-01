import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * GET Portfolio
 */
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
    console.error("Portfolio GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch portfolio",
      },
      { status: 500 }
    );
  }
}

/**
 * POST Portfolio
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validation
    if (!body.title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Title is required",
        },
        { status: 400 }
      );
    }

    if (!body.category?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Category is required",
        },
        { status: 400 }
      );
    }

    if (!body.image?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Image is required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("goventure");

    const result = await db.collection("portfolio").insertOne({
      title: body.title.trim(),
      category: body.category.trim(),
      image: body.image.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
    });

  } catch (error) {
    console.error("Portfolio POST Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create portfolio item",
      },
      { status: 500 }
    );
  }
}
