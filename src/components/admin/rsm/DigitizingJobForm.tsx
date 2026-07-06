"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { Customer, Order, DigitizingJob, DigitizingJobStatus, FileFormat } from "@/types/rsm";
import { DIGITIZING_JOB_STATUSES, FILE_FORMATS } from "@/types/constants";

interface DigitizingJobFormProps {
  job: DigitizingJob | null; // null = creating new
}

export default function DigitizingJobForm({ job }: DigitizingJobFormProps) {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [customerId, setCustomerId] = useState(job?.customerId || "");
  const [orderId, setOrderId] = useState(job?.orderId || "");
  const [designName, setDesignName] = useState(job?.designName || "");
  const [status, setStatus] = useState<DigitizingJobStatus>(job?.status || "Pending");
  const [price, setPrice] = useState(job?.price?.toString() || "");
  const [format, setFormat] = useState<FileFormat>(job?.format || "DST");
  const [notes, setNotes] = useState(job?.notes || "");

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

  const customerOrders = orders.filter((o) => o.customerId === customerId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!customerId) {
      setError("Please select a customer.");
      return;
    }
    if (!designName.trim()) {
      setError("Please enter a design name.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        customerId,
        orderId: orderId || undefined,
        designName: designName.trim(),
        status,
        price: price ? Number(price) : 0,
        format,
        notes,
      };

      const url = job
        ? `/api/rsm/digitizing-jobs/${job._id}`
        : "/api/rsm/digitizing-jobs";
      const method = job ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      router.push("/RSM/digitizing-jobs");
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
        <div className="sm:col-span-2">
          <label className="block text-xs text-zinc-500 mb-1.5">Design Name *</label>
          <input
            value={designName}
            onChange={(e) => setDesignName(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
            placeholder="e.g. Left Chest Logo"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Customer *</label>
          <select
            value={customerId}
            onChange={(e) => {
              setCustomerId(e.target.value);
              setOrderId("");
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
            <option value="">No linked order</option>
            {customerOrders.map((o) => (
              <option key={o._id} value={o._id}>
                {o.orderNo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as DigitizingJobStatus)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          >
            {DIGITIZING_JOB_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Format *</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as FileFormat)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          >
            {FILE_FORMATS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Price</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
            placeholder="0.00"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs text-zinc-500 mb-1.5">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
            placeholder="Optional notes about this digitizing job…"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-xl px-3.5 py-2.5">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {job ? "Save Changes" : "Create Job"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={saving}
          className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
