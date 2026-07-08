"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ClipboardList,
  Wallet,
  Clock,
  Scissors,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Users,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import StatCard from "../StatCard";

interface ReportData {
  month: string;
  orders: {
    count: number;
    gross: number;
    byStatus: Record<string, number>;
    byCategory: Record<string, { count: number; amount: number }>;
    list: any[];
  };
  payments: {
    count: number;
    confirmedCount: number;
    pendingCount: number;
    cashCollected: number;
    byMethod: Record<string, number>;
    list: any[];
  };
  receivables: { total: number };
  expenses: {
    count: number;
    total: number;
    byCategory: Record<string, number>;
    list: any[];
  };
  digitizingJobs: {
    count: number;
    byStatus: Record<string, number>;
    list: any[];
  };
  profitability: {
    revenue: number;
    expenses: number;
    netProfit: number;
    margin: number;
  };
  topCustomers: { name: string; amount: number }[];
  totalActiveCustomers: number;
}

function fmt(n: number) {
  return `$${n.toFixed(2)}`;
}

function monthLabel(month: string) {
  const [y, m] = month.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// Small section wrapper — consistent card chrome for every report block
function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl sm:rounded-2xl bg-zinc-950 border border-zinc-900 p-4 sm:p-6">
      <h3 className="text-sm sm:text-base font-bold text-white">{title}</h3>
      {subtitle && (
        <p className="text-xs text-zinc-500 mt-0.5 mb-3 sm:mb-4">{subtitle}</p>
      )}
      {!subtitle && <div className="mb-3 sm:mb-4" />}
      {children}
    </div>
  );
}

