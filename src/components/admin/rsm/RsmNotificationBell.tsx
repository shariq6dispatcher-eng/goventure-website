"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import type { RsmNotification } from "@/types/rsm";

export default function RsmNotificationBell() {
  const [notifications, setNotifications] = useState<RsmNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const loadNotifications = () => {
    fetch("/api/rsm/notifications")
      .then((r) => r.json())
      .then((data) => setNotifications(data.notifications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markOneRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    fetch("/api/rsm/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    fetch("/api/rsm/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    }).catch(() => {});
  };

  const timeAgo = (iso: string) => {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-xl bg-zinc-900/60 border border-zinc-900 hover:border-zinc-700 transition text-zinc-300"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full bg-[#D4AF37] text-black text-[9px] font-black">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl shadow-black/40 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900">
            <span className="text-xs font-bold text-white">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-[10px] text-[#D4AF37] hover:text-[#e5c458] font-bold"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-8 text-zinc-500">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="text-center py-8 text-zinc-500 text-xs">
                No notifications yet.
              </div>
            )}

            {!loading &&
              notifications.map((n) => (
                <button
                  key={n._id}
                  onClick={() => !n.read && markOneRead(n._id)}
                  className={`w-full text-left px-4 py-3 border-b border-zinc-900/80 last:border-0 hover:bg-zinc-900/60 transition ${
                    !n.read ? "bg-zinc-900/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed line-clamp-2">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-zinc-600 mt-1 font-mono">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
          </div>

          {notifications.some((n) => n.jobId) && (
            <div className="px-4 py-2.5 border-t border-zinc-900 bg-zinc-900/40">
              <Link
                href="/RSM/digitizing-jobs"
                className="text-[10px] text-[#D4AF37] hover:text-[#e5c458] font-bold"
                onClick={() => setOpen(false)}
              >
                View all digitizing jobs →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
