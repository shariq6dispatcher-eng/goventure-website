import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { Customer, CustomerInput } from "@/types/rsm";

export async function GET() {
  await getRsmAuth();

  try {
    const customers = await mongo.find<Customer>(
      RSM_COLLECTIONS.customers,
      {},
      { createdAt: -1 }
    );
    return NextResponse.json({ customers });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load customers" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await getRsmAuth();

  const body = (await req.json()) as CustomerInput;

  if (!body.name) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  const doc = {
    name: body.name.trim(),
    email: body.email?.trim() || "",
    phone: body.phone?.trim() || "",
    company: body.company?.trim() || "",
    address: body.address?.trim() || "",
    country: body.country?.trim() || "",
    createdAt: new Date().toISOString(),
  };

  try {
    const result = await mongo.insertOne(RSM_COLLECTIONS.customers, doc);
    return NextResponse.json({
      success: true,
      customer: { _id: result.insertedId, ...doc },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
