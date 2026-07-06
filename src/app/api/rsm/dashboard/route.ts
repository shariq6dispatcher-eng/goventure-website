import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { Order, Payment, Customer, DigitizingJob } from "@/types/rsm";

export async function GET() {
  await getRsmAuth();

  try {
    const [orders, payments, customers, digitizingJobs] = await Promise.all([
  mongo.find<Order>(RSM_COLLECTIONS.orders),
  mongo.find<Payment>(RSM_COLLECTIONS.payments),
  mongo.find<Customer>(RSM_COLLECTIONS.customers),
  mongo.find<DigitizingJob>(RSM_COLLECTIONS.digitizingJobs),
]);

    const openOrders = orders.filter(
      (o) => o.status !== "Delivered" && o.status !== "Cancelled"
    ).length;

    const pendingPayments = payments.filter((p) => !p.confirmed).length;

    // Counts jobs still in progress (not yet delivered), same spirit as
    // "Open Orders" above — a completed-and-delivered job isn't something
    // that needs attention on the dashboard anymore.
    const digitizingJobsCount = digitizingJobs.filter(
      (j) => j.status !== "Delivered"
    ).length;

    const totalOutstanding = orders.reduce((sum, o) => sum + o.balanceDue, 0);
    const totalRevenue = payments
      .filter((p) => p.confirmed)
      .reduce((sum, p) => sum + p.amount, 0);

    // Recent activity: last 5 orders, most recently created first.
    const recentOrders = [...orders]
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 5);

    return NextResponse.json({
      openOrders,
      pendingPayments,
      activeCustomers: customers.length,
      digitizingJobsCount,
      totalOutstanding,
      totalRevenue,
      recentOrders,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
