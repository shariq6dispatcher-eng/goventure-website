import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { Lead, LeadInput } from "@/types/rsm";

export async function GET() {
  const auth = await getRsmAuth();

  // Staff only ever see their own leads. Admins see everyone's — this is
  // enforced here in the query filter, not just hidden in the UI, so a
  // staff account can never pull another user's leads by any means.
  const filter = auth.role === "admin" ? {} : { createdBy: auth.username };

  try {
    const leads = await mongo.find<Lead>(
      RSM_COLLECTIONS.leads,
      filter,
      { createdAt: -1 }
    );
    return NextResponse.json({ leads });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load leads" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const auth = await getRsmAuth();
  const body = (await req.json()) as LeadInput;

  if (!body.customerName?.trim() || !body.platform) {
    return NextResponse.json(
      { error: "Customer name and platform are required" },
      { status: 400 }
    );
  }

  try {
    const doc = {
      customerName: body.customerName.trim(),
      phone: body.phone?.trim() || "",
      email: body.email?.trim() || "",
      platform: body.platform,
      followUpDate: body.followUpDate || "",
      comment: body.comment || "",
      createdBy: auth.username,
      createdAt: new Date().toISOString(),
    };

    const result = await mongo.insertOne(RSM_COLLECTIONS.leads, doc);
    return NextResponse.json({
      success: true,
      lead: { _id: result.insertedId, ...doc },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
