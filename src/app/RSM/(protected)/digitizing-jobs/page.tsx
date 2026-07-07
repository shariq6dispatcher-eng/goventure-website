"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Loader2, Pencil, Trash2, Eye, UploadCloud } from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import RsmJobStatusBadge from "@/components/admin/rsm/RsmJobStatusBadge";
import { useRsmAccess } from "@/lib/useRsmAccess";
import type { DigitizingJob, DigitizingJobStatus } from "@/types/rsm";
import { DIGITIZING_JOB_STATUSES } from "@/types/constants";

export default function DigitizingJobsPage() {
  const me = useRsmAccess("digitizing");
  const [jobs, setJobs] = useState<DigitizingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DigitizingJobStatus | "All">("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rsm/digitizing-jobs")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setJobs(data.jobs || []);
      })
      .catch((err) => setError(err.message || "Failed to load jobs"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this digitizing job? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/rsm/digitizing-jobs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = jobs.filter((j) => {
    const q = query.toLowerCase();
    const matchesQuery =
      j.designName.toLowerCase().includes(q) ||
      j.customerName.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || j.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Digitizing Jobs"
      subtitle={`${jobs.length} total`}
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
            placeholder="Search design name, customer…"
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="flex gap-2.5 sm:gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DigitizingJobStatus | "All")}
            className="flex-1 sm:flex-none bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="All">All statuses</option>
            {DIGITIZING_JOB_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <Link
            href="/RSM/digitizing-jobs/new"
            className="flex items-center justify-center gap-2 bg-[#D4AF37] text-black font-medium text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Job</span>
          </Link>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <Loader2 size={20} className="animate-spin mr-2" />
          Loading jobs…
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-xl p-4">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-10 text-center text-zinc-500 text-sm">
          {jobs.length === 0
            ? "No digitizing jobs yet. Create your first one above."
            : "No jobs match your search/filter."}
        </div>
      )}

     {!loading && !error && filtered.length > 0 && (
        <>
          {/* Mobile card list */}
          <div className="sm:hidden space-y-2.5">
            {filtered.map((j) => (
              <div
                key={j._id}
                className="bg-zinc-900/60 border border-zinc-900 rounded-xl p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/RSM/digitizing-jobs/${j._id}`}
                      className="text-sm font-bold text-white hover:text-[#D4AF37] transition-colors truncate block"
                    >
                      {j.designName}
                    </Link>
                    <p className="text-xs text-zinc-400 mt-0.5 truncate">{j.customerName}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <RsmJobStatusBadge status={j.status} />
                      <span className="text-[11px] text-zinc-500">{j.format}</span>
                    </div>
                  </div>
                 <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/RSM/digitizing-jobs/${j._id}`}
                      className="p-2 text-zinc-400 active:text-[#D4AF37] active:bg-zinc-800 rounded-lg transition-colors"
                      aria-label="View"
                    >
                      <Eye size={15} />
                    </Link>
                    <Link
                      href={`/RSM/digitizing-jobs/${j._id}/edit`}
                      className="p-2 text-zinc-400 active:text-[#D4AF37] active:bg-zinc-800 rounded-lg transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(j._id)}
                      disabled={deletingId === j._id}
                      className="p-2 text-zinc-400 active:text-red-400 active:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
                      aria-label="Delete"
                    >
                      {deletingId === j._id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-900 text-xs">
                  <span className="font-mono font-bold text-white">${j.price.toFixed(2)}</span>
                  <Link
                    href={`/RSM/digitizing-jobs/${j._id}#submit-files`}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-[#D4AF37] active:opacity-70"
                  >
                    <UploadCloud size={13} />
                    Upload Files
                  </Link>
                </div>              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block bg-zinc-900/60 border border-zinc-900 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 text-xs uppercase tracking-wide">
                    <th className="text-left px-5 py-3 font-medium">Design Name</th>
                    <th className="text-left px-5 py-3 font-medium">Customer</th>
                    <th className="text-left px-5 py-3 font-medium">Format</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-right px-5 py-3 font-medium">Price</th>
                    <th className="text-right px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((j) => (
                    <tr
                      key={j._id}
                      className="border-b border-zinc-900/60 last:border-0 hover:bg-zinc-900/40"
                    >
                      <td className="px-5 py-3 font-medium">
                        <Link
                          href={`/RSM/digitizing-jobs/${j._id}`}
                          className="hover:text-[#D4AF37] transition-colors"
                        >
                          {j.designName}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-zinc-400">{j.customerName}</td>
                      <td className="px-5 py-3 text-zinc-400">{j.format}</td>
                      <td className="px-5 py-3">
                        <RsmJobStatusBadge status={j.status} />
                      </td>
                      <td className="px-5 py-3 text-right">${j.price.toFixed(2)}</td>
                      <td className="px-5 py-3">
                     <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/RSM/digitizing-jobs/${j._id}#submit-files`}
                            className="p-2 text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-800 rounded-lg transition-colors"
                            aria-label="Upload Files"
                            title="Upload completed files"
                          >
                            <UploadCloud size={15} />
                          </Link>
                          <Link
                            href={`/RSM/digitizing-jobs/${j._id}`}
                            className="p-2 text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-800 rounded-lg transition-colors"
                            aria-label="View"
                          >
                            <Eye size={15} />
                          </Link>
                          <Link
                            href={`/RSM/digitizing-jobs/${j._id}/edit`}
                            className="p-2 text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-800 rounded-lg transition-colors"
                            aria-label="Edit"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(j._id)}
                            disabled={deletingId === j._id}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
                            aria-label="Delete"
                          >
                            {deletingId === j._id ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>                    </tr>
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
