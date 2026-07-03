import { mongo, toObjectId } from "@/lib/mongodb";
import { NextResponse } from "next/server";

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
