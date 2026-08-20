import { NextResponse } from "next/server";
import { mongo, toObjectId } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { Lead, LeadInput } from "@/types/rsm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getRsmAuth();
  const { id } = await params;

  try {
    const lead = await mongo.findOne<Lead>(RSM_COLLECTIONS.leads, {
      _id: toObjectId(id),
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Staff can't fetch another user's lead directly by id either.
    if (auth.role !== "admin" && lead.createdBy !== auth.username) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load lead" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getRsmAuth();
  const { id } = await params;
  const body = (await req.json()) as Partial<LeadInput>;

  if (!body.customerName?.trim() || !body.platform) {
    return NextResponse.json(
      { error: "Customer name and platform are required" },
      { status: 400 }
    );
  }

  try {
    const existing = await mongo.findOne<Lead>(RSM_COLLECTIONS.leads, {
      _id: toObjectId(id),
    });
    if (!existing) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    if (auth.role !== "admin" && existing.createdBy !== auth.username) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const update = {
      customerName: body.customerName.trim(),
      phone: body.phone?.trim() ?? existing.phone ?? "",
      email: body.email?.trim() ?? existing.email ?? "",
      platform: body.platform,
      followUpDate: body.followUpDate ?? existing.followUpDate ?? "",
      comment: body.comment ?? existing.comment ?? "",
      updatedAt: new Date().toISOString(),
    };

    const result = await mongo.updateOne(
      RSM_COLLECTIONS.leads,
      { _id: toObjectId(id) },
      update
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getRsmAuth();
  const { id } = await params;

  try {
    const existing = await mongo.findOne<Lead>(RSM_COLLECTIONS.leads, {
      _id: toObjectId(id),
    });
    if (!existing) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    if (auth.role !== "admin" && existing.createdBy !== auth.username) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const result = await mongo.deleteOne(RSM_COLLECTIONS.leads, {
      _id: toObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}
