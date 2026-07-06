import { NextResponse } from "next/server";
import { mongo, toObjectId } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { RsmStaff, RsmStaffInput } from "@/types/rsm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getRsmAuth();
  if (auth.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const { id } = await params;

  try {
    const staff = await mongo.findOne<RsmStaff>(RSM_COLLECTIONS.staff, {
      _id: toObjectId(id),
    });

    if (!staff) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
    }

    const { password, ...safeStaff } = staff;
    return NextResponse.json({ staff: safeStaff });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load staff member" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getRsmAuth();
  if (auth.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const { id } = await params;
  const body = (await req.json()) as Partial<RsmStaffInput>;

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const existing = await mongo.findOne<RsmStaff>(RSM_COLLECTIONS.staff, {
      _id: toObjectId(id),
    });
    if (!existing) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
    }

    // Username changes need a uniqueness check; leaving password blank on
    // an edit means "keep the existing one" rather than wiping it out.
    let username = existing.username;
    if (body.username && body.username.toLowerCase().trim() !== existing.username) {
      username = body.username.toLowerCase().trim();
      const clash = await mongo.findOne<RsmStaff>(RSM_COLLECTIONS.staff, { username });
      if (clash) {
        return NextResponse.json(
          { error: "That username is already taken" },
          { status: 400 }
        );
      }
    }

    const update = {
      username,
      password: body.password?.trim() ? body.password : existing.password,
      name: body.name.trim(),
      email: body.email ?? existing.email ?? "",
      role: body.role ?? existing.role,
      allowedModules: body.allowedModules ?? existing.allowedModules ?? [],
      active: body.active ?? existing.active,
    };

    const result = await mongo.updateOne(
      RSM_COLLECTIONS.staff,
      { _id: toObjectId(id) },
      update
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update staff member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getRsmAuth();
  if (auth.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const { id } = await params;

  // Guard against an admin deleting their own account and locking
  // themselves out with no other admin able to fix it.
  if (auth.username) {
    const target = await mongo.findOne<RsmStaff>(RSM_COLLECTIONS.staff, {
      _id: toObjectId(id),
    });
    if (target && target.username === auth.username) {
      return NextResponse.json(
        { error: "You can't delete your own account while logged in as it" },
        { status: 400 }
      );
    }
  }

  try {
    const result = await mongo.deleteOne(RSM_COLLECTIONS.staff, {
      _id: toObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete staff member" },
      { status: 500 }
    );
  }
}
