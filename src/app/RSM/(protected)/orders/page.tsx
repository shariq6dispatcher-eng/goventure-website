"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, Eye, Pencil, Trash2, ClipboardList } from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import RsmStatusBadge from "@/components/admin/rsm/RsmStatusBadge";
import RsmSkeleton from "@/components/admin/rsm/RsmSkeleton";
import RsmEmptyState from "@/components/admin/rsm/RsmEmptyState";
import { useRsmAccess } from "@/lib/useRsmAccess";
import type { Order, OrderStatus } from "@/types/rsm";
import { ORDER_STATUSES } from "@/types/constants";

// Current month, e.g. "2026-07" — used so the page opens showing this
// month's data by default instead of everything.
function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function OrdersPage() {
  const me = useRsmAccess("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rsm/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setOrders(data.orders || []);
      })
     .catch((err) => setError(err.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this order? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/rsm/orders/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setOrders((prev) => prev.filter((o) => o._id !== id));
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
    orders.forEach((o) => {
      if (o.orderDate && o.orderDate.length >= 7) monthsSet.add(o.orderDate.substring(0, 7));
    });
    return Array.from(monthsSet).sort((a, b) => b.localeCompare(a));
  }, [orders]);

  const monthFiltered =
    selectedMonth === "all"
      ? orders
      : orders.filter((o) => o.orderDate.startsWith(selectedMonth));

  const filtered = monthFiltered.filter((o) => {
    const q = query.toLowerCase();
    const matchesQuery =
      o.orderNo.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      (o.designName || "").toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Orders"
      subtitle={`${monthFiltered.length} total`}
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
            placeholder="Search order #, customer, design…"
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "All")}
            className="flex-1 sm:flex-none bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="All">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <Link
            href="/RSM/orders/new"
            className="flex items-center justify-center gap-2 bg-[#D4AF37] text-black font-medium text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Order</span>
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
        orders.length === 0 ? (
          <RsmEmptyState
            icon={ClipboardList}
            title="No orders yet"
            description="Create your first order to start tracking production, payments, and delivery."
            ctaLabel="Create Order"
            ctaHref="/RSM/orders/new"
          />
        ) : (
          <RsmEmptyState
            icon={Search}
            title="No matches"
            description="No orders match your current search, month, or status filter. Try adjusting them."
          />
        )
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          {/* Mobile card list */}
          <div className="sm:hidden space-y-2.5">
            {filtered.map((o) => (
              <div
                key={o._id}
                className="bg-zinc-900/60 border border-zinc-900 rounded-xl p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-black text-[#D4AF37]">
                        {o.orderNo}
                      </span>
                      <RsmStatusBadge status={o.status} />
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 truncate">{o.customerName}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/RSM/orders/${o._id}`}
                      className="p-2 text-zinc-400 active:text-[#D4AF37] active:bg-zinc-800 rounded-lg transition-colors"
                      aria-label="View"
                    >
                      <Eye size={15} />
                    </Link>
                    <Link
                      href={`/RSM/orders/${o._id}/edit`}
                      className="p-2 text-zinc-400 active:text-[#D4AF37] active:bg-zinc-800 rounded-lg transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(o._id)}
                      disabled={deletingId === o._id}
                      className="p-2 text-zinc-400 active:text-red-400 active:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
                      aria-label="Delete"
                    >
                      {deletingId === o._id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-900 text-xs">
                  <div>
                    <span className="text-zinc-500">Total: </span>
                    <span className="font-mono font-bold text-white">${o.total.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Balance: </span>
                    <span
                      className={`font-mono font-bold ${
                        o.balanceDue > 0 ? "text-amber-400" : "text-zinc-500"
                      }`}
                    >
                      ${o.balanceDue.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-zinc-500">Due: {o.dueDate}</div>
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
                    <th className="text-left px-5 py-3 font-medium">Order #</th>
                    <th className="text-left px-5 py-3 font-medium">Customer</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-right px-5 py-3 font-medium">Total</th>
                    <th className="text-right px-5 py-3 font-medium">Balance</th>
                    <th className="text-left px-5 py-3 font-medium">Due</th>
                    <th className="text-right px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => (
                    <tr
                      key={o._id}
                      className="border-b border-zinc-900/60 last:border-0 hover:bg-zinc-900/40"
                    >
                      <td className="px-5 py-3 font-medium">{o.orderNo}</td>
                      <td className="px-5 py-3 text-zinc-400">{o.customerName}</td>
                      <td className="px-5 py-3">
                        <RsmStatusBadge status={o.status} />
                      </td>
                      <td className="px-5 py-3 text-right">${o.total.toFixed(2)}</td>
                      <td className="px-5 py-3 text-right">
                        <span className={o.balanceDue > 0 ? "text-amber-400" : "text-zinc-500"}>
                          ${o.balanceDue.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-400">{o.dueDate}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/RSM/orders/${o._id}`}
                            className="p-2 text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-800 rounded-lg transition-colors"
                            aria-label="View"
                          >
                            <Eye size={15} />
                          </Link>
                          <Link
                            href={`/RSM/orders/${o._id}/edit`}
                            className="p-2 text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-800 rounded-lg transition-colors"
                            aria-label="Edit"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(o._id)}
                            disabled={deletingId === o._id}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
                            aria-label="Delete"
                          >
                            {deletingId === o._id ? (
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
