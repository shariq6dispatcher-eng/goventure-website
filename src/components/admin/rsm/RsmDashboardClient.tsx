"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Receipt,
  ArrowDownRight,
  Clock,
  Scissors,
  Eye,
  TrendingUp,
  TrendingDown,
  FileBarChart,
  PlusCircle,
  Users,
  AlertTriangle,
  Activity,
} from "lucide-react";
import RsmStatusBadge from "./RsmStatusBadge";
import { RsmLineChart, RsmDonutChart } from "./RsmCharts";
import type { Order, Payment, Expense, Customer, DigitizingJob } from "@/types/rsm";

interface Props {
  orders: Order[];
  payments: Payment[];
  expenses: Expense[];
  customers: Customer[];
  digitizingJobs: DigitizingJob[];
}

export default function RsmDashboardClient({
  orders,
  payments,
  expenses,
  customers,
  digitizingJobs,
}: Props) {
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();

    const now = new Date();
    monthsSet.add(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    );

    orders.forEach((o) => {
      if (o.orderDate && o.orderDate.length >= 7) {
        monthsSet.add(o.orderDate.substring(0, 7));
      }
    });
    payments.forEach((p) => {
      if (p.date && p.date.length >= 7) {
        monthsSet.add(p.date.substring(0, 7));
      }
    });
    expenses.forEach((e) => {
      if (e.date && e.date.length >= 7) {
        monthsSet.add(e.date.substring(0, 7));
      }
    });

    return Array.from(monthsSet).sort((a, b) => b.localeCompare(a));
  }, [orders, payments, expenses]);

  const [selectedMonth, setSelectedMonth] = useState(availableMonths[0]);

  const stats = useMemo(() => {
    const selectedMonthOrders = orders.filter(
      (o) => o.status !== "Cancelled" && o.orderDate.startsWith(selectedMonth)
    );
    const totalInvoiced = selectedMonthOrders.reduce(
      (sum, o) => sum + o.total,
      0
    );

    const selectedMonthPayments = payments.filter((p) =>
      p.date.startsWith(selectedMonth)
    );
    const totalPaymentsReceived = selectedMonthPayments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    const selectedMonthExpenses = expenses.filter((e) =>
      e.date.startsWith(selectedMonth)
    );
    const totalExpensesSum = selectedMonthExpenses.reduce(
      (sum, e) => sum + e.amount,
      0
    );

    // Cumulative outstanding receivables up to and including selectedMonth
    const outstandingReceivables = customers.reduce((sum, c) => {
      const clientInvoices = orders.filter(
        (o) =>
          o.customerId === c._id &&
          o.status !== "Cancelled" &&
          o.orderDate.substring(0, 7) <= selectedMonth
      );
      const clientPayments = payments.filter(
        (p) =>
          p.customerId === c._id &&
          p.date.substring(0, 7) <= selectedMonth
      );
      const invoicedVal = clientInvoices.reduce((s, o) => s + o.total, 0);
      const paidVal = clientPayments.reduce((s, p) => s + p.amount, 0);
      const balance = invoicedVal - paidVal;
      return balance > 0 ? sum + balance : sum;
    }, 0);

    const netProfit = totalPaymentsReceived - totalExpensesSum;

    return {
      totalInvoiced,
      totalPaymentsReceived,
      outstandingReceivables,
      totalExpensesSum,
      netProfit,
    };
  }, [orders, payments, expenses, customers, selectedMonth]);

  const activeOrders = useMemo(
    () =>
      orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled"),
    [orders]
  );

  const pipelineCounts = useMemo(
    () => ({
      pending: orders.filter((o) => o.status === "Pending").length,
      inProgress: orders.filter((o) => o.status === "In Progress").length,
      completed: orders.filter((o) => o.status === "Completed").length,
      delivered: orders.filter((o) => o.status === "Delivered").length,
    }),
    [orders]
  );
