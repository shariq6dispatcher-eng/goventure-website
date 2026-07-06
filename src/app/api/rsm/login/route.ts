import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import type { RsmStaff } from "@/types/rsm";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  let staff: RsmStaff | null = null;
  try {
    staff = await mongo.findOne<RsmStaff>(RSM_COLLECTIONS.staff, {
      username: String(username).toLowerCase().trim(),
    });
  } catch {
    return NextResponse.json(
      { error: "Server misconfiguration (database)" },
      { status: 500 }
    );
  }

  if (!staff || !staff.active || staff.password !== password) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({
    success: true,
    username: staff.username,
    name: staff.name,
    role: staff.role,
  });

  res.cookies.set(
    "rsm-auth",
    JSON.stringify({ username: staff.username, role: staff.role }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }
  );

  return res;
}
