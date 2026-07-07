"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, Pencil, Trash2 } from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import RsmConfirmBadge from "@/components/admin/rsm/RsmConfirmBadge";
import { useRsmAccess } from "@/lib/useRsmAccess";
import type { Payment } from "@/types/rsm";

export default function PaymentsPage() {
  const me = useRsmAccess("payments");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rsm/payments")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setPayments(data.payments || []);
      })
      .catch((err) => setError(err.message || "Failed to load payments"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this payment? This will also reverse its effect on the linked order's balance. This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/rsm/payments/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setPayments((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = payments.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.paymentNo.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q) ||
      (p.reference || "").toLowerCase().includes(q)
    );
  });

  const totalConfirmed = payments
    .filter((p) => p.confirmed)
    .reduce((sum, p) => sum + p.amount, 0);

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Payments"
      subtitle={`${payments.length} total · $${totalConfirmed.toFixed(2)} confirmed`}
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
            placeholder="Search payment #, customer, reference…"
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <Link
          href="/RSM/payments/new"
          className="flex items-center justify-center gap-2 bg-[#D4AF37] text-black font-medium text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <Plus size={16} />
          Record Payment
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <Loader2 size={20} className="animate-spin mr-2" />
          Loading payments…
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-xl p-4">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-10 text-center text-zinc-500 text-sm">
          {payments.length === 0
            ? "No payments recorded yet."
            : "No payments match your search."}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          {/* Mobile card list */}
          <div className="sm:hidden space-y-2.5">
            {filtered.map((p) => (
              <div
                key={p._id}
                className="bg-zinc-900/60 border border-zinc-900 rounded-xl p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-black text-[#D4AF37]">
                        {p.paymentNo}
                      </span>
                      <RsmConfirmBadge confirmed={p.confirmed} />
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 truncate">{p.customerName}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/RSM/payments/${p._id}/edit`}
                      className="p-2 text-zinc-400 active:text-[#D4AF37] active:bg-zinc-800 rounded-lg transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      disabled={deletingId === p._id}
                      className="p-2 text-zinc-400 active:text-red-400 active:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
                      aria-label="Delete"
                    >
                      {deletingId === p._id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-900 text-xs">
                  <div>
                    <span className="text-zinc-500">Amount: </span>
                    <span className="font-mono font-bold text-white">${p.amount.toFixed(2)}</span>
                  </div>
                  <div className="text-zinc-500">{p.paymentMethod}</div>
                  <div className="text-zinc-500">{p.date}</div>
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
                    <th className="text-left px-5 py-3 font-medium">Payment #</th>
                    <th className="text-left px-5 py-3 font-medium">Customer</th>
                    <th className="text-left px-5 py-3 font-medium">Method</th>
                    <th className="text-right px-5 py-3 font-medium">Amount</th>
                    <th className="text-left px-5 py-3 font-medium">Date</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-right px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr
                      key={p._id}
                      className="border-b border-zinc-900/60 last:border-0 hover:bg-zinc-900/40"
                    >
                      <td className="px-5 py-3 font-medium">{p.paymentNo}</td>
                      <td className="px-5 py-3 text-zinc-400">{p.customerName}</td>
                      <td className="px-5 py-3 text-zinc-400">{p.paymentMethod}</td>
                      <td className="px-5 py-3 text-right">${p.amount.toFixed(2)}</td>
                      <td className="px-5 py-3 text-zinc-400">{p.date}</td>
                      <td className="px-5 py-3">
                        <RsmConfirmBadge confirmed={p.confirmed} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/RSM/payments/${p._id}/edit`}
                            className="p-2 text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-800 rounded-lg transition-colors"
                            aria-label="Edit"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id)}
                            disabled={deletingId === p._id}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
                            aria-label="Delete"
                          >
                            {deletingId === p._id ? (
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
