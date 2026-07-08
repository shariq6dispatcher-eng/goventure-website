"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function ApproveQuoteButton({ requestNo }: { requestNo: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/online-orders/public/${requestNo}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to approve");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleApprove}
        disabled={loading}
        className="w-full bg-[#D4AF37] text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <CheckCircle2 size={16} />
        )}
        {loading ? "Approving…" : "Approve Rate & Continue"}
      </button>
      {error && <p className="text-rose-400 text-xs mt-2 text-center">{error}</p>}
    </div>
  );
}
