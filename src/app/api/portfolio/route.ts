import { mongo } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * GET Portfolio
 */
export async function GET() {
  try {
    const portfolio = await mongo.find("portfolio", {}, { createdAt: -1 });
    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Portfolio GET Error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch portfolio" },
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
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    if (!body.category?.trim()) {
      return NextResponse.json(
        { success: false, error: "Category is required" },
        { status: 400 }
      );
    }

    if (!body.image?.trim()) {
      return NextResponse.json(
        { success: false, error: "Image is required" },
        { status: 400 }
      );
    }

    const result = await mongo.insertOne("portfolio", {
      title: body.title.trim(),
      category: body.category.trim(),
      image: body.image.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Portfolio POST Error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to create portfolio item" },
      { status: 500 }
    );
  }
}
