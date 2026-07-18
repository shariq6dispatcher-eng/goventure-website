"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Loader2,
  FolderOpen,
  Download,
  Share2,
  FileText,
} from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import { useRsmAccess } from "@/lib/useRsmAccess";
import type { DigitizingJob, DigitizingJobFile } from "@/types/rsm";

// Display Job ID, e.g. DIGI-1898743, derived from the Mongo _id so we
// don't need a schema migration just to show a friendly badge.
function displayJobId(id: string) {
  const numeric = id
    .split("")
    .map((c) => c.charCodeAt(0))
    .join("")
    .slice(-7);
  return `DIGI-${numeric}`;
}

interface ProjectFolder {
  job: DigitizingJob;
  files: DigitizingJobFile[];
}

export default function WorkVaultPage() {
  const me = useRsmAccess("digitizing_work");
  const [jobs, setJobs] = useState<DigitizingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/rsm/digitizing-jobs")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setJobs(data.jobs || []);
      })
      .catch((err) => setError(err.message || "Failed to load work vault"))
      .finally(() => setLoading(false));
  }, []);

  // Group every job into a single "project folder" containing all files
  // from all of its submitted folders — this is what gets rendered as one
  // card, mirroring how a real production bundle folder looks.
  const projectFolders: ProjectFolder[] = useMemo(() => {
    return jobs
      .map((job) => ({
        job,
        files: (job.folders || []).flatMap((f) => f.files),
      }))
      .filter((p) => p.files.length > 0)
      .sort((a, b) => {
        const aLatest = Math.max(
          ...a.files.map((f) => new Date(f.uploadedAt).getTime())
        );
        const bLatest = Math.max(
          ...b.files.map((f) => new Date(f.uploadedAt).getTime())
        );
        return bLatest - aLatest;
      });
  }, [jobs]);

  const filtered = projectFolders.filter((p) => {
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      p.job.designName.toLowerCase().includes(q) ||
      p.job.customerName.toLowerCase().includes(q) ||
      displayJobId(p.job._id).toLowerCase().includes(q) ||
      p.files.some((f) => f.name.toLowerCase().includes(q))
    );
  });

  const totalFiles = projectFolders.reduce((sum, p) => sum + p.files.length, 0);

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Work Vault"
      subtitle={`${totalFiles} submitted file${totalFiles === 1 ? "" : "s"} across ${projectFolders.length} project folder${projectFolders.length === 1 ? "" : "s"}`}
    >
      <div className="relative mb-5 sm:mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search design, customer, job ID, filename…"
          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <Loader2 size={20} className="animate-spin mr-2" />
          Loading work vault…
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-xl p-4">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-10 text-center text-zinc-500 text-sm">
          <FolderOpen className="w-6 h-6 mx-auto mb-2 text-zinc-700" />
          {projectFolders.length === 0
            ? "No files submitted yet. They'll show up here once a digitizer submits completed work."
            : "No folders match your search."}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <div
              key={p.job._id}
              className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3 min-w-0">
                  {p.job.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.job.imageUrl}
                      alt={`${p.job.designName} reference`}
                      className="w-14 h-14 rounded-lg object-cover border border-zinc-800 shrink-0 bg-black/40"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg border border-dashed border-zinc-800 shrink-0 flex items-center justify-center text-zinc-700">
                      <FolderOpen size={18} />
                    </div>
                  )}
                  <div className="min-w-0 pt-0.5">
                    <Link
                      href={`/RSM/digitizing-jobs/${p.job._id}`}
                      className="flex items-center gap-2 text-sm font-bold text-white hover:text-[#D4AF37] transition-colors"
                    >
                      <span className="truncate uppercase tracking-wide">
                        {p.job.designName}
                      </span>
                    </Link>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                      {p.job.customerName}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  title="Share files via email — coming in the next update"
                  disabled
                  className="p-2 rounded-lg text-zinc-600 border border-zinc-800 cursor-not-allowed shrink-0"
                  aria-label="Share folder"
                >
                  <Share2 size={15} />
                </button>
              </div>

              <div className="space-y-1 mb-4 text-xs">
                <p className="text-zinc-500">
                  Job ID:{" "}
                  <span className="text-zinc-300 font-mono">
                    {displayJobId(p.job._id)}
                  </span>
                </p>
                <p className="text-zinc-500">
                  Design: <span className="text-zinc-200">{p.job.designName}</span>
                </p>
                <p className="text-zinc-500">
                  Client:{" "}
                  <span className="text-[#D4AF37]">{p.job.customerName}</span>
                </p>
              </div>

              <p className="text-[11px] uppercase tracking-wide text-zinc-600 font-medium mb-2">
                Production Bundle Files ({p.files.length})
              </p>

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {p.files.map((f, i) => (
                  <div
                    key={`${f.url}-${i}`}
                    className="flex items-center justify-between gap-2 bg-black/30 border border-zinc-800/80 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={14} className="text-zinc-500 shrink-0" />
                      <span className="text-xs text-zinc-300 truncate">
                        {f.name}
                      </span>
                    </div>
                    <a
                      href={f.url}
                      download
                      className="flex items-center gap-1 shrink-0 text-xs font-medium bg-zinc-800 hover:bg-[#D4AF37] hover:text-black text-zinc-200 rounded-md px-2.5 py-1.5 transition-colors"
                    >
                      <Download size={12} />
                      Get
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </RsmShell>
  );
}
