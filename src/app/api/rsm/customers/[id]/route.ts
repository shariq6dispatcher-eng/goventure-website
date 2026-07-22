import { NextResponse } from "next/server";
import { mongo, toObjectId } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { Customer, CustomerInput } from "@/types/rsm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await getRsmAuth();
  const { id } = await params;

  try {
    const customer = await mongo.findOne<Customer>(RSM_COLLECTIONS.customers, {
      _id: toObjectId(id),
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ customer });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load customer" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await getRsmAuth();
  const { id } = await params;
  const body = (await req.json()) as CustomerInput;

  if (!body.name) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  const portalUsername = body.portalUsername?.trim().toLowerCase() || "";

  if (portalUsername) {
    const existing = await mongo.findOne<Customer>(RSM_COLLECTIONS.customers, {
      portalUsername,
    });
    if (existing && existing._id !== id) {
      return NextResponse.json(
        { error: "That portal username is already taken." },
        { status: 400 }
      );
    }
  }

  const update = {
    name: body.name.trim(),
    email: body.email?.trim() || "",
    phone: body.phone?.trim() || "",
    company: body.company?.trim() || "",
    address: body.address?.trim() || "",
    country: body.country?.trim() || "",
    portalEnabled: !!body.portalEnabled,
    portalUsername,
    portalPassword: body.portalPassword?.trim() || "",
    updatedAt: new Date().toISOString(),
  };

  try {
    const result = await mongo.updateOne(
      RSM_COLLECTIONS.customers,
      { _id: toObjectId(id) },
      update
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await getRsmAuth();
  const { id } = await params;

  try {
    const result = await mongo.deleteOne(RSM_COLLECTIONS.customers, {
      _id: toObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
