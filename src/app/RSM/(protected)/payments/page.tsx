"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, Pencil, Trash2, Wallet, Check } from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import RsmConfirmBadge from "@/components/admin/rsm/RsmConfirmBadge";
import RsmSkeleton from "@/components/admin/rsm/RsmSkeleton";
import RsmEmptyState from "@/components/admin/rsm/RsmEmptyState";
import { useRsmAccess } from "@/lib/useRsmAccess";
import type { Payment } from "@/types/rsm";

// Current month, e.g. "2026-07" — used so the page opens showing this
// month's data by default instead of everything.
function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function PaymentsPage() {
  const me = useRsmAccess("payments");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rsm/payments", { cache: "no-store" })
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

  const handleConfirm = async (p: Payment) => {
    setConfirmingId(p._id);
    try {
      const res = await fetch(`/api/rsm/payments/${p._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: p.customerId,
          orderId: p.orderId,
          amount: p.amount,
          paymentMethod: p.paymentMethod,
          date: p.date,
          reference: p.reference,
          screenshot: p.screenshot,
          notes: p.notes,
          confirmed: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Confirm failed");
      setPayments((prev) =>
        prev.map((row) =>
          row._id === p._id
            ? {
                ...row,
                confirmed: true,
                confirmedBy: row.confirmedBy || me?.username,
                confirmedAt: row.confirmedAt || new Date().toISOString(),
              }
            : row
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Confirm failed");
    } finally {
      setConfirmingId(null);
    }
  };

  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    const now = new Date();
    monthsSet.add(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    );
    payments.forEach((p) => {
      const bucket = p.bookedMonth || p.date;
      if (bucket && bucket.length >= 7) monthsSet.add(bucket.substring(0, 7));
    });
    return Array.from(monthsSet).sort((a, b) => b.localeCompare(a));
  }, [payments]);

  const monthFiltered =
    selectedMonth === "all"
      ? payments
      : payments.filter((p) => (p.bookedMonth || p.date).startsWith(selectedMonth));

  const filtered = monthFiltered.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.paymentNo.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q) ||
      (p.reference || "").toLowerCase().includes(q)
    );
  });

  const totalConfirmed = monthFiltered
    .filter((p) => p.confirmed)
    .reduce((sum, p) => sum + p.amount, 0);

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Payments"
      subtitle={`${monthFiltered.length} total · $${totalConfirmed.toFixed(2)} confirmed`}
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

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#D4AF37] transition font-mono"
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

        <Link
          href="/RSM/payments/new"
          className="flex items-center justify-center gap-2 bg-[#D4AF37] text-black font-medium text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <Plus size={16} />
          Record Payment
        </Link>
      </div>

     {loading && <RsmSkeleton rows={6} />}

      {!loading && error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-xl p-4">
          {error}
        </div>
      )}

     {!loading && !error && filtered.length === 0 && (
        payments.length === 0 ? (
          <RsmEmptyState
            icon={Wallet}
            title="No payments recorded yet"
            description="Record your first payment to start tracking cash collected against orders."
            ctaLabel="Record Payment"
            ctaHref="/RSM/payments/new"
          />
        ) : (
          <RsmEmptyState
            icon={Search}
            title="No matches"
            description={
              selectedMonth === "all"
                ? "No payments match your current search. Try a different term."
                : "No payments match this month/search. Try a different month or search term."
            }
          />
        )
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
                    {p.confirmed && p.confirmedBy && (
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        Confirmed by {p.confirmedBy}
                      </p>
                    )}
                    <p className="text-xs text-zinc-400 mt-1 truncate">{p.customerName}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {p.screenshot && (
                      <button
                        onClick={() => setViewingScreenshot(p.screenshot!)}
                        className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-800 active:border-[#D4AF37] transition-colors shrink-0"
                        aria-label="View payment screenshot"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.screenshot}
                          alt="Payment proof"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    )}
                    {!p.confirmed && (
                      <button
                        onClick={() => handleConfirm(p)}
                        disabled={confirmingId === p._id}
                        className="p-2 text-emerald-400 active:text-emerald-300 active:bg-emerald-950/30 rounded-lg transition-colors disabled:opacity-50"
                        aria-label="Confirm"
                      >
                        {confirmingId === p._id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Check size={15} />
                        )}
                      </button>
                    )}
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
                  <div className="text-zinc-500 text-right">
                    <div>{p.date}</div>
                    {p.bookedMonth && p.bookedMonth !== p.date.slice(0, 7) && (
                      <div className="text-[9px] text-[#D4AF37]">
                        counts in {new Date(p.bookedMonth + "-02").toLocaleString("default", { month: "short", year: "numeric" })}
                      </div>
                    )}
                  </div>
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
                    <th className="text-center px-5 py-3 font-medium">Proof</th>
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
                      <td className="px-5 py-3 text-zinc-400">
                        {p.date}
                        {p.bookedMonth && p.bookedMonth !== p.date.slice(0, 7) && (
                          <div className="text-[10px] text-[#D4AF37]">
                            counts in {new Date(p.bookedMonth + "-02").toLocaleString("default", { month: "short", year: "numeric" })}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <RsmConfirmBadge confirmed={p.confirmed} />
                        {p.confirmed && p.confirmedBy && (
                          <p className="text-[10px] text-zinc-500 mt-1">by {p.confirmedBy}</p>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {p.screenshot ? (
                          <button
                            onClick={() => setViewingScreenshot(p.screenshot!)}
                            className="inline-block w-10 h-10 rounded-lg overflow-hidden border border-zinc-800 hover:border-[#D4AF37] transition-colors"
                            aria-label="View payment screenshot"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.screenshot}
                              alt="Payment proof"
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ) : (
                          <span className="text-zinc-700 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {!p.confirmed && (
                            <button
                              onClick={() => handleConfirm(p)}
                              disabled={confirmingId === p._id}
                              className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30 rounded-lg transition-colors disabled:opacity-50"
                              aria-label="Confirm"
                            >
                              {confirmingId === p._id ? (
                                <Loader2 size={15} className="animate-spin" />
                              ) : (
                                <Check size={15} />
                              )}
                            </button>
                          )}
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
      {viewingScreenshot && (
        <div
          onClick={() => setViewingScreenshot(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={viewingScreenshot}
            alt="Payment proof — full view"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setViewingScreenshot(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </RsmShell>
  );
}
