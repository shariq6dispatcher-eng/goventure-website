"use client";

import { useEffect, useState } from "react";

interface StaffStatus {
  username: string;
  name: string;
  role: "admin" | "staff";
  online: boolean;
  lastActive: string | null;
}

function lastSeenLabel(lastActive: string | null) {
  if (!lastActive) return "Never logged in";
  const diffMs = Date.now() - new Date(lastActive).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function RsmOnlineUsers() {
  const [staff, setStaff] = useState<StaffStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      fetch("/api/rsm/staff/status")
        .then((r) => r.json())
        .then((data) => {
          if (data.staff) setStaff(data.staff);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    };
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  if (loading || staff.length === 0) return null;

  const onlineCount = staff.filter((s) => s.online).length;

  return (
    <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">Team</h3>
        <span className="text-[11px] text-zinc-500">
          <span className="text-emerald-400 font-bold">{onlineCount}</span> online
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {staff.map((s) => (
          <div
            key={s.username}
            title={s.online ? "Online now" : `Last active ${lastSeenLabel(s.lastActive)}`}
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full pl-2.5 pr-3 py-1.5"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              {s.online && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  s.online ? "bg-emerald-400" : "bg-zinc-600"
                }`}
              />
            </span>
            <span className="text-xs font-medium text-zinc-200">{s.name}</span>
            {!s.online && (
              <span className="text-[10px] text-zinc-600">{lastSeenLabel(s.lastActive)}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
