import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { RsmStaff, RsmStaffInput } from "@/types/rsm";

export async function GET() {
  const auth = await getRsmAuth();
  if (auth.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const staff = await mongo.find<RsmStaff>(
      RSM_COLLECTIONS.staff,
      {},
      { createdAt: -1 }
    );
    // Never send raw passwords to the client, even to an admin's browser —
    // the list view only needs to show who exists, not their credentials.
    const sanitized = staff.map(({ password, ...rest }) => rest);
    return NextResponse.json({ staff: sanitized });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load staff" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const auth = await getRsmAuth();
  if (auth.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = (await req.json()) as RsmStaffInput;

  if (!body.username?.trim() || !body.password?.trim() || !body.name?.trim()) {
    return NextResponse.json(
      { error: "Username, password, and name are required" },
      { status: 400 }
    );
  }

  const username = body.username.toLowerCase().trim();

  try {
    const existing = await mongo.findOne<RsmStaff>(RSM_COLLECTIONS.staff, {
      username,
    });
    if (existing) {
      return NextResponse.json(
        { error: "That username is already taken" },
        { status: 400 }
      );
    }

    const doc = {
      username,
      password: body.password,
      name: body.name.trim(),
      email: body.email || "",
      role: body.role || "staff",
      allowedModules: body.allowedModules || [],
      hideFinancials: body.hideFinancials ?? false,
      active: body.active ?? true,
      createdAt: new Date().toISOString(),
    };

    const result = await mongo.insertOne(RSM_COLLECTIONS.staff, doc);
    const { password, ...safeDoc } = doc;
    return NextResponse.json({
      success: true,
      staff: { _id: result.insertedId, ...safeDoc },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create staff account" },
      { status: 500 }
    );
  }
}
