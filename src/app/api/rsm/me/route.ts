import { NextResponse } from "next/server";
import { getRsmAuth } from "@/lib/rsm-auth";

export async function GET() {
  const auth = await getRsmAuth();
  return NextResponse.json(auth);
}