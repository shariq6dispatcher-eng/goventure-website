import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { LedgerEntry } from "@/types/rsm";

export async function GET(req: Request) {
  await getRsmAuth();

  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customerId");

  try {
    const filter = customerId ? { customerId } : {};
    const entries = await mongo.find<LedgerEntry>(
      RSM_COLLECTIONS.ledger,
      filter,
      { createdAt: -1 }
    );
    return NextResponse.json({ entries });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load ledger" },
      { status: 500 }
    );
  }
}
