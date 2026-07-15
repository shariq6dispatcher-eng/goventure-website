import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { Order, Payment, Customer } from "@/types/rsm";

// Returns { customerId: currentBalance } for every customer, computed the
// same way as /api/rsm/ledger (live from orders + payments, not the stored
// rsm_ledger collection). Used by the Ledger page sidebar so each customer
// row can show their outstanding balance without loading full history.

export async function GET() {
  await getRsmAuth();

  try {
    const [customers, orders, payments] = await Promise.all([
      mongo.find<Customer>(RSM_COLLECTIONS.customers),
      mongo.find<Order>(RSM_COLLECTIONS.orders),
      mongo.find<Payment>(RSM_COLLECTIONS.payments),
    ]);

    const balances: Record<string, number> = {};

    // Seed every known customer at 0 so customers with no activity yet
    // still show up (as $0.00) instead of being missing from the map.
    for (const c of customers) balances[c._id] = 0;

    for (const order of orders) {
      balances[order.customerId] = (balances[order.customerId] || 0) + order.total;
    }

    for (const payment of payments) {
      if (!payment.confirmed) continue;
      balances[payment.customerId] =
        (balances[payment.customerId] || 0) - payment.amount;
    }

    return NextResponse.json({ balances });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load balances", details: `${err}` },
      { status: 500 }
    );
  }
}
