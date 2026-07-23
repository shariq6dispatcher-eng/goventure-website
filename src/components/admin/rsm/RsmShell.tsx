"use client";

import { ReactNode, useEffect, useState } from "react";
import RsmSidebar from "./RsmSidebar";
import RsmNotificationBell from "./RsmNotificationBell";
import RsmGlobalSearch from "./RsmGlobalSearch";

interface RsmShellProps {
  staffName: string;
  staffRole: "admin" | "staff";
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const WELCOME_SESSION_KEY = "rsm_zain_welcome_shown";

export default function RsmShell({
  staffName,
  staffRole,
  title,
  subtitle,
  children,
}: RsmShellProps) {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const ping = () => {
      fetch("/api/rsm/heartbeat", { method: "POST" }).catch(() => {});
    };
    ping(); // immediately on mount/navigation, not just after the first interval
    const id = setInterval(ping, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (staffName?.trim().toLowerCase() !== "zain") return;

    // Show once per browser session (tab) — not on every page navigation.
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(WELCOME_SESSION_KEY) === "1";
    } catch {
      // sessionStorage unavailable — just skip gating and show once
    }
    if (alreadyShown) return;

    try {
      sessionStorage.setItem(WELCOME_SESSION_KEY, "1");
    } catch {
      // ignore
    }
    setShowWelcome(true);
    const timer = setTimeout(() => setShowWelcome(false), 3500);
    return () => clearTimeout(timer);
  }, [staffName]);

  if (showWelcome) {
    return (
      <div className="relative min-h-screen bg-black flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] bg-[#D4AF37]/10 blur-[100px] sm:blur-[160px] rounded-full pointer-events-none" />
        <img
          src="/zain-welcome.jpeg"
          alt="Welcome"
          className="relative w-40 h-40 sm:w-56 sm:h-56 object-contain mb-6 animate-[fadeIn_0.6s_ease-out]"
        />
        <p className="relative text-2xl sm:text-4xl font-bold text-[#D4AF37] tracking-wide animate-[fadeIn_0.8s_ease-out]">
          Welcome Zain!
        </p>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
      <RsmSidebar staffName={staffName} staffRole={staffRole} />

      <main className="flex-1 min-w-0">
       <div className="px-3 sm:px-8 py-4 sm:py-10 max-w-7xl mx-auto">
         <div className="mb-5 sm:mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-lg sm:text-3xl font-bold truncate">{title}</h1>
                {subtitle && (
                  <p className="text-zinc-500 text-xs sm:text-sm mt-1 line-clamp-1">{subtitle}</p>
                )}
              </div>
              <div className="shrink-0 sm:hidden">
                <RsmNotificationBell />
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <RsmGlobalSearch />
              <div className="hidden sm:block">
                <RsmNotificationBell />
              </div>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
