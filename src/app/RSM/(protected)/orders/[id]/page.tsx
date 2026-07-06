"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Pencil } from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import RsmStatusBadge from "@/components/admin/rsm/RsmStatusBadge";
import type { Order } from "@/types/rsm";

async function fetchMe(): Promise<{ username: string; role: "admin" | "staff" }> {
  const res = await fetch("/api/rsm/me");
  if (!res.ok) throw new Error("not authed");
  return res.json();
}

export default function ViewOrderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [me, setMe] = useState<{ username: string; role: "admin" | "staff" } | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMe()
      .then(setMe)
      .catch(() => router.push("/RSM/login"));

    fetch(`/api/rsm/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setOrder(data.order);
      })
      .catch((err) => setError(err.message || "Failed to load order"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Order Details"
      subtitle={order ? order.orderNo : ""}
    >
      <div className="mb-5 flex items-center justify-between">
        <Link
          href="/RSM/orders"
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={15} /> Back to Orders
        </Link>

        {order && (
          <Link
            href={`/RSM/orders/${order._id}/edit`}
            className="flex items-center gap-1.5 bg-[#D4AF37] text-black text-sm font-medium px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
          >
            <Pencil size={14} /> Edit Order
          </Link>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <Loader2 size={20} className="animate-spin mr-2" />
          Loading order…
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-xl p-4">
          {error}
        </div>
      )}

      {!loading && !error && order && (
        <div className="space-y-6 max-w-4xl">
          {/* Header card */}
          <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Order Number</p>
              <p className="font-medium">{order.orderNo}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Status</p>
              <RsmStatusBadge status={order.status} />
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Customer</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Design Name</p>
              <p className="font-medium">{order.designName || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Order Date</p>
              <p className="font-medium">{order.orderDate}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Due Date</p>
              <p className="font-medium">{order.dueDate}</p>
            </div>
            {order.stitchCount != null && (
              <div>
                <p className="text-xs text-zinc-500 mb-1">Stitch Count</p>
                <p className="font-medium">{order.stitchCount.toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Line items */}
          <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-900">
              <h3 className="text-sm font-semibold">Line Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 text-xs uppercase tracking-wide">
                    <th className="text-left px-5 py-3 font-medium">Item</th>
                    <th className="text-left px-5 py-3 font-medium">Category</th>
                    <th className="text-left px-5 py-3 font-medium">Format</th>
                    <th className="text-right px-5 py-3 font-medium">Qty</th>
                    <th className="text-right px-5 py-3 font-medium">Price</th>
                    <th className="text-right px-5 py-3 font-medium">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((it) => (
                    <tr key={it.id} className="border-b border-zinc-900/60 last:border-0">
                      <td className="px-5 py-3">{it.name}</td>
                      <td className="px-5 py-3 text-zinc-400">{it.category}</td>
                      <td className="px-5 py-3 text-zinc-400">{it.format || "—"}</td>
                      <td className="px-5 py-3 text-right">{it.quantity}</td>
                      <td className="px-5 py-3 text-right">${it.price.toFixed(2)}</td>
                      <td className="px-5 py-3 text-right font-medium">
                        ${(it.quantity * it.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals + notes */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Discount</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Tax</span>
                <span>+${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-zinc-800 pt-2.5">
                <span>Total</span>
                <span className="text-[#D4AF37]">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm pt-1">
                <span className="text-zinc-400">Amount Paid</span>
                <span className="text-emerald-400">${order.amountPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Balance Due</span>
                <span className={order.balanceDue > 0 ? "text-amber-400" : "text-zinc-500"}>
                  ${order.balanceDue.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5">
              <p className="text-xs text-zinc-500 mb-2">Notes</p>
              <p className="text-sm text-zinc-300 whitespace-pre-wrap">
                {order.notes || "No notes for this order."}
              </p>
            </div>
          </div>
        </div>
      )}
    </RsmShell>
  );
}
