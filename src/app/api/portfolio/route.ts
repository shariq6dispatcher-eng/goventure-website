import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Portfolio API is alive",
  });
}

export async function POST() {
  return NextResponse.json({
    success: true,
  });
}
