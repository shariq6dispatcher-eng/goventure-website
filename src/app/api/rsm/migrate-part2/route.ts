import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import customersData from "@/data/migration/part2-customers.json";
import ordersData from "@/data/migration/part2-orders.json";

/**
 * ONE-TIME DATA MIGRATION ROUTE — Part 2 (customers + orders).
 *
 * Visit /api/rsm/migrate-part2?key=YOUR_ADMIN_PASSWORD once, after deploying.
 * Safe to re-run: records that already exist (matched by _id) are skipped,
 * not duplicated.
 *
 * DELETE THIS FILE (and src/data/migration/part2-*.json) once you've
 * confirmed the data landed in Atlas. It has no auth beyond the shared
 * admin password and isn't meant to stay in the codebase long-term.
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!process.env.ADMIN_PASSWORD || key !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = {
    customers: { inserted: 0, skipped: 0, errors: [] as string[] },
    orders: { inserted: 0, skipped: 0, errors: [] as string[] },
  };

  for (const doc of customersData) {
    try {
      await mongo.insertOne(RSM_COLLECTIONS.customers, doc);
      result.customers.inserted++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("duplicate key") || msg.includes("E11000")) {
        result.customers.skipped++;
      } else {
        result.customers.errors.push(`${doc._id}: ${msg}`);
      }
    }
  }

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
