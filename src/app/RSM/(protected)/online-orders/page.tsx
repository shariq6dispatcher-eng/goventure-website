"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Loader2, Eye, AlertTriangle } from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import RsmOnlineOrderStatusBadge from "@/components/admin/rsm/RsmOnlineOrderStatusBadge";
import { useRsmAccess } from "@/lib/useRsmAccess";
import type { OnlineOrder, OnlineOrderStatus } from "@/types/rsm";
import { ONLINE_ORDER_STATUSES } from "@/types/constants";

export default function OnlineOrdersPage() {
  const me = useRsmAccess("online_orders");
  const [orders, setOrders] = useState<OnlineOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OnlineOrderStatus | "All">("All");

  useEffect(() => {
    fetch("/api/online-orders")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setOrders(data.orders || []);
      })
      .catch((err) => setError(err.message || "Failed to load online orders"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const q = query.toLowerCase();
    const matchesQuery =
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      o.requestNo.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  // Requests waiting on YOU (no rate given yet, or a payment screenshot
  // waiting for review) surface first so nothing sits unnoticed.
  const needsAttention = (o: OnlineOrder) =>
    o.status === "Requested" || o.status === "Payment Submitted";

  const sorted = [...filtered].sort((a, b) => {
    const aAttn = needsAttention(a) ? 0 : 1;
    const bAttn = needsAttention(b) ? 0 : 1;
    if (aAttn !== bAttn) return aAttn - bAttn;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Online Orders"
      subtitle={`${orders.length} total · public order requests from /order`}
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
            placeholder="Search name, email, request no…"
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OnlineOrderStatus | "All")}
          className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
        >
          <option value="All">All statuses</option>
          {ONLINE_ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <Loader2 size={20} className="animate-spin mr-2" />
          Loading online orders…
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-xl p-4">
          {error}
        </div>
      )}

      {!loading && !error && sorted.length === 0 && (
        <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-10 text-center text-zinc-500 text-sm">
          {orders.length === 0
            ? "No online order requests yet. Share /order with your customers."
            : "No requests match your search/filter."}
        </div>
      )}

      {!loading && !error && sorted.length > 0 && (
        <>
          {/* Mobile card list */}
          <div className="sm:hidden space-y-2.5">
            {sorted.map((o) => (
              <Link
                key={o._id}
                href={`/RSM/online-orders/${o._id}`}
                className="block bg-zinc-900/60 border border-zinc-900 rounded-xl p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                      {o.requestNo}
                      {o.urgent && (
                        <AlertTriangle size={12} className="text-amber-400 shrink-0" />
                      )}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5 truncate">
                      {o.customerName} · {o.category}
                    </p>
                    <div className="mt-1.5">
                      <RsmOnlineOrderStatusBadge status={o.status} />
                    </div>
                  </div>
                  {needsAttention(o) && (
                    <span className="shrink-0 text-[10px] uppercase tracking-wide bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-1 rounded-full">
                      Action Needed
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block bg-zinc-900/60 border border-zinc-900 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 text-xs uppercase tracking-wide">
                    <th className="text-left px-5 py-3 font-medium">Request</th>
                    <th className="text-left px-5 py-3 font-medium">Customer</th>
                    <th className="text-left px-5 py-3 font-medium">Category</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-right px-5 py-3 font-medium">Rate</th>
                    <th className="text-right px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((o) => (
                    <tr
                      key={o._id}
                      className="border-b border-zinc-900/60 last:border-0 hover:bg-zinc-900/40"
                    >
                      <td className="px-5 py-3 font-medium">
                        <Link
                          href={`/RSM/online-orders/${o._id}`}
                          className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                        >
                          <span className="font-mono">{o.requestNo}</span>
                          {o.urgent && (
                            <AlertTriangle size={13} className="text-amber-400" />
                          )}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-zinc-400">
                        {o.customerName}
                        <div className="text-xs text-zinc-600">{o.customerEmail}</div>
                      </td>
                      <td className="px-5 py-3 text-zinc-400">{o.category}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <RsmOnlineOrderStatusBadge status={o.status} />
                          {needsAttention(o) && (
                            <span className="text-[10px] uppercase tracking-wide bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded-full">
                              Action Needed
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {o.quoteAmount ? `$${o.quoteAmount.toFixed(2)}` : "—"}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/RSM/online-orders/${o._id}`}
                            className="p-2 text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-800 rounded-lg transition-colors"
                            aria-label="View"
                          >
                            <Eye size={15} />
                          </Link>
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
