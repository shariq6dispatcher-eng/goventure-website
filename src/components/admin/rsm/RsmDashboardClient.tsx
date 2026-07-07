"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Receipt, ArrowDownRight, Clock, Scissors, Eye } from "lucide-react";
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
      <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-white">
            Monthly Business Situation
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            Viewing financials and operation metrics for{" "}
            <span className="text-[#D4AF37] font-bold font-mono">
              {selectedMonthName}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-zinc-400 text-xs font-bold whitespace-nowrap">
            Change Month:
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-black border border-zinc-800 hover:border-zinc-700 text-xs font-bold text-zinc-200 p-2.5 rounded-xl outline-none focus:border-[#D4AF37] transition font-mono min-w-[180px]"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 hover:border-zinc-700 transition">
          <div className="flex justify-between items-start">
            <span className="text-zinc-500 text-[10px] font-extrabold uppercase tracking-widest">
              {selectedMonthName} Invoiced
            </span>
            <span className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
              <Receipt className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl font-black mt-3 text-white font-mono">
            {money(stats.totalInvoiced)}
          </h3>
          <p className="text-zinc-500 text-xs mt-2 font-mono">
            Gross billed orders in {selectedMonthName}
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 hover:border-zinc-700 transition">
          <div className="flex justify-between items-start">
            <span className="text-zinc-500 text-[10px] font-extrabold uppercase tracking-widest">
              {selectedMonthName} Payments
            </span>
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <ArrowDownRight className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl font-black mt-3 text-emerald-400 font-mono">
            {money(stats.totalPaymentsReceived)}
          </h3>
          <p className="text-emerald-500 text-xs mt-2 font-medium">
            Cash collected in {selectedMonthName}
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 hover:border-zinc-700 transition">
          <div className="flex justify-between items-start">
            <span className="text-zinc-500 text-[10px] font-extrabold uppercase tracking-widest">
              Receivables (Dues)
            </span>
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl font-black mt-3 text-amber-400 font-mono">
            {money(stats.outstandingReceivables)}
          </h3>
          <p className="text-zinc-500 text-xs mt-2">
            Unpaid dues up to {selectedMonthName}
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 hover:border-zinc-700 transition">
          <div className="flex justify-between items-start">
            <span className="text-zinc-500 text-[10px] font-extrabold uppercase tracking-widest">
              {selectedMonthName} Expenses
            </span>
            <span className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
              <Scissors className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-2xl font-black mt-3 text-white font-mono">
            {money(stats.totalExpensesSum)}
          </h3>
          <div className="flex items-center justify-between gap-1 mt-2 text-xs text-zinc-400">
            <span className="text-zinc-500">
              Expenses logged in {selectedMonthName}
            </span>
            <span
              className={`font-mono text-[11px] font-bold ${
                stats.netProfit >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              Net: {money(stats.netProfit)}
            </span>
          </div>
        </div>
      </div>

      {/* ACTIVE PRODUCTION PIPELINE */}
      <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
          <div>
            <h4 className="font-bold text-sm text-white">
              Active Production Pipeline
            </h4>
            <p className="text-xs text-zinc-400">
              Real-time status of orders and digitizing designs
            </p>
          </div>
          <Link
            href="/RSM/orders"
            className="text-xs text-[#D4AF37] hover:text-[#e5c458] font-bold whitespace-nowrap"
          >
            Manage All Orders →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-black border border-zinc-800 p-3.5 rounded-lg text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
              Pending Check
            </span>
            <span className="text-2xl font-mono font-bold text-amber-400 block mt-1">
              {pipelineCounts.pending}
            </span>
          </div>
          <div className="bg-black border border-zinc-800 p-3.5 rounded-lg text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
              In Digitizing / Prod
            </span>
            <span className="text-2xl font-mono font-bold text-sky-400 block mt-1">
              {pipelineCounts.inProgress}
            </span>
          </div>
          <div className="bg-black border border-zinc-800 p-3.5 rounded-lg text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
              Completed Files
            </span>
            <span className="text-2xl font-mono font-bold text-[#D4AF37] block mt-1">
              {pipelineCounts.completed}
            </span>
          </div>
          <div className="bg-black border border-zinc-800 p-3.5 rounded-lg text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
              Delivered Orders
            </span>
            <span className="text-2xl font-mono font-bold text-emerald-400 block mt-1">
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
              className="bg-black border border-zinc-900 p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-zinc-700 transition"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-[#D4AF37]">
                    {o.orderNo}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {o.designName || "Custom Items"}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    ({o.items.length} items)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1">
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

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
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
    </div>
  );
}
