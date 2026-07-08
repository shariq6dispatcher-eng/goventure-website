"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function TrackEntryPage() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/track/${encodeURIComponent(trimmed.toUpperCase())}`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <p className="text-xs uppercase tracking-[3px] text-[#D4AF37]">GoVenture</p>
        <h1 className="text-xl sm:text-2xl font-bold mt-1 mb-1">Track Your Order</h1>
        <p className="text-xs sm:text-sm text-zinc-500 mb-6">
          Enter the order number from your invoice or confirmation message.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. ORD-1042"
              autoFocus
              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-center font-mono tracking-wide focus:outline-none focus:border-[#D4AF37] transition"
            />
          </div>
          <button
            type="submit"
            disabled={!value.trim()}
            className="w-full py-3 rounded-xl bg-[#D4AF37] text-black text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            Track Order
          </button>
        </form>
      </div>
    </div>
  );
}
