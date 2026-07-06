"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Search, Loader2, Pencil, Trash2 } from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import type { Expense, ExpenseCategory } from "@/types/rsm";
import { EXPENSE_CATEGORIES } from "@/types/constants";

async function fetchMe(): Promise<{ username: string; role: "admin" | "staff" }> {
  const res = await fetch("/api/rsm/me");
  if (!res.ok) throw new Error("not authed");
  return res.json();
}

export default function ExpensesPage() {
  const router = useRouter();
  const [me, setMe] = useState<{ username: string; role: "admin" | "staff" } | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "All">("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMe()
      .then(setMe)
      .catch(() => router.push("/RSM/login"));

    fetch("/api/rsm/expenses")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setExpenses(data.expenses || []);
      })
      .catch((err) => setError(err.message || "Failed to load expenses"))
      .finally(() => setLoading(false));
  }, [router]);

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

  const filtered = expenses.filter((e) => {
    const q = query.toLowerCase();
    const matchesQuery =
      e.expenseNo.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      (e.refNo || "").toLowerCase().includes(q);
    const matchesCategory = categoryFilter === "All" || e.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Expenses"
      subtitle={`${expenses.length} total · $${totalAmount.toFixed(2)} spent`}
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by expense #, description, ref…"
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as ExpenseCategory | "All")}
          className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
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
          Add Expense
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <Loader2 size={20} className="animate-spin mr-2" />
          Loading expenses…
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-xl p-4">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-10 text-center text-zinc-500 text-sm">
          {expenses.length === 0
            ? "No expenses recorded yet."
            : "No expenses match your search/filter."}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl overflow-hidden">
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
      )}
    </RsmShell>
  );
}
