"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X } from "lucide-react";
import type { Expense, ExpenseCategory } from "@/types/rsm";
import { EXPENSE_CATEGORIES } from "@/types/constants";

interface ExpenseFormProps {
  expense: Expense | null; // null = creating new
}

export default function ExpenseForm({ expense }: ExpenseFormProps) {
  const router = useRouter();

  const [category, setCategory] = useState<ExpenseCategory>(
    expense?.category || "Raw Materials"
  );
  const [description, setDescription] = useState(expense?.description || "");
  const [amount, setAmount] = useState(expense?.amount?.toString() || "");
  const [date, setDate] = useState(expense?.date || new Date().toISOString().slice(0, 10));
  const [refNo, setRefNo] = useState(expense?.refNo || "");
  // Old imported records sometimes have a `screenshot` value that isn't a
  // real Cloudinary URL. Only trust it if it's genuinely hosted on
  // Cloudinary; otherwise treat this expense as having no screenshot yet.
  const isCloudinaryUrl = (url: string) => /res\.cloudinary\.com/.test(url);
  const [screenshot, setScreenshot] = useState(
    expense?.screenshot && isCloudinaryUrl(expense.screenshot) ? expense.screenshot : ""
  );
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [screenshotError, setScreenshotError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScreenshotSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setScreenshotError("");
    setUploadingScreenshot(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/rsm/expenses/upload-screenshot", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setScreenshot(data.url);
    } catch (err) {
      setScreenshotError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingScreenshot(false);
    }
  };

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const amountNum = Number(amount);

    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }
    if (!amountNum || amountNum <= 0) {
      setError("Please enter an amount greater than 0.");
      return;
    }
    if (!date) {
      setError("Please set a date.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        category,
        description: description.trim(),
        amount: amountNum,
        date,
        refNo,
        screenshot: screenshot || undefined,
      };

      const url = expense ? `/api/rsm/expenses/${expense._id}` : "/api/rsm/expenses";
      const method = expense ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      router.push("/RSM/expenses");
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
          <label className="block text-xs text-zinc-500 mb-1.5">Description *</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
            placeholder="e.g. Thread & bobbins restock"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
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
          <label className="block text-xs text-zinc-500 mb-1.5">Date *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Reference #</label>
          <input
            value={refNo}
            onChange={(e) => setRefNo(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
            placeholder="Optional — invoice/receipt #"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs text-zinc-500 mb-1.5">
            Receipt Screenshot (optional)
          </label>

          {screenshot ? (
            <div className="flex items-center gap-3">
              <a
                href={screenshot}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-20 h-20 rounded-xl overflow-hidden border border-zinc-800 flex-shrink-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={screenshot}
                  alt="Expense receipt"
                  className="w-full h-full object-cover"
                  onError={() => setScreenshot("")}
                />
              </a>
              <div className="flex flex-col gap-1.5">
                <a
                  href={screenshot}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#D4AF37] hover:underline"
                >
                  View full size
                </a>
                <button
                  type="button"
                  onClick={() => setScreenshot("")}
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <X size={13} /> Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingScreenshot}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-zinc-800 rounded-xl px-3.5 py-4 text-sm text-zinc-500 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors disabled:opacity-50"
            >
              {uploadingScreenshot ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Uploading…
                </>
              ) : (
                <>
                  <Upload size={15} /> Attach a receipt/invoice screenshot
                </>
              )}
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleScreenshotSelect}
            className="hidden"
          />

          {screenshotError && (
            <p className="text-red-400 text-xs mt-1.5">{screenshotError}</p>
          )}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.push("/RSM/expenses")}
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
          {expense ? "Save Changes" : "Add Expense"}
        </button>
      </div>
    </form>
  );
}
