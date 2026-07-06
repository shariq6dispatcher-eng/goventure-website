"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Search, Loader2, Eye, Pencil, Trash2 } from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import RsmStatusBadge from "@/components/admin/rsm/RsmStatusBadge";
import type { Order, OrderStatus } from "@/types/rsm";
import { ORDER_STATUSES } from "@/types/constants";

async function fetchMe(): Promise<{ username: string; role: "admin" | "staff" }> {
  const res = await fetch("/api/rsm/me");
  if (!res.ok) throw new Error("not authed");
  return res.json();
}

export default function OrdersPage() {
  const router = useRouter();
  const [me, setMe] = useState<{ username: string; role: "admin" | "staff" } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMe()
      .then(setMe)
      .catch(() => router.push("/RSM/login"));

    fetch("/api/rsm/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setOrders(data.orders || []);
      })
      .catch((err) => setError(err.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  }, [router]);

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

  const filtered = orders.filter((o) => {
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
      subtitle={`${orders.length} total`}
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
            placeholder="Search by order #, customer, design…"
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "All")}
          className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
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
          New Order
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <Loader2 size={20} className="animate-spin mr-2" />
          Loading orders…
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-xl p-4">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-10 text-center text-zinc-500 text-sm">
          {orders.length === 0
            ? "No orders yet. Create your first one above."
            : "No orders match your search/filter."}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl overflow-hidden">
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
      )}
    </RsmShell>
  );
}
