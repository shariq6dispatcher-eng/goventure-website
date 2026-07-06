"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import type { Customer, CustomerInput } from "@/types/rsm";

interface CustomerModalProps {
  customer: Customer | null; // null = creating new, otherwise editing
  onClose: () => void;
  onSaved: (customer: Customer) => void;
}

const EMPTY_FORM: CustomerInput = {
  name: "",
  email: "",
  phone: "",
  company: "",
  address: "",
  country: "",
};

export default function CustomerModal({
  customer,
  onClose,
  onSaved,
}: CustomerModalProps) {
  const [form, setForm] = useState<CustomerInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company || "",
        address: customer.address || "",
        country: customer.country || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [customer]);

  const handleChange = (field: keyof CustomerInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Name, email, and phone are required.");
      return;
    }

    setSaving(true);
    try {
      const url = customer
        ? `/api/rsm/customers/${customer._id}`
        : "/api/rsm/customers";
      const method = customer ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Save failed");

      onSaved(
        customer
          ? { ...customer, ...form }
          : data.customer
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">
            {customer ? "Edit Customer" : "Add Customer"}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">
              Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
              placeholder="Customer name"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">
                Phone *
              </label>
              <input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                placeholder="+1 555 000 0000"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">
              Company
            </label>
            <input
              value={form.company}
              onChange={(e) => handleChange("company", e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">
              Address
            </label>
            <input
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">
              Country
            </label>
            <input
              value={form.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
              placeholder="Optional"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-zinc-400 border border-zinc-800 hover:bg-zinc-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-[#D4AF37] text-black hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 size={15} className="animate-spin" />}
              {customer ? "Save Changes" : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