// Horizontal bar-style breakdown row (category name + count/amount + proportional bar)
function BreakdownRow({
  label,
  value,
  displayValue,
  max,
}: {
  label: string;
  value: number;
  displayValue: string;
  max: number;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="py-2">
      <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5 gap-2">
        <span className="text-zinc-300 truncate">{label}</span>
        <span className="text-white font-semibold shrink-0">{displayValue}</span>
      </div>
      <div className="h-1.5 rounded-full bg-zinc-900 overflow-hidden">
        <div
          className="h-full bg-[#D4AF37] rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface RsmReportsClientProps {
  onExport?: (data: ReportData) => void;
}

export default function RsmReportsClient({ onExport }: RsmReportsClientProps) {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (m: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/rsm/reports?month=${m}`);
      if (!res.ok) throw new Error("Failed to load report");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError("Couldn't load report data. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(month);
  }, [month, load]);

  const isCurrentMonth = month === new Date().toISOString().slice(0, 7);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Month switcher + export */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 sm:gap-2 bg-zinc-950 border border-zinc-900 rounded-xl px-1.5 sm:px-2 py-1.5">
          <button
            onClick={() => setMonth((m) => shiftMonth(m, -1))}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs sm:text-sm font-semibold text-white min-w-[110px] sm:min-w-[140px] text-center">
            {monthLabel(month)}
          </span>
          <button
            onClick={() => setMonth((m) => shiftMonth(m, 1))}
            disabled={isCurrentMonth}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <button
          onClick={() => data && onExport?.(data)}
          disabled={!data}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-xs sm:text-sm font-bold disabled:opacity-40"
        >
          <Download size={15} />
          Export Report
        </button>
      </div>

      {loading && (
        <div className="text-center py-16 text-zinc-500 text-sm">
          Loading report…
        </div>
      )}

      {error && (
        <div className="text-center py-16 text-red-400 text-sm">{error}</div>
      )}

      {data && !loading && (
        <>
          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard icon={ClipboardList} label={`Orders in ${monthLabel(month)}`} value={data.orders.count} />
            <StatCard icon={Wallet} label="Cash Collected" value={fmt(data.payments.cashCollected)} />
            <StatCard icon={Clock} label="Total Receivables" value={fmt(data.receivables.total)} />
            <StatCard icon={Scissors} label="Expenses This Month" value={fmt(data.expenses.total)} />
          </div>

          {/* Profitability */}
          <Section title="Profitability Statement" subtitle={`Financial breakdown for ${monthLabel(month)}`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-zinc-500">Revenue</p>
                <p className="text-lg sm:text-xl font-bold text-emerald-400">{fmt(data.profitability.revenue)}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Expenses</p>
                <p className="text-lg sm:text-xl font-bold text-red-400">{fmt(data.profitability.expenses)}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Net Profit</p>
                <div className="flex items-center gap-1.5">
                  <p className={`text-lg sm:text-xl font-bold ${data.profitability.netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {fmt(data.profitability.netProfit)}
                  </p>
                  {data.profitability.netProfit >= 0 ? (
                    <TrendingUp size={16} className="text-emerald-400" />
                  ) : (
                    <TrendingDown size={16} className="text-red-400" />
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  {data.profitability.margin.toFixed(1)}% margin
                </p>
              </div>
            </div>
          </Section>

          {/* Orders breakdown */}
          <Section title="Orders" subtitle="By status and service category">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">By Status</p>
                {Object.entries(data.orders.byStatus).map(([status, count]) => (
                  <BreakdownRow
                    key={status}
                    label={status}
                    value={count}
                    displayValue={String(count)}
                    max={data.orders.count}
                  />
                ))}
                {data.orders.count === 0 && (
                  <p className="text-xs text-zinc-600">No orders this month</p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">By Category (revenue)</p>
                {Object.entries(data.orders.byCategory)
                  .sort((a, b) => b[1].amount - a[1].amount)
                  .map(([cat, v]) => (
                    <BreakdownRow
                      key={cat}
                      label={cat}
                      value={v.amount}
                      displayValue={fmt(v.amount)}
                      max={data.orders.gross}
                    />
                  ))}
                {Object.keys(data.orders.byCategory).length === 0 && (
                  <p className="text-xs text-zinc-600">No line items this month</p>
                )}
              </div>
            </div>
          </Section>

          {/* Payments breakdown */}
          <Section title="Payments" subtitle={`${data.payments.confirmedCount} confirmed · ${data.payments.pendingCount} pending`}>
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">By Method</p>
            {Object.entries(data.payments.byMethod)
              .sort((a, b) => b[1] - a[1])
              .map(([method, amount]) => (
                <BreakdownRow
                  key={method}
                  label={method}
                  value={amount}
                  displayValue={fmt(amount)}
                  max={data.payments.cashCollected}
                />
              ))}
            {Object.keys(data.payments.byMethod).length === 0 && (
              <p className="text-xs text-zinc-600">No confirmed payments this month</p>
            )}
          </Section>

          {/* Expenses breakdown */}
          <Section title="Expenses" subtitle="By category">
            {Object.entries(data.expenses.byCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amount]) => (
                <BreakdownRow
                  key={cat}
                  label={cat}
                  value={amount}
                  displayValue={fmt(amount)}
                  max={data.expenses.total}
                />
              ))}
            {Object.keys(data.expenses.byCategory).length === 0 && (
              <p className="text-xs text-zinc-600">No expenses logged this month</p>
            )}
          </Section>

          {/* Digitizing jobs + Top customers, side by side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Section title="Digitizing Jobs" subtitle="By status">
              <div className="flex items-center gap-2 mb-3 text-[#D4AF37]">
                <Sparkles size={16} />
                <span className="text-sm font-semibold">{data.digitizingJobs.count} jobs this month</span>
              </div>
              {Object.entries(data.digitizingJobs.byStatus).map(([status, count]) => (
                <BreakdownRow
                  key={status}
                  label={status}
                  value={count}
                  displayValue={String(count)}
                  max={data.digitizingJobs.count}
                />
              ))}
              {data.digitizingJobs.count === 0 && (
                <p className="text-xs text-zinc-600">No jobs this month</p>
              )}
            </Section>

            <Section title="Top Customers" subtitle="By revenue this month">
              <div className="flex items-center gap-2 mb-3 text-[#D4AF37]">
                <Users size={16} />
                <span className="text-sm font-semibold">{data.totalActiveCustomers} total customers</span>
              </div>
              {data.topCustomers.map((c) => (
                <BreakdownRow
                  key={c.name}
                  label={c.name}
                  value={c.amount}
                  displayValue={fmt(c.amount)}
                  max={data.topCustomers[0]?.amount || 1}
                />
              ))}
              {data.topCustomers.length === 0 && (
                <p className="text-xs text-zinc-600">No revenue recorded this month</p>
              )}
            </Section>
          </div>
        </>
      )}
    </div>
  );
}
