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
} from "lucide-react";
import RsmStatusBadge from "./RsmStatusBadge";
import type { Order, Payment, Expense, Customer } from "@/types/rsm";

interface Props {
  orders: Order[];
  payments: Payment[];
  expenses: Expense[];
  customers: Customer[];
}

export default function RsmDashboardClient({
  orders,
  payments,
  expenses,
  customers,
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
