"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2 } from "lucide-react";

interface PaymentScreenshotUploadProps {
  requestNo: string;
}

export default function PaymentScreenshotUpload({
  requestNo,
}: PaymentScreenshotUploadProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSelect = (selected: File | null) => {
    setError("");
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
  };

  const submit = async () => {
    if (!file) {
      setError("Attach a screenshot of your payment first.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("file", file);

      const uploadRes = await fetch("/api/online-orders/upload-payment", {
        method: "POST",
        body: fd,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.error || "Upload failed");
      }

      const patchRes = await fetch(`/api/online-orders/public/${requestNo}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "paymentSubmitted",
          screenshotUrl: uploadData.url,
        }),
      });
      const patchData = await patchRes.json();
      if (!patchRes.ok) throw new Error(patchData.error || "Failed to submit");

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <input
        id="payment-screenshot-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleSelect(e.target.files?.[0] || null)}
      />

      {!preview ? (
        <label
          htmlFor="payment-screenshot-input"
          className="flex flex-col items-center justify-center gap-2 border border-dashed border-zinc-700 rounded-xl p-6 cursor-pointer hover:border-[#D4AF37]/60 transition text-zinc-500"
        >
          <UploadCloud size={20} />
          <span className="text-xs">Tap to attach your payment screenshot</span>
        </label>
      ) : (
        <div className="border border-zinc-800 rounded-xl p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Payment screenshot preview"
            className="max-h-56 w-full object-contain rounded-lg"
          />
          <label
            htmlFor="payment-screenshot-input"
            className="block text-center text-[11px] text-zinc-500 mt-2 cursor-pointer hover:text-[#D4AF37]"
          >
            Choose a different image
          </label>
        </div>
      )}

      {error && (
        <p className="text-rose-400 text-xs mt-2 bg-rose-950/30 border border-rose-900/40 rounded-lg p-2">
          {error}
        </p>
      )}

      <button
        onClick={submit}
        disabled={submitting || !file}
        className="w-full mt-3 bg-[#D4AF37] text-black font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {submitting && <Loader2 size={15} className="animate-spin" />}
        {submitting ? "Submitting…" : "Submit Payment Proof"}
      </button>
    </div>
  );
}
