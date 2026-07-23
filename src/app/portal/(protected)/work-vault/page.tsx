"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, FolderOpen, Download, FileText } from "lucide-react";
import type { DigitizingJob, DigitizingJobFile } from "@/types/rsm";

// Same friendly job-id badge as the RSM Work Vault, e.g. DIGI-1898743.
function displayJobId(id: string) {
  const numeric = id
    .split("")
    .map((c) => c.charCodeAt(0))
    .join("")
    .slice(-7);
  return `DIGI-${numeric}`;
}

const STATUS_STYLES: Record<string, string> = {
  Pending: "text-zinc-400 border-zinc-700",
  "Start Digitizing": "text-blue-400 border-blue-900",
  Completed: "text-emerald-400 border-emerald-900",
  Delivered: "text-[#D4AF37] border-[#D4AF37]/40",
};

interface ProjectFolder {
  job: DigitizingJob;
  files: DigitizingJobFile[];
}

export default function CustomerWorkVaultPage() {
  const [jobs, setJobs] = useState<DigitizingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/portal/jobs")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setJobs(data.jobs || []);
      })
      .catch((err) => setError(err.message || "Failed to load your jobs"))
      .finally(() => setLoading(false));
  }, []);

  // Every job becomes one card. Jobs with submitted files show those files;
  // jobs still in progress show a status badge instead.
  const projectFolders: ProjectFolder[] = useMemo(() => {
    return jobs
      .map((job) => ({
        job,
        files: (job.folders || []).flatMap((f) => f.files),
      }))
      .sort(
        (a, b) =>
          new Date(b.job.updatedAt || b.job.createdAt).getTime() -
          new Date(a.job.updatedAt || a.job.createdAt).getTime()
      );
  }, [jobs]);

  const filtered = projectFolders.filter((p) => {
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      p.job.designName.toLowerCase().includes(q) ||
      displayJobId(p.job._id).toLowerCase().includes(q) ||
      p.files.some((f) => f.name.toLowerCase().includes(q))
    );
  });

  const totalFiles = projectFolders.reduce((sum, p) => sum + p.files.length, 0);

  return (
    <>
      <p className="text-sm text-zinc-500 mb-5 sm:mb-6">
        {jobs.length} job{jobs.length === 1 ? "" : "s"} · {totalFiles} file
        {totalFiles === 1 ? "" : "s"} ready
      </p>

      <div className="relative mb-5 sm:mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search design or filename…"
          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <Loader2 size={20} className="animate-spin mr-2" />
          Loading your jobs…
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
            ? "No jobs yet. They'll show up here once we start work on your first design."
            : "No jobs match your search."}
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
                    <span className="block truncate uppercase tracking-wide text-sm font-bold text-white">
                      {p.job.designName}
                    </span>
                    <p className="text-xs text-zinc-500 truncate mt-0.5 font-mono">
                      {displayJobId(p.job._id)}
                    </p>
                  </div>
                </div>
                <span
                  className={`shrink-0 text-[10px] uppercase tracking-wide font-medium border rounded-full px-2.5 py-1 ${
                    STATUS_STYLES[p.job.status] || "text-zinc-400 border-zinc-700"
                  }`}
                >
                  {p.job.status}
                </span>
              </div>

              {p.files.length > 0 ? (
                <>
                  <p className="text-[11px] uppercase tracking-wide text-zinc-600 font-medium mb-2">
                    Files ({p.files.length})
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
                </>
              ) : (
                <p className="text-xs text-zinc-600 italic">
                  Files will appear here once your design is ready.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
