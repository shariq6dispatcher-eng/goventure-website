import { mongo, toObjectId } from "@/lib/mongodb";
import { NextResponse } from "next/server";

const VALID_STATUSES = ["New", "In Progress", "Quoted", "Completed", "Declined"];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.status || !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json(
        { success: false, error: `Status must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await mongo.updateOne(
      "quotes",
      { _id: toObjectId(id) },
      { status: body.status, updatedAt: new Date().toISOString() }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Quote not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quote PATCH Error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to update quote" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await mongo.deleteOne("quotes", {
      _id: toObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Quote not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quote DELETE Error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to delete quote" },
      { status: 500 }
    );
  }
}
