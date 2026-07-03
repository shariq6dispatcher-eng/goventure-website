import { mongo, toObjectId } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const updates: Record<string, unknown> = {};
    if (typeof body.title === "string" && body.title.trim()) {
      updates.title = body.title.trim();
    }
    if (typeof body.category === "string" && body.category.trim()) {
      updates.category = body.category.trim();
    }
    if (typeof body.image === "string" && body.image.trim()) {
      updates.image = body.image.trim();
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields to update" },
        { status: 400 }
      );
    }

    updates.updatedAt = new Date().toISOString();

    const result = await mongo.updateOne(
      "portfolio",
      { _id: toObjectId(id) },
      updates
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Portfolio PATCH Error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to update portfolio item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const result = await mongo.deleteOne("portfolio", {
      _id: toObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Portfolio DELETE Error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to delete portfolio item" },
      { status: 500 }
    );
  }
}
