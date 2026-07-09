"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, Pencil, Trash2, Scissors } from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import RsmSkeleton from "@/components/admin/rsm/RsmSkeleton";
import RsmEmptyState from "@/components/admin/rsm/RsmEmptyState";
import { useRsmAccess } from "@/lib/useRsmAccess";
import type { Expense, ExpenseCategory } from "@/types/rsm";
import { EXPENSE_CATEGORIES } from "@/types/constants";

// Current month, e.g. "2026-07" — used so the page opens showing this
// month's data by default instead of everything.
function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function ExpensesPage() {
  const me = useRsmAccess("expenses");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "All">("All");
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rsm/expenses")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setExpenses(data.expenses || []);
      })
      .catch((err) => setError(err.message || "Failed to load expenses"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expense? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/rsm/expenses/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    const now = new Date();
    monthsSet.add(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    );
    expenses.forEach((e) => {
      if (e.date && e.date.length >= 7) monthsSet.add(e.date.substring(0, 7));
    });
    return Array.from(monthsSet).sort((a, b) => b.localeCompare(a));
  }, [expenses]);

  const monthFiltered =
    selectedMonth === "all"
      ? expenses
      : expenses.filter((e) => e.date.startsWith(selectedMonth));

  const filtered = monthFiltered.filter((e) => {
    const q = query.toLowerCase();
    const matchesQuery =
      e.expenseNo.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      (e.refNo || "").toLowerCase().includes(q);
    const matchesCategory = categoryFilter === "All" || e.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  const totalAmount = monthFiltered.reduce((sum, e) => sum + e.amount, 0);

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Expenses"
      subtitle={`${monthFiltered.length} total · $${totalAmount.toFixed(2)} spent`}
    >
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-5 sm:mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search expense #, description, ref…"
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="flex gap-2.5 sm:gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="flex-1 sm:flex-none bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-xl px-3 sm:px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#D4AF37] transition font-mono"
          >
            <option value="all">All Months</option>
            {availableMonths.map((month) => {
              const monthName = new Date(month + "-02").toLocaleString("default", {
                month: "long",
                year: "numeric",
              });
              return (
                <option key={month} value={month}>
                  {monthName}
                </option>
              );
            })}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as ExpenseCategory | "All")}
            className="flex-1 sm:flex-none bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="All">All categories</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <Link
            href="/RSM/expenses/new"
            className="flex items-center justify-center gap-2 bg-[#D4AF37] text-black font-medium text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Expense</span>
          </Link>
        </div>
      </div>

     {loading && <RsmSkeleton rows={6} />}

      {!loading && error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-xl p-4">
          {error}
        </div>
      )}

     {!loading && !error && filtered.length === 0 && (
        expenses.length === 0 ? (
          <RsmEmptyState
            icon={Scissors}
            title="No expenses recorded yet"
            description="Log your first expense to start tracking costs against revenue."
            ctaLabel="Add Expense"
            ctaHref="/RSM/expenses/new"
          />
        ) : (
          <RsmEmptyState
            icon={Search}
            title="No matches"
            description="No expenses match your current search, month, or category filter. Try adjusting them."
          />
        )
      )}

     {!loading && !error && filtered.length > 0 && (
        <>
          {/* Mobile card list */}
          <div className="sm:hidden space-y-2.5">
            {filtered.map((e) => (
              <div
                key={e._id}
                className="bg-zinc-900/60 border border-zinc-900 rounded-xl p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-black text-[#D4AF37]">
                        {e.expenseNo}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border bg-zinc-800 text-zinc-300 border-zinc-700 whitespace-nowrap">
                        {e.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 truncate">{e.description}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/RSM/expenses/${e._id}/edit`}
                      className="p-2 text-zinc-400 active:text-[#D4AF37] active:bg-zinc-800 rounded-lg transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(e._id)}
                      disabled={deletingId === e._id}
                      className="p-2 text-zinc-400 active:text-red-400 active:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
                      aria-label="Delete"
                    >
                      {deletingId === e._id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-900 text-xs">
                  <span className="font-mono font-bold text-white">${e.amount.toFixed(2)}</span>
                  <span className="text-zinc-500">{e.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block bg-zinc-900/60 border border-zinc-900 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 text-xs uppercase tracking-wide">
                    <th className="text-left px-5 py-3 font-medium">Expense #</th>
                    <th className="text-left px-5 py-3 font-medium">Description</th>
                    <th className="text-left px-5 py-3 font-medium">Category</th>
                    <th className="text-right px-5 py-3 font-medium">Amount</th>
                    <th className="text-left px-5 py-3 font-medium">Date</th>
                    <th className="text-right px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e) => (
                    <tr
                      key={e._id}
                      className="border-b border-zinc-900/60 last:border-0 hover:bg-zinc-900/40"
                    >
                      <td className="px-5 py-3 font-medium">{e.expenseNo}</td>
                      <td className="px-5 py-3 text-zinc-400">{e.description}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-zinc-800 text-zinc-300 border-zinc-700 whitespace-nowrap">
                          {e.category}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">${e.amount.toFixed(2)}</td>
                      <td className="px-5 py-3 text-zinc-400">{e.date}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/RSM/expenses/${e._id}/edit`}
                            className="p-2 text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-800 rounded-lg transition-colors"
                            aria-label="Edit"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(e._id)}
                            disabled={deletingId === e._id}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
                            aria-label="Delete"
                          >
                            {deletingId === e._id ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </RsmShell>
  );
}
