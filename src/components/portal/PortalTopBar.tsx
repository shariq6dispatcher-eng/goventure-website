"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";

export default function PortalTopBar({ name }: { name: string }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/portal/logout", { method: "POST" });
    } finally {
      router.push("/portal/login");
      router.refresh();
    }
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[3px] text-[#D4AF37]">
            GoVenture
          </p>
          <h1 className="text-lg font-bold">Work Vault</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-400 hidden sm:block">
            {name}
          </span>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white border border-zinc-800 rounded-xl px-3 py-2 transition-colors disabled:opacity-50"
          >
            {loggingOut ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <LogOut size={15} />
            )}
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
