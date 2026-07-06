"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { Customer, Order, Payment, PaymentMethod } from "@/types/rsm";
import { PAYMENT_METHODS } from "@/types/constants";

interface PaymentFormProps {
  payment: Payment | null; // null = creating new
}

export default function PaymentForm({ payment }: PaymentFormProps) {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [customerId, setCustomerId] = useState(payment?.customerId || "");
  const [orderId, setOrderId] = useState(payment?.orderId || "");
  const [amount, setAmount] = useState(payment?.amount?.toString() || "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    payment?.paymentMethod || "Bank Transfer"
  );
  const [date, setDate] = useState(payment?.date || new Date().toISOString().slice(0, 10));
  const [reference, setReference] = useState(payment?.reference || "");
  const [confirmed, setConfirmed] = useState(payment?.confirmed ?? true);
  const [notes, setNotes] = useState(payment?.notes || "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/rsm/customers")
      .then((r) => r.json())
      .then((data) => setCustomers(data.customers || []))
      .catch(() => {});

    fetch("/api/rsm/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => {});
  }, []);

  // Only show orders belonging to the selected customer, since a payment
  // must be tied to one of that customer's own orders (or none, for a
  // general on-account payment).
  const customerOrders = orders.filter((o) => o.customerId === customerId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const amountNum = Number(amount);

    if (!customerId) {
      setError("Please select a customer.");
      return;
    }
    if (!amountNum || amountNum <= 0) {
      setError("Please enter a payment amount greater than 0.");
      return;
    }
    if (!date) {
      setError("Please set a payment date.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        customerId,
        orderId: orderId || undefined,
        amount: amountNum,
        paymentMethod,
        date,
        reference,
        confirmed,
        notes,
      };

      const url = payment ? `/api/rsm/payments/${payment._id}` : "/api/rsm/payments";
      const method = payment ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      router.push("/RSM/payments");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Customer *</label>
          <select
            value={customerId}
            onChange={(e) => {
              setCustomerId(e.target.value);
              setOrderId(""); // reset order pick when customer changes
            }}
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
          <label className="block text-xs text-zinc-500 mb-1.5">
            Linked Order (optional)
          </label>
          <select
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            disabled={!customerId}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] disabled:opacity-50"
          >
            <option value="">General payment (no order)</option>
            {customerOrders.map((o) => (
              <option key={o._id} value={o._id}>
                {o.orderNo} — ${o.total.toFixed(2)} (balance ${o.balanceDue.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Amount ($) *</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Date *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Reference / Transaction ID</label>
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Mark as Confirmed</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            Confirmed payments immediately update the linked order's balance and the customer ledger.
            Uncheck this if you're still waiting to verify the payment.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setConfirmed((v) => !v)}
          className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
            confirmed ? "bg-[#D4AF37]" : "bg-zinc-700"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              confirmed ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

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
          onClick={() => router.push("/RSM/payments")}
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
          {payment ? "Save Changes" : "Record Payment"}
        </button>
      </div>
    </form>
  );
}
