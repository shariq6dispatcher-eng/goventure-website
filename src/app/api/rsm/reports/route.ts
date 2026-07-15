import { NextResponse } from "next/server";
import { mongo } from "@/lib/mongodb";
import { RSM_COLLECTIONS } from "@/types/constants";
import { getRsmAuth } from "@/lib/rsm-auth";
import type { Order, Payment, Expense, DigitizingJob, Customer } from "@/types/rsm";

// Helper: is this ISO-ish date string ("YYYY-MM-DD" or full ISO) inside
// the given "YYYY-MM" month?
function inMonth(dateStr: string | undefined, month: string): boolean {
  if (!dateStr) return false;
  return dateStr.slice(0, 7) === month;
}

// Helper: which "YYYY-MM" bucket a payment belongs in — bookedMonth takes
// precedence when the payment was deliberately backdated to a previous
// month (e.g. confirming a missed June payment in July but wanting it to
// still count as June's cash collected), otherwise falls back to the
// payment's actual date.
function paymentInMonth(payment: Payment, month: string): boolean {
  const bucket = payment.bookedMonth || payment.date?.slice(0, 7);
  return bucket === month;
}

export async function GET(request: Request) {
  await getRsmAuth();

  const { searchParams } = new URL(request.url);
  // Default to current month if none given, e.g. "2026-07"
  const month = searchParams.get("month") || new Date().toISOString().slice(0, 7);

  try {
    const [allOrders, allPayments, allExpenses, allJobs, allCustomers] = await Promise.all([
      mongo.find<Order>(RSM_COLLECTIONS.orders),
      mongo.find<Payment>(RSM_COLLECTIONS.payments),
      mongo.find<Expense>(RSM_COLLECTIONS.expenses),
      mongo.find<DigitizingJob>(RSM_COLLECTIONS.digitizingJobs),
      mongo.find<Customer>(RSM_COLLECTIONS.customers),
    ]);

    // ---- Filter each collection to the selected month ----
    const orders = allOrders.filter((o) => inMonth(o.orderDate, month));
    const payments = allPayments.filter((p) => paymentInMonth(p, month));
    const expenses = allExpenses.filter((e) => inMonth(e.date, month));
    const jobs = allJobs.filter((j) => inMonth(j.createdAt, month));

    // ---- Orders section ----
    const ordersGross = orders.reduce((s, o) => s + o.total, 0);
    const ordersByStatus: Record<string, number> = {};
    for (const o of orders) {
      ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
    }
    const categoryTotals: Record<string, { count: number; amount: number }> = {};
    for (const o of orders) {
      for (const item of o.items) {
        if (!categoryTotals[item.category]) {
          categoryTotals[item.category] = { count: 0, amount: 0 };
        }
        categoryTotals[item.category].count += item.quantity;
        categoryTotals[item.category].amount += item.price * item.quantity;
      }
    }

    // ---- Payments section ----
    const confirmedPayments = payments.filter((p) => p.confirmed);
    const cashCollected = confirmedPayments.reduce((s, p) => s + p.amount, 0);
    const pendingPaymentsCount = payments.filter((p) => !p.confirmed).length;
    const paymentsByMethod: Record<string, number> = {};
    for (const p of confirmedPayments) {
      paymentsByMethod[p.paymentMethod] = (paymentsByMethod[p.paymentMethod] || 0) + p.amount;
    }

    // ---- Receivables (not month-scoped — always "as of now") ----
    const totalReceivables = allOrders.reduce((s, o) => s + o.balanceDue, 0);

    // ---- Expenses section ----
    const expensesTotal = expenses.reduce((s, e) => s + e.amount, 0);
    const expensesByCategory: Record<string, number> = {};
    for (const e of expenses) {
      expensesByCategory[e.category] = (expensesByCategory[e.category] || 0) + e.amount;
    }

    // ---- Digitizing jobs section ----
    const jobsByStatus: Record<string, number> = {};
    for (const j of jobs) {
      jobsByStatus[j.status] = (jobsByStatus[j.status] || 0) + 1;
    }

    // ---- Profitability ----
    const netProfit = cashCollected - expensesTotal;
    const margin = cashCollected > 0 ? (netProfit / cashCollected) * 100 : 0;

    // ---- Top customers this month (by confirmed payments) ----
    const customerRevenue: Record<string, number> = {};
    for (const p of confirmedPayments) {
      customerRevenue[p.customerName] = (customerRevenue[p.customerName] || 0) + p.amount;
    }
    const topCustomers = Object.entries(customerRevenue)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return NextResponse.json({
      month,
      orders: {
        count: orders.length,
        gross: ordersGross,
        byStatus: ordersByStatus,
        byCategory: categoryTotals,
        list: orders,
      },
      payments: {
        count: payments.length,
        confirmedCount: confirmedPayments.length,
        pendingCount: pendingPaymentsCount,
        cashCollected,
        byMethod: paymentsByMethod,
        list: payments,
      },
      receivables: {
        total: totalReceivables,
      },
      expenses: {
        count: expenses.length,
        total: expensesTotal,
        byCategory: expensesByCategory,
        list: expenses,
      },
      digitizingJobs: {
        count: jobs.length,
        byStatus: jobsByStatus,
        list: jobs,
      },
      profitability: {
        revenue: cashCollected,
        expenses: expensesTotal,
        netProfit,
        margin,
      },
      topCustomers,
      totalActiveCustomers: allCustomers.length,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load report data" },
      { status: 500 }
    );
  }
}
