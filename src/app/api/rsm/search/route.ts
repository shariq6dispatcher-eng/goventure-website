import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { Customer, Order, DigitizingJob } from "@/types/rsm";

// Simple case-insensitive "does this haystack contain the query" check.
// Kept dependency-free — no fuzzy search library, just substring matching
// across the handful of fields that actually matter for finding a record.
function matches(haystack: (string | undefined)[], q: string): boolean {
  const needle = q.toLowerCase();
  return haystack.some((h) => h && h.toLowerCase().includes(needle));
}

export interface SearchResultItem {
  type: "customer" | "order" | "digitizingJob";
  id: string;
  title: string; // primary display line
  subtitle: string; // secondary display line
  href: string;
}

export async function GET(request: Request) {
  await getRsmAuth();

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const [customers, orders, jobs] = await Promise.all([
      mongo.find<Customer>(RSM_COLLECTIONS.customers),
      mongo.find<Order>(RSM_COLLECTIONS.orders),
      mongo.find<DigitizingJob>(RSM_COLLECTIONS.digitizingJobs),
    ]);

    const results: SearchResultItem[] = [];

    for (const c of customers) {
      if (matches([c.name, c.email, c.phone, c.company], q)) {
        results.push({
          type: "customer",
          id: c._id,
          title: c.name,
          subtitle: c.company || c.email || c.phone || "Customer",
          href: "/RSM/customers",
        });
      }
    }

    for (const o of orders) {
      if (matches([o.orderNo, o.customerName, o.designName], q)) {
        results.push({
          type: "order",
          id: o._id,
          title: o.orderNo,
          subtitle: `${o.customerName} · ${o.status}`,
          href: `/RSM/orders/${o._id}`,
        });
      }
    }

    for (const j of jobs) {
      if (matches([j.designName, j.customerName], q)) {
        results.push({
          type: "digitizingJob",
          id: j._id,
          title: j.designName,
          subtitle: `${j.customerName} · ${j.status}`,
          href: `/RSM/digitizing-jobs/${j._id}`,
        });
      }
    }

    // Cap total results so the dropdown stays usable — most-relevant-first
    // isn't really meaningful with substring matching, so just truncate.
    return NextResponse.json({ results: results.slice(0, 20) });
  } catch (err) {
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
