"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, Pencil, Trash2, Contact } from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import RsmSkeleton from "@/components/admin/rsm/RsmSkeleton";
import RsmEmptyState from "@/components/admin/rsm/RsmEmptyState";
import { useRsmAccess } from "@/lib/useRsmAccess";
import type { Lead, LeadPlatform } from "@/types/rsm";
import { LEAD_PLATFORMS } from "@/types/constants";

const PLATFORM_COLORS: Record<LeadPlatform, string> = {
  Facebook: "bg-blue-950/40 text-blue-300 border-blue-900/60",
  Instagram: "bg-pink-950/40 text-pink-300 border-pink-900/60",
  Email: "bg-zinc-800 text-zinc-300 border-zinc-700",
  "Google Voice": "bg-emerald-950/40 text-emerald-300 border-emerald-900/60",
  Whatsapp: "bg-green-950/40 text-green-300 border-green-900/60",
};

export default function LeadsPage() {
  const me = useRsmAccess("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<LeadPlatform | "All">("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rsm/leads")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setLeads(data.leads || []);
      })
      .catch((err) => setError(err.message || "Failed to load leads"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/rsm/leads/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setLeads((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return leads.filter((l) => {
      const matchesQuery =
        l.customerName.toLowerCase().includes(q) ||
        (l.phone || "").toLowerCase().includes(q) ||
        (l.email || "").toLowerCase().includes(q) ||
        (l.comment || "").toLowerCase().includes(q);
      const matchesPlatform = platformFilter === "All" || l.platform === platformFilter;
      return matchesQuery && matchesPlatform;
    });
  }, [leads, query, platformFilter]);

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Leads"
      subtitle={
        me.role === "admin"
          ? `${leads.length} total across all users`
          : `${leads.length} total`
      }
    >
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-5 sm:mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, email, comment…"
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="flex gap-2.5 sm:gap-3">
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as LeadPlatform | "All")}
            className="flex-1 sm:flex-none bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="All">All platforms</option>
            {LEAD_PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <Link
            href="/RSM/leads/new"
            className="flex items-center justify-center gap-2 bg-[#D4AF37] text-black font-medium text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Lead</span>
          </Link>
        </div>
      </div>

      {loading && <RsmSkeleton rows={6} />}

      {!loading && error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-xl p-4">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        leads.length === 0 ? (
          <RsmEmptyState
            icon={Contact}
            title="No leads yet"
            description="Add your first lead to start tracking follow-ups."
            ctaLabel="Add Lead"
            ctaHref="/RSM/leads/new"
          />
        ) : (
          <RsmEmptyState
            icon={Search}
            title="No matches"
            description="No leads match your current search or platform filter. Try adjusting them."
          />
        )
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          {/* Mobile card list */}
          <div className="sm:hidden space-y-2.5">
            {filtered.map((l) => (
              <div
                key={l._id}
                className="bg-zinc-900/60 border border-zinc-900 rounded-xl p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white truncate">
                        {l.customerName}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border whitespace-nowrap ${PLATFORM_COLORS[l.platform]}`}
                      >
                        {l.platform}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      {l.phone || l.email || "No contact info"}
                    </p>
                    {l.comment && (
                      <p className="text-xs text-zinc-500 mt-1 truncate">{l.comment}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/RSM/leads/${l._id}/edit`}
                      className="p-2 text-zinc-400 active:text-[#D4AF37] active:bg-zinc-800 rounded-lg transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(l._id)}
                      disabled={deletingId === l._id}
                      className="p-2 text-zinc-400 active:text-red-400 active:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
                      aria-label="Delete"
                    >
                      {deletingId === l._id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-900 text-xs">
                  <span className="text-zinc-500">
                    Follow up: {l.followUpDate || "—"}
                  </span>
                  {me.role === "admin" && (
                    <span className="text-zinc-600 font-mono">{l.createdBy}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block bg-zinc-900/60 border border-zinc-900 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 text-xs uppercase tracking-wide">
                    <th className="text-left px-5 py-3 font-medium">Customer</th>
                    <th className="text-left px-5 py-3 font-medium">Contact</th>
                    <th className="text-left px-5 py-3 font-medium">Platform</th>
                    <th className="text-left px-5 py-3 font-medium">Follow Up</th>
                    <th className="text-left px-5 py-3 font-medium">Comment</th>
                    {me.role === "admin" && (
                      <th className="text-left px-5 py-3 font-medium">Owner</th>
                    )}
                    <th className="text-right px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l) => (
                    <tr
                      key={l._id}
                      className="border-b border-zinc-900/60 last:border-0 hover:bg-zinc-900/40"
                    >
                      <td className="px-5 py-3 font-medium">{l.customerName}</td>
                      <td className="px-5 py-3 text-zinc-400">
                        {l.phone || l.email || "—"}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${PLATFORM_COLORS[l.platform]}`}
                        >
                          {l.platform}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-400">{l.followUpDate || "—"}</td>
                      <td className="px-5 py-3 text-zinc-400 max-w-xs truncate">
                        {l.comment || "—"}
                      </td>
                      {me.role === "admin" && (
                        <td className="px-5 py-3 text-zinc-500 font-mono text-xs">
                          {l.createdBy}
                        </td>
                      )}
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/RSM/leads/${l._id}/edit`}
                            className="p-2 text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-800 rounded-lg transition-colors"
                            aria-label="Edit"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(l._id)}
                            disabled={deletingId === l._id}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
                            aria-label="Delete"
                          >
                            {deletingId === l._id ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </RsmShell>
  );
}
