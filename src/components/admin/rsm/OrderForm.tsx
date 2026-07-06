"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { Customer, Order, OrderItem, OrderStatus, ServiceCategory, FileFormat } from "@/types/rsm";
import { ORDER_STATUSES, SERVICE_CATEGORIES, FILE_FORMATS, SERVICE_PRESETS } from "@/types/constants";

interface OrderFormProps {
  order: Order | null; // null = creating new
}

function emptyItem(): OrderItem {
  return {
    id: Math.random().toString(36).slice(2),
    category: "Embroidery Digitizing",
    name: "",
    quantity: 1,
    price: 0,
  };
}

export default function OrderForm({ order }: OrderFormProps) {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState(order?.customerId || "");
  const [items, setItems] = useState<OrderItem[]>(
    order?.items?.length ? order.items : [emptyItem()]
  );
  const [status, setStatus] = useState<OrderStatus>(order?.status || "Pending");
  const [discount, setDiscount] = useState(order?.discount || 0);
  const [tax, setTax] = useState(order?.tax || 0);
  const [orderDate, setOrderDate] = useState(
    order?.orderDate || new Date().toISOString().slice(0, 10)
  );
  const [dueDate, setDueDate] = useState(order?.dueDate || "");
  const [designName, setDesignName] = useState(order?.designName || "");
  const [stitchCount, setStitchCount] = useState(order?.stitchCount?.toString() || "");
  const [notes, setNotes] = useState(order?.notes || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/rsm/customers")
      .then((r) => r.json())
      .then((data) => setCustomers(data.customers || []))
      .catch(() => {});
  }, []);

  const updateItem = (id: string, field: keyof OrderItem, value: string | number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  const applyPreset = (id: string, presetId: string) => {
    const preset = SERVICE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, category: preset.category, name: preset.name, price: preset.price }
          : it
      )
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);
  const removeItem = (id: string) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev));

  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.price, 0);
  const total = Math.max(0, subtotal - discount + tax);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!customerId) {
      setError("Please select a customer.");
      return;
    }
    if (items.some((it) => !it.name.trim() || it.price <= 0)) {
      setError("Every line item needs a name and a price greater than 0.");
      return;
    }
    if (!dueDate) {
      setError("Please set a due date.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        customerId,
        items,
        status,
        subtotal,
        discount,
        tax,
        total,
        orderDate,
        dueDate,
        designName,
        stitchCount: stitchCount ? Number(stitchCount) : undefined,
        notes,
      };

      const url = order ? `/api/rsm/orders/${order._id}` : "/api/rsm/orders";
      const method = order ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      router.push("/RSM/orders");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Customer + status + dates */}
      <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Customer *</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="">Select a customer…</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} {c.company ? `(${c.company})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Order Date</label>
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Due Date *</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Design Name</label>
          <input
            value={designName}
            onChange={(e) => setDesignName(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Stitch Count</label>
          <input
            type="number"
            value={stitchCount}
            onChange={(e) => setStitchCount(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
            placeholder="Optional"
          />
        </div>
      </div>

      {/* Line items */}
      <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Line Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 text-xs text-[#D4AF37] hover:opacity-80"
          >
            <Plus size={14} /> Add Item
          </button>
        </div>

        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={it.id}
              className="border border-zinc-800 rounded-xl p-4 space-y-3"
            >
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">
                    Quick-fill preset
                  </label>
                  <select
                    onChange={(e) => applyPreset(it.id, e.target.value)}
                    defaultValue=""
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="" disabled>Choose a preset…</option>
                    {SERVICE_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ${p.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Category</label>
                  <select
                    value={it.category}
                    onChange={(e) => updateItem(it.id, "category", e.target.value as ServiceCategory)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                  >
                    {SERVICE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-500 mb-1.5">Item name *</label>
                <input
                  value={it.name}
                  onChange={(e) => updateItem(it.id, "name", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                  placeholder="e.g. Left Chest Logo Digitizing"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Qty</label>
                  <input
                    type="number"
                    min={1}
                    value={it.quantity}
                    onChange={(e) => updateItem(it.id, "quantity", Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Price ($) *</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={it.price}
                    onChange={(e) => updateItem(it.id, "price", Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5">Format</label>
                  <select
                    value={it.format || ""}
                    onChange={(e) => updateItem(it.id, "format", e.target.value as FileFormat)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="">—</option>
                    {FILE_FORMATS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-500">
                  Line total: <span className="text-white font-medium">${(it.quantity * it.price).toFixed(2)}</span>
                </p>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(it.id)}
                    className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-400">Discount ($)</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-28 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-400">Tax ($)</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={tax}
            onChange={(e) => setTax(Number(e.target.value))}
            className="w-28 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
        <div className="flex justify-between text-base font-bold border-t border-zinc-800 pt-3">
          <span>Total</span>
          <span className="text-[#D4AF37]">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5">
        <label className="block text-xs text-zinc-500 mb-1.5">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          placeholder="Optional"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.push("/RSM/orders")}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 border border-zinc-800 hover:bg-zinc-900 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#D4AF37] text-black hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <Loader2 size={15} className="animate-spin" />}
          {order ? "Save Changes" : "Create Order"}
        </button>
      </div>
    </form>
  );
}
