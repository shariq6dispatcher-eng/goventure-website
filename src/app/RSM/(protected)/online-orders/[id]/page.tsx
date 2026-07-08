"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  AlertTriangle,
  Mail,
  Phone,
  Calendar,
  Ruler,
  FileType,
  StickyNote,
} from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import RsmOnlineOrderStatusBadge from "@/components/admin/rsm/RsmOnlineOrderStatusBadge";
import OnlineOrderFileUpload from "@/components/admin/rsm/OnlineOrderFileUpload";
import { useRsmAccess } from "@/lib/useRsmAccess";
import type { OnlineOrder } from "@/types/rsm";

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

export default function OnlineOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const me = useRsmAccess("online_orders");

  const [order, setOrder] = useState<OnlineOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteNote, setQuoteNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);

  const loadOrder = () => {
    fetch(`/api/online-orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setOrder(data.order);
        if (data.order?.quoteAmount) setQuoteAmount(String(data.order.quoteAmount));
        if (data.order?.quoteNote) setQuoteNote(data.order.quoteNote);
      })
      .catch((err) => setError(err.message || "Failed to load request"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submitQuote = async () => {
    if (!order) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/online-orders/${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "quote",
          quoteAmount: Number(quoteAmount),
          quoteNote,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send rate");
      loadOrder();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to send rate");
    } finally {
      setSaving(false);
    }
  };

  const submitReject = async () => {
    if (!order) return;
    if (!confirm("Reject this request? The customer will see this on their status page.")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/online-orders/${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", rejectedReason: rejectReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reject");
      loadOrder();
      setShowReject(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject");
    } finally {
      setSaving(false);
    }
  };

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Online Order Request"
      subtitle={order ? order.requestNo : ""}
    >
      <div className="mb-5">
        <Link
          href="/RSM/online-orders"
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={15} /> Back to Online Orders
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <Loader2 size={20} className="animate-spin mr-2" />
          Loading request…
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-xl p-4">
          {error}
        </div>
      )}

      {!loading && order && (
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Left: request details */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-mono text-[#D4AF37] font-bold flex items-center gap-2">
                    {order.requestNo}
                    {order.urgent && (
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide bg-amber-950 text-amber-300 border border-amber-900 px-2 py-0.5 rounded-full">
                        <AlertTriangle size={11} /> Urgent
                      </span>
                    )}
                  </p>
                  <h2 className="text-lg font-bold mt-1">{order.customerName}</h2>
                </div>
                <RsmOnlineOrderStatusBadge status={order.status} />
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-sm border-t border-zinc-900 pt-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Mail size={14} /> {order.customerEmail}
                </div>
                {order.customerPhone && (
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Phone size={14} /> {order.customerPhone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-zinc-400">
                  <FileType size={14} /> {order.category}
                </div>
                {order.size && (
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Ruler size={14} /> {order.size}
                  </div>
                )}
                {order.needDate && (
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Calendar size={14} /> Needed by {order.needDate}
                  </div>
                )}
              </div>

              {order.formats.length > 0 && (
                <div className="mt-4 pt-4 border-t border-zinc-900">
                  <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
                    Formats Requested
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {order.formats.map((f) => (
                      <span
                        key={f}
                        className="text-xs bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg text-zinc-300"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {order.notes && (
                <div className="mt-4 pt-4 border-t border-zinc-900">
                  <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2 flex items-center gap-1.5">
                    <StickyNote size={12} /> Customer Note
                  </p>
                  <p className="text-sm text-zinc-300 whitespace-pre-wrap">{order.notes}</p>
                </div>
              )}
            </div>

            {order.designImageUrl && (
              <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 sm:p-6">
                <p className="text-xs uppercase tracking-wide text-zinc-500 mb-3">
                  Design Image
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={order.designImageUrl}
                  alt="Customer design"
                  className="w-full max-w-sm rounded-xl border border-zinc-800"
                />
              </div>
            )}

            {order.status === "Rejected" && order.rejectedReason && (
              <div className="bg-red-950/30 border border-red-900/40 rounded-2xl p-5 sm:p-6">
                <p className="text-xs uppercase tracking-wide text-red-400 mb-2">
                  Rejected
                </p>
                <p className="text-sm text-zinc-300">{order.rejectedReason}</p>
              </div>
            )}
          </div>

          {/* Right: quote / actions */}
          <div className="space-y-5">
            {order.status === "Requested" && (
              <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 sm:p-6">
                <h3 className="text-sm font-bold mb-3">Send a Rate</h3>
                <p className="text-xs text-zinc-500 mb-4">
                  The customer will see this as an invoice on their status page
                  and can approve it before work begins.
                </p>

                <label className="text-xs text-zinc-500 mb-1.5 block">Rate (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-[#D4AF37]"
                />

                <label className="text-xs text-zinc-500 mb-1.5 block">
                  Note (optional — what&apos;s included)
                </label>
                <textarea
                  value={quoteNote}
                  onChange={(e) => setQuoteNote(e.target.value)}
                  placeholder="e.g. Includes DST + PES, 1 revision"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm mb-4 min-h-20 focus:outline-none focus:border-[#D4AF37]"
                />

                <button
                  onClick={submitQuote}
                  disabled={saving || !quoteAmount}
                  className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 mb-2"
                >
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  Send Rate to Customer
                </button>

                {!showReject ? (
                  <button
                    onClick={() => setShowReject(true)}
                    className="w-full text-xs text-zinc-500 hover:text-red-400 py-2"
                  >
                    Reject this request instead
                  </button>
                ) : (
                  <div className="mt-2 border-t border-zinc-900 pt-3">
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Reason (shown to customer)"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm mb-2 min-h-16 focus:outline-none focus:border-red-800"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={submitReject}
                        disabled={saving}
                        className="flex-1 bg-red-950 text-red-300 border border-red-900 font-bold py-2 rounded-xl text-xs disabled:opacity-50"
                      >
                        Confirm Reject
                      </button>
                      <button
                        onClick={() => setShowReject(false)}
                        className="flex-1 bg-zinc-900 border border-zinc-800 font-bold py-2 rounded-xl text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {order.quoteAmount != null && order.status !== "Requested" && (
              <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 sm:p-6">
                <h3 className="text-sm font-bold mb-3">Rate Sent</h3>
                <p className="font-mono text-2xl font-bold text-[#D4AF37]">
                  {money(order.quoteAmount)}
                </p>
                {order.quoteNote && (
                  <p className="text-xs text-zinc-400 mt-2">{order.quoteNote}</p>
                )}
                <p className="text-xs text-zinc-600 mt-3">
                  Quoted {order.quotedAt ? new Date(order.quotedAt).toLocaleString() : ""}
                </p>
                {order.status === "Quoted" && (
                  <p className="text-xs text-amber-400 mt-3 bg-amber-950/30 border border-amber-900/40 rounded-lg p-2.5">
                    Waiting on the customer to approve this rate.
                  </p>
                )}
              </div>
            )}

            {(order.status === "Approved" || order.status === "Files Ready") && (
              <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 sm:p-6">
                <h3 className="text-sm font-bold mb-1">Completed Files</h3>
                <p className="text-xs text-zinc-500 mb-4">
                  Uploading here notifies the customer to attach a payment
                  screenshot before they can download.
                </p>

                {order.files.length > 0 && (
                  <div className="space-y-1.5 mb-4">
                    {order.files.map((f) => (
                      <div
                        key={f.url}
                        className="flex items-center justify-between gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300"
                      >
                        <span className="truncate">{f.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                <OnlineOrderFileUpload orderId={order._id} onSubmitted={loadOrder} />
              </div>
            )}

            <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 sm:p-6">
              <h3 className="text-sm font-bold mb-2">Public Status Link</h3>
              <p className="text-xs text-zinc-500 mb-2">
                Share this with the customer so they can follow their order:
              </p>
              <code className="text-xs text-[#D4AF37] break-all">
                /order-status/{order.requestNo}
              </code>
            </div>
          </div>
        </div>
      )}
    </RsmShell>
  );
}