// Last 6 months of revenue vs expenses, oldest to newest, for the trend chart.
  const monthlyTrend = useMemo(() => {
    const now = new Date();
    const months: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }

    const revenue = months.map((m) =>
      payments
        .filter((p) => p.confirmed && p.date.startsWith(m))
        .reduce((sum, p) => sum + p.amount, 0)
    );
    const expenseTotals = months.map((m) =>
      expenses
        .filter((e) => e.date.startsWith(m))
        .reduce((sum, e) => sum + e.amount, 0)
    );

    const labels = months.map((m) =>
      new Date(m + "-02").toLocaleString("default", { month: "short" })
    );

    return { labels, revenue, expenseTotals };
  }, [payments, expenses]);

  const orderStatusDonut = useMemo(
    () => [
      { label: "Pending", value: pipelineCounts.pending, color: "#fbbf24" },
      { label: "In Progress", value: pipelineCounts.inProgress, color: "#38bdf8" },
      { label: "Completed", value: pipelineCounts.completed, color: "#D4AF37" },
      { label: "Delivered", value: pipelineCounts.delivered, color: "#34d399" },
    ],
    [pipelineCounts]
  );
  // "Needs Attention" — things that genuinely need a human to look at them
  // today, not just a status count. Kept lightweight: computed from data
  // already passed into this component, no extra API calls.
  const alerts = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);

    const overdueOrders = orders
      .filter(
        (o) =>
          o.status !== "Delivered" &&
          o.status !== "Cancelled" &&
          o.dueDate &&
          o.dueDate < todayStr
      )
      .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));

    // Unconfirmed payments older than 3 days — a fresh submission isn't
    // urgent, but one sitting unconfirmed for a while probably is.
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const staleUnconfirmedPayments = payments.filter(
      (p) => !p.confirmed && new Date(p.date) < threeDaysAgo
    );

    // Customers with a meaningful outstanding balance (uses the same
    // invoiced-minus-paid logic as the Receivables KPI above, but per
    // customer and all-time rather than scoped to selectedMonth).
    const customerBalances = customers
      .map((c) => {
        const invoiced = orders
          .filter((o) => o.customerId === c._id && o.status !== "Cancelled")
          .reduce((s, o) => s + o.total, 0);
        const paid = payments
          .filter((p) => p.customerId === c._id && p.confirmed)
          .reduce((s, p) => s + p.amount, 0);
        return { customer: c, balance: invoiced - paid };
      })
      .filter((x) => x.balance >= 100)
      .sort((a, b) => b.balance - a.balance);

    return { overdueOrders, staleUnconfirmedPayments, customerBalances };
  }, [orders, payments, customers]);
  // Unified activity feed — merges the 4 collections into one timeline by
  // createdAt, newest first. No new data model: just re-reading data this
  // component already has (plus digitizingJobs, added in Part 1).
  type ActivityItem = {
    id: string;
    kind: "order" | "payment" | "expense" | "digitizingJob";
    text: string;
    amount?: number;
    createdAt: string;
    href: string;
  };

  const activityFeed = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];

    for (const o of orders) {
      items.push({
        id: o._id,
        kind: "order",
        text: `New order ${o.orderNo} for ${o.customerName}`,
        amount: o.total,
        createdAt: o.createdAt,
        href: `/RSM/orders/${o._id}`,
      });
    }

    for (const p of payments) {
      items.push({
        id: p._id,
        kind: "payment",
        text: `Payment ${p.confirmed ? "confirmed" : "submitted"} by ${p.customerName}`,
        amount: p.amount,
        createdAt: p.createdAt,
        href: `/RSM/payments/${p._id}`,
      });
    }

    for (const e of expenses) {
      items.push({
        id: e._id,
        kind: "expense",
        text: `Expense logged — ${e.category}`,
        amount: e.amount,
        createdAt: e.createdAt,
        href: `/RSM/expenses/${e._id}`,
      });
    }

    for (const j of digitizingJobs) {
      items.push({
        id: j._id,
        kind: "digitizingJob",
        text: `Digitizing job "${j.designName}" for ${j.customerName}`,
        createdAt: j.createdAt,
        href: `/RSM/digitizing-jobs/${j._id}`,
      });
    }

    return items
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 8);
  }, [orders, payments, expenses, digitizingJobs]);

  // Lightweight "time ago" formatter — no date library needed.
  function timeAgo(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(iso).toLocaleDateString();
  }

  const ACTIVITY_ICON: Record<ActivityItem["kind"], React.ElementType> = {
    order: Receipt,
    payment: ArrowDownRight,
    expense: Scissors,
    digitizingJob: Users,
  };

  const ACTIVITY_COLOR: Record<ActivityItem["kind"], string> = {
    order: "text-sky-400 bg-sky-500/10",
    payment: "text-emerald-400 bg-emerald-500/10",
    expense: "text-rose-400 bg-rose-500/10",
    digitizingJob: "text-[#D4AF37] bg-[#D4AF37]/10",
  };
  const profitability = useMemo(() => {
    const paidOrders = orders.filter(
      (o) => o.status !== "Cancelled" && o.orderDate.startsWith(selectedMonth)
    );
    const grossRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const totalDiscount = paidOrders.reduce((sum, o) => sum + (o.discount || 0), 0);
    const totalTax = paidOrders.reduce((sum, o) => sum + (o.tax || 0), 0);

    const monthExpenses = expenses.filter((e) => e.date.startsWith(selectedMonth));
    const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

    const monthPayments = payments.filter((p) => p.date.startsWith(selectedMonth));
    const totalCollected = monthPayments.reduce((sum, p) => sum + p.amount, 0);

    const netProfit = totalCollected - totalExpenses;
    const profitMargin =
      totalCollected > 0 ? (netProfit / totalCollected) * 100 : 0;

    return {
      grossRevenue,
      totalDiscount,
      totalTax,
      totalExpenses,
      totalCollected,
      netProfit,
      profitMargin,
    };
  }, [orders, payments, expenses, selectedMonth]);

  const selectedMonthName = new Date(
    selectedMonth + "-02"
  ).toLocaleString("default", { month: "long", year: "numeric" });

  const money = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div className="space-y-6">
    {/* MONTH FILTER */}
      <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h4 className="font-bold text-xs sm:text-sm text-white">
            Monthly Business Situation
          </h4>
          <p className="text-[11px] sm:text-xs text-zinc-400 mt-1">
            Viewing financials for{" "}
            <span className="text-[#D4AF37] font-bold font-mono">
              {selectedMonthName}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <label className="text-zinc-400 text-[11px] sm:text-xs font-bold whitespace-nowrap hidden sm:inline">
            Change Month:
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full sm:w-auto bg-black border border-zinc-800 hover:border-zinc-700 text-xs font-bold text-zinc-200 p-2.5 rounded-xl outline-none focus:border-[#D4AF37] transition font-mono sm:min-w-[180px]"
          >
            {availableMonths.map((month) => {
              const dateObj = new Date(month + "-02");
              const monthName = dateObj.toLocaleString("default", {
                month: "long",
                year: "numeric",
              });
              return (
                <option key={month} value={month}>
                  {monthName} ({month})
                </option>
              );
            })}
          </select>
        </div>
      </div>
     {/* KPI STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-zinc-900/60 border border-zinc-900 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:border-zinc-700 transition">
          <div className="flex justify-between items-start gap-1">
            <span className="text-zinc-500 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest leading-tight">
              Invoiced
            </span>
            <span className="p-1.5 sm:p-2 bg-sky-500/10 text-sky-400 rounded-lg shrink-0">
              <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <h3 className="text-base sm:text-2xl font-black mt-2 sm:mt-3 text-white font-mono truncate">
            {money(stats.totalInvoiced)}
          </h3>
          <p className="text-zinc-500 text-[10px] sm:text-xs mt-1 sm:mt-2 font-mono hidden sm:block">
            Gross billed orders in {selectedMonthName}
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-900 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:border-zinc-700 transition">
          <div className="flex justify-between items-start gap-1">
            <span className="text-zinc-500 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest leading-tight">
              Payments
            </span>
            <span className="p-1.5 sm:p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
              <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <h3 className="text-base sm:text-2xl font-black mt-2 sm:mt-3 text-emerald-400 font-mono truncate">
            {money(stats.totalPaymentsReceived)}
          </h3>
          <p className="text-emerald-500 text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium hidden sm:block">
            Cash collected in {selectedMonthName}
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-900 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:border-zinc-700 transition">
          <div className="flex justify-between items-start gap-1">
            <span className="text-zinc-500 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest leading-tight">
              Receivables
            </span>
            <span className="p-1.5 sm:p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <h3 className="text-base sm:text-2xl font-black mt-2 sm:mt-3 text-amber-400 font-mono truncate">
            {money(stats.outstandingReceivables)}
          </h3>
          <p className="text-zinc-500 text-[10px] sm:text-xs mt-1 sm:mt-2 hidden sm:block">
            Unpaid dues up to {selectedMonthName}
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-900 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:border-zinc-700 transition">
          <div className="flex justify-between items-start gap-1">
            <span className="text-zinc-500 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest leading-tight">
              Expenses
            </span>
            <span className="p-1.5 sm:p-2 bg-rose-500/10 text-rose-400 rounded-lg shrink-0">
              <Scissors className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <h3 className="text-base sm:text-2xl font-black mt-2 sm:mt-3 text-white font-mono truncate">
            {money(stats.totalExpensesSum)}
          </h3>
          <div className="flex items-center justify-between gap-1 mt-1 sm:mt-2 text-xs text-zinc-400">
            <span className="text-zinc-500 text-[10px] hidden sm:inline">
              Logged in {selectedMonthName}
            </span>
            <span
              className={`font-mono text-[10px] sm:text-[11px] font-bold ${
                stats.netProfit >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              Net: {money(stats.netProfit)}
            </span>
          </div>
        </div>
      </div>
     {/* ACTIVE PRODUCTION PIPELINE */}
      <div className="bg-zinc-900/60 border border-zinc-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-3 sm:space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-900 pb-3 gap-2">
          <div className="min-w-0">
            <h4 className="font-bold text-xs sm:text-sm text-white">
              Active Production Pipeline
            </h4>
            <p className="text-[11px] sm:text-xs text-zinc-400 hidden sm:block">
              Real-time status of orders and digitizing designs
            </p>
          </div>
          <Link
            href="/RSM/orders"
            className="text-[11px] sm:text-xs text-[#D4AF37] hover:text-[#e5c458] font-bold whitespace-nowrap shrink-0"
          >
            Manage All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <div className="bg-black border border-zinc-800 p-2.5 sm:p-3.5 rounded-lg text-center">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-500 block leading-tight">
              Pending
            </span>
            <span className="text-lg sm:text-2xl font-mono font-bold text-amber-400 block mt-1">
              {pipelineCounts.pending}
            </span>
          </div>
          <div className="bg-black border border-zinc-800 p-2.5 sm:p-3.5 rounded-lg text-center">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-500 block leading-tight">
              In Progress
            </span>
            <span className="text-lg sm:text-2xl font-mono font-bold text-sky-400 block mt-1">
              {pipelineCounts.inProgress}
            </span>
          </div>
          <div className="bg-black border border-zinc-800 p-2.5 sm:p-3.5 rounded-lg text-center">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-500 block leading-tight">
              Completed
            </span>
            <span className="text-lg sm:text-2xl font-mono font-bold text-[#D4AF37] block mt-1">
              {pipelineCounts.completed}
            </span>
          </div>
          <div className="bg-black border border-zinc-800 p-2.5 sm:p-3.5 rounded-lg text-center">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-500 block leading-tight">
              Delivered
            </span>
            <span className="text-lg sm:text-2xl font-mono font-bold text-emerald-400 block mt-1">
              {pipelineCounts.delivered}
            </span>
          </div>
        </div>
        <div className="space-y-3 mt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
            Urgent & Active Orders
          </span>

         {activeOrders.slice(0, 4).map((o) => (
            <div
              key={o._id}
              className="bg-black border border-zinc-900 p-3 sm:p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 hover:border-zinc-700 transition"
            >
              <div className="min-w-0 w-full">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-[11px] sm:text-xs font-mono font-black text-[#D4AF37]">
                    {o.orderNo}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-white truncate">
                    {o.designName || "Custom Items"}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-zinc-500 font-mono">
                    ({o.items.length} items)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-zinc-400 mt-1 flex-wrap">
                  <span>
                    Client:{" "}
                    <span className="text-zinc-300 font-semibold">
                      {o.customerName}
                    </span>
                  </span>
                  <span>•</span>
                  <span className="text-rose-400">Due: {o.dueDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <RsmStatusBadge status={o.status} />
                <Link
                  href={`/RSM/orders/${o._id}`}
                  className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition"
                  title="View Order"
                >
                  <Eye className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}

          {activeOrders.length === 0 && (
            <div className="text-center py-8 text-zinc-500 border border-dashed border-zinc-800 rounded-lg text-xs">
              No active orders in production. Create some in the Orders tab!
            </div>
          )}
        </div>
      </div>
      {/* NEEDS ATTENTION */}
      {(alerts.overdueOrders.length > 0 ||
        alerts.staleUnconfirmedPayments.length > 0 ||
        alerts.customerBalances.length > 0) && (
        <div className="bg-zinc-900/60 border border-amber-900/40 rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
          <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2 mb-3">
            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            Needs Attention
          </h4>

          <div className="space-y-2">
            {alerts.overdueOrders.slice(0, 3).map((o) => (
              <Link
                key={o._id}
                href={`/RSM/orders/${o._id}`}
                className="flex items-center justify-between gap-2 bg-black border border-zinc-900 hover:border-amber-900/60 rounded-lg p-2.5 sm:p-3 transition"
              >
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs font-mono font-black text-[#D4AF37]">
                    {o.orderNo}
                  </span>
                  <span className="text-[11px] sm:text-xs text-zinc-300 ml-2 truncate">
                    {o.customerName}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-rose-400 font-semibold shrink-0">
                  Overdue since {o.dueDate}
                </span>
              </Link>
            ))}

            {alerts.staleUnconfirmedPayments.slice(0, 3).map((p) => (
              <Link
                key={p._id}
                href={`/RSM/payments/${p._id}`}
                className="flex items-center justify-between gap-2 bg-black border border-zinc-900 hover:border-amber-900/60 rounded-lg p-2.5 sm:p-3 transition"
              >
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs font-mono font-black text-[#D4AF37]">
                    {p.paymentNo}
                  </span>
                  <span className="text-[11px] sm:text-xs text-zinc-300 ml-2 truncate">
                    {p.customerName}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-amber-400 font-semibold shrink-0">
                  Unconfirmed since {p.date}
                </span>
              </Link>
            ))}

            {alerts.customerBalances.slice(0, 3).map(({ customer, balance }) => (
              <Link
                key={customer._id}
                href="/RSM/customers"
                className="flex items-center justify-between gap-2 bg-black border border-zinc-900 hover:border-amber-900/60 rounded-lg p-2.5 sm:p-3 transition"
              >
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs text-zinc-300 truncate">
                    {customer.name}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-amber-400 font-semibold shrink-0 font-mono">
                  Owes {money(balance)}
                </span>
              </Link>
            ))}
          </div>

          {(alerts.overdueOrders.length > 3 ||
            alerts.staleUnconfirmedPayments.length > 3 ||
            alerts.customerBalances.length > 3) && (
            <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-2.5">
              Showing top 3 per category — check Orders, Payments, and
              Customers tabs for the full lists.
            </p>
          )}
        </div>
      )}
{/* TRENDS: revenue/expense line chart + orders-by-status donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-zinc-900/60 border border-zinc-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
          <h4 className="font-bold text-xs sm:text-sm text-white mb-1">
            Revenue vs Expenses
          </h4>
          <p className="text-[11px] sm:text-xs text-zinc-400 mb-3">
            Last 6 months
          </p>
          <RsmLineChart
            categories={monthlyTrend.labels}
            series={[
              { label: "Revenue", color: "#34d399", points: monthlyTrend.revenue },
              { label: "Expenses", color: "#f87171", points: monthlyTrend.expenseTotals },
            ]}
          />
        </div>

        <div className="bg-zinc-900/60 border border-zinc-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
          <h4 className="font-bold text-xs sm:text-sm text-white mb-1">
            Orders by Status
          </h4>
          <p className="text-[11px] sm:text-xs text-zinc-400 mb-3">
            All-time pipeline
          </p>
          <RsmDonutChart segments={orderStatusDonut} />
        </div>
      </div>
      {/* ACTIVITY FEED */}
      <div className="bg-zinc-900/60 border border-zinc-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
        <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2 mb-3">
          <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
          Recent Activity
        </h4>

        <div className="space-y-2">
          {activityFeed.map((item) => {
            const Icon = ACTIVITY_ICON[item.kind];
            return (
              <Link
                key={`${item.kind}-${item.id}`}
                href={item.href}
                className="flex items-center gap-3 bg-black border border-zinc-900 hover:border-zinc-700 rounded-lg p-2.5 sm:p-3 transition"
              >
                <span className={`shrink-0 p-1.5 rounded-lg ${ACTIVITY_COLOR[item.kind]}`}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] sm:text-xs text-zinc-300 truncate">{item.text}</p>
                </div>
                <div className="text-right shrink-0">
                  {item.amount !== undefined && (
                    <p className="text-[11px] sm:text-xs font-mono font-bold text-white">
                      {money(item.amount)}
                    </p>
                  )}
                  <p className="text-[10px] text-zinc-500">{timeAgo(item.createdAt)}</p>
                </div>
              </Link>
            );
          })}

          {activityFeed.length === 0 && (
            <div className="text-center py-8 text-zinc-500 border border-dashed border-zinc-800 rounded-lg text-xs">
              No activity yet.
            </div>
          )}
        </div>
      </div>
     {/* BUSINESS PROFITABILITY STATEMENT */}
      <div className="bg-zinc-900/60 border border-zinc-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-3">
          <div className="min-w-0">
            <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
              <FileBarChart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] shrink-0" />
              <span className="truncate">Profitability Statement</span>
            </h4>
            <p className="text-[11px] sm:text-xs text-zinc-400 hidden sm:block">
              Financial breakdown for {selectedMonthName}
            </p>
          </div>
          <span
            className={`flex items-center gap-1 text-[11px] sm:text-xs font-mono font-bold px-2.5 py-1 rounded-full border w-fit ${
              profitability.netProfit >= 0
                ? "bg-emerald-950 text-emerald-300 border-emerald-900"
                : "bg-red-950 text-red-300 border-red-900"
            }`}
          >
            {profitability.netProfit >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {profitability.profitMargin.toFixed(1)}% margin
          </span>
        </div>

       <div className="flex justify-between items-center py-1 sm:py-1.5 border-b border-zinc-900/80">
            <span className="text-[11px] sm:text-xs text-zinc-400">Gross Revenue</span>
            <span className="text-xs sm:text-sm font-mono font-bold text-white">
              {money(profitability.grossRevenue)}
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-zinc-900/80">
            <span className="text-xs text-zinc-400">Cash Collected</span>
            <span className="text-sm font-mono font-bold text-emerald-400">
              {money(profitability.totalCollected)}
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-zinc-900/80">
            <span className="text-xs text-zinc-400">Discounts Given</span>
            <span className="text-sm font-mono font-bold text-amber-400">
              -{money(profitability.totalDiscount)}
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-zinc-900/80">
            <span className="text-xs text-zinc-400">Tax Collected</span>
            <span className="text-sm font-mono font-bold text-zinc-300">
              {money(profitability.totalTax)}
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-zinc-900/80">
            <span className="text-xs text-zinc-400">Total Expenses</span>
            <span className="text-sm font-mono font-bold text-rose-400">
              -{money(profitability.totalExpenses)}
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-zinc-900/80">
            <span className="text-xs font-bold text-white">Net Profit</span>
            <span
              className={`text-sm font-mono font-black ${
                profitability.netProfit >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {money(profitability.netProfit)}
          </span>
          </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 pt-2">
          <Link
            href="/RSM/orders/new"
            className="flex items-center justify-center sm:justify-start gap-2 text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#D4AF37] text-black hover:bg-[#e5c458] transition"
          >
            <PlusCircle className="w-3.5 h-3.5 shrink-0" />
            New Order
          </Link>
          <Link
            href="/RSM/payments/new"
            className="flex items-center justify-center sm:justify-start gap-2 text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:border-zinc-700 transition"
          >
            <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
            Record Payment
          </Link>
          <Link
            href="/RSM/expenses/new"
            className="flex items-center justify-center sm:justify-start gap-2 text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:border-zinc-700 transition"
          >
            <Scissors className="w-3.5 h-3.5 shrink-0" />
            Log Expense
          </Link>
          <Link
            href="/RSM/customers"
            className="flex items-center justify-center sm:justify-start gap-2 text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:border-zinc-700 transition"
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            Manage Customers
          </Link>
        </div>
      </div>
    </div>
  );
}
