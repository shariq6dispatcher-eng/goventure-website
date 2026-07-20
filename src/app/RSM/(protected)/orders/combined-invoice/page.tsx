"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, FileStack, CheckSquare, Square } from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import { useRsmAccess } from "@/lib/useRsmAccess";
import type { Customer, Order } from "@/types/rsm";

export default function CombinedInvoicePage() {
  const me = useRsmAccess("orders");
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/rsm/customers")
      .then((r) => r.json())
      .then((data) => setCustomers(data.customers || []))
      .catch(() => setError("Failed to load customers"))
      .finally(() => setLoadingCustomers(false));
  }, []);

  useEffect(() => {
    if (!customerId) {
      setOrders([]);
      setSelected(new Set());
      return;
    }
    setLoadingOrders(true);
    setSelected(new Set());
    fetch("/api/rsm/orders")
      .then((r) => r.json())
      .then((data) => {
        const all: Order[] = data.orders || [];
        setOrders(all.filter((o) => o.customerId === customerId));
      })
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoadingOrders(false));
  }, [customerId]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === orders.length) setSelected(new Set());
    else setSelected(new Set(orders.map((o) => o._id)));
  };

  const selectedOrders = useMemo(
    () => orders.filter((o) => selected.has(o._id)),
    [orders, selected]
  );

  const combinedTotal = selectedOrders.reduce((sum, o) => sum + o.total, 0);
  const combinedBalance = selectedOrders.reduce((sum, o) => sum + o.balanceDue, 0);

  const goToPrint = () => {
    if (selected.size === 0) return;
    const ids = Array.from(selected).join(",");
    router.push(`/RSM/orders/combined-invoice/print?ids=${ids}&customerId=${customerId}`);
  };

  const selectedCustomer = customers.find((c) => c._id === customerId);

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Combined Invoice"
      subtitle="Bill a customer for multiple orders at once"
    >
      <Link
        href="/RSM/orders"
        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors mb-4 w-fit"
      >
        <ArrowLeft size={15} /> Back to Orders
      </Link>

      <div className="flex items-center gap-2.5 mb-1">
        <FileStack className="text-[#D4AF37]" size={22} />
        <h1 className="text-xl font-bold">Combined Invoice</h1>
      </div>
      <p className="text-sm text-zinc-500 mb-6">
        Select a customer, pick the orders to combine, and print one invoice for all of them.
      </p>

      {error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-xl p-4 mb-4">
          {error}
        </div>
      )}

      {/* Customer picker */}
      <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 mb-5">
        <label className="block text-xs text-zinc-500 mb-1.5">Customer *</label>
        {loadingCustomers ? (
          <div className="flex items-center gap-2 text-sm text-zinc-500 py-2">
            <Loader2 size={15} className="animate-spin" /> Loading customers…
          </div>
        ) : (
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full sm:w-96 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="">Select a customer…</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} {c.company ? `(${c.company})` : ""}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Orders list */}
      {customerId && (
        <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-300">
              Orders for {selectedCustomer?.name || "customer"}
            </h2>
            {orders.length > 0 && (
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5"
              >
                {selected.size === orders.length ? <CheckSquare size={14} /> : <Square size={14} />}
                {selected.size === orders.length ? "Deselect all" : "Select all"}
              </button>
            )}
          </div>

          {loadingOrders && (
            <div className="flex items-center gap-2 text-sm text-zinc-500 py-6 justify-center">
              <Loader2 size={15} className="animate-spin" /> Loading orders…
            </div>
          )}

          {!loadingOrders && orders.length === 0 && (
            <p className="text-sm text-zinc-500 py-6 text-center">
              This customer has no orders yet.
            </p>
          )}

          {!loadingOrders && orders.length > 0 && (
            <div className="space-y-2">
              {orders.map((o) => (
                <label
                  key={o._id}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border cursor-pointer transition-colors ${
                    selected.has(o._id)
                      ? "border-[#D4AF37]/60 bg-[#D4AF37]/5"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(o._id)}
                    onChange={() => toggle(o._id)}
                    className="w-4 h-4 accent-[#D4AF37]"
                  />
                  <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-2 items-center">
                    <div>
                      <p className="text-sm font-medium font-mono">{o.orderNo}</p>
                      <p className="text-xs text-zinc-500">{o.orderDate}</p>
                    </div>
                    <p className="text-xs text-zinc-400 truncate">
                      {o.designName || o.items[0]?.name || "—"}
                      {o.items.length > 1 ? ` +${o.items.length - 1} more` : ""}
                    </p>
                    <p className="text-xs text-zinc-400">{o.status}</p>
                    <div className="text-right sm:text-left">
                      <p className="text-sm font-medium">${o.total.toFixed(2)}</p>
                      {o.balanceDue > 0 && (
                        <p className="text-xs text-amber-500">${o.balanceDue.toFixed(2)} due</p>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary + action */}
      {selected.size > 0 && (
        <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm">
            <p className="text-zinc-400">
              {selected.size} order{selected.size > 1 ? "s" : ""} selected
            </p>
            <p className="text-lg font-bold mt-0.5">
              Total: <span className="text-[#D4AF37]">${combinedTotal.toFixed(2)}</span>
            </p>
            {combinedBalance > 0 && (
              <p className="text-xs text-amber-500 mt-0.5">
                ${combinedBalance.toFixed(2)} balance due across selected orders
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={goToPrint}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#D4AF37] text-black hover:opacity-90 transition-opacity w-full sm:w-auto"
          >
            Print Combined Invoice
          </button>
        </div>
      )}
    </RsmShell>
  );
}
