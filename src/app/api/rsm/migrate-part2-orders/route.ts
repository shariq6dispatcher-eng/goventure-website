import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import ordersData from "@/data/migration/part2-orders.json";

/**
 * ONE-TIME DATA MIGRATION ROUTE — Part 2 continuation (orders only).
 *
 * Split out from /api/rsm/migrate-part2 because looping customers + orders
 * together in one request tripped Cloudflare's per-invocation subrequest
 * limit. This route only does orders (32 records, well under the limit).
 *
 * Visit /api/rsm/migrate-part2-orders?key=YOUR_ADMIN_PASSWORD once.
 * Safe to re-run — already-inserted orders are skipped, not duplicated.
 *
 * DELETE THIS FILE (and migrate-part2/route.ts, and the part2-*.json data
 * files) once you've confirmed all 32 orders landed in Atlas.
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!process.env.ADMIN_PASSWORD || key !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = {
    orders: { inserted: 0, skipped: 0, errors: [] as string[] },
  };

  for (const doc of ordersData) {
    try {
      await mongo.insertOne(RSM_COLLECTIONS.orders, doc);
      result.orders.inserted++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("duplicate key") || msg.includes("E11000")) {
        result.orders.skipped++;
      } else {
        result.orders.errors.push(`${doc._id}: ${msg}`);
      }
    }
  }

  return NextResponse.json(result);
}
