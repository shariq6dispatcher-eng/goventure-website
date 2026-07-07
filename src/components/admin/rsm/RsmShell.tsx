"use client";

import { ReactNode } from "react";
import RsmSidebar from "./RsmSidebar";
import RsmNotificationBell from "./RsmNotificationBell";
interface RsmShellProps {
  staffName: string;
  staffRole: "admin" | "staff";
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function RsmShell({
  staffName,
  staffRole,
  title,
  subtitle,
  children,
}: RsmShellProps) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <RsmSidebar staffName={staffName} staffRole={staffRole} />

      <main className="flex-1 min-w-0">
       <div className="px-4 sm:px-8 py-8 sm:py-10 max-w-7xl mx-auto">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
              {subtitle && (
                <p className="text-zinc-500 text-sm mt-1">{subtitle}</p>
              )}
            </div>
            <RsmNotificationBell />
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
