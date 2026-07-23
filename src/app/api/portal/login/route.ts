import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import type { Customer } from "@/types/rsm";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  let customer: Customer | null = null;
  try {
    customer = await mongo.findOne<Customer>(RSM_COLLECTIONS.customers, {
      portalUsername: String(username).toLowerCase().trim(),
    });
  } catch {
    return NextResponse.json(
      { error: "Server misconfiguration (database)" },
      { status: 500 }
    );
  }

  if (
    !customer ||
    !customer.portalEnabled ||
    !customer.portalPassword ||
    customer.portalPassword !== password
  ) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({
    success: true,
    username: customer.portalUsername,
    name: customer.name,
  });

  res.cookies.set(
    "customer-portal-auth",
    JSON.stringify({
      customerId: customer._id,
      username: customer.portalUsername,
      name: customer.name,
    }),
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
