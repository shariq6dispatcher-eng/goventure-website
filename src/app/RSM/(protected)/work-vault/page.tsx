"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Loader2, FolderOpen, Download, ExternalLink } from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import RsmJobStatusBadge from "@/components/admin/rsm/RsmJobStatusBadge";
import { useRsmAccess } from "@/lib/useRsmAccess";
import type { DigitizingJob } from "@/types/rsm";

interface FlatFile {
  jobId: string;
  designName: string;
  customerName: string;
  status: string;
  folderName: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
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

  const allFiles: FlatFile[] = useMemo(() => {
    const flat: FlatFile[] = [];
    for (const job of jobs) {
      for (const folder of job.folders || []) {
        for (const file of folder.files) {
          flat.push({
            jobId: job._id,
            designName: job.designName,
            customerName: job.customerName,
            status: job.status,
            folderName: folder.name,
            fileName: file.name,
            fileUrl: file.url,
            uploadedAt: file.uploadedAt,
          });
        }
      }
    }
    return flat.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }, [jobs]);

  const filtered = allFiles.filter((f) => {
    const q = query.toLowerCase();
    return (
      f.designName.toLowerCase().includes(q) ||
      f.customerName.toLowerCase().includes(q) ||
      f.folderName.toLowerCase().includes(q) ||
      f.fileName.toLowerCase().includes(q)
    );
  });

  if (!me) return null;

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Work Vault"
      subtitle={`${allFiles.length} submitted file${allFiles.length === 1 ? "" : "s"} across ${jobs.filter((j) => (j.folders?.length || 0) > 0).length} jobs`}
    >
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by design, customer, batch, or filename…"
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
          {allFiles.length === 0
            ? "No files submitted yet. They'll show up here once a digitizer submits completed work."
            : "No files match your search."}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">Design / Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Batch</th>
                  <th className="text-left px-5 py-3 font-medium">File</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Submitted</th>
                  <th className="text-right px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f, i) => (
                  <tr
                    key={`${f.jobId}-${i}`}
                    className="border-b border-zinc-900/60 last:border-0 hover:bg-zinc-900/40"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/RSM/digitizing-jobs/${f.jobId}`}
                        className="font-medium hover:text-[#D4AF37] transition-colors"
                      >
                        {f.designName}
                      </Link>
                      <p className="text-xs text-zinc-500">{f.customerName}</p>
                    </td>
                    <td className="px-5 py-3 text-zinc-400">{f.folderName}</td>
                    <td className="px-5 py-3 text-zinc-400 max-w-[200px] truncate">
                      {f.fileName}
                    </td>
                    <td className="px-5 py-3">
                      <RsmJobStatusBadge status={f.status} />
                    </td>
                    <td className="px-5 py-3 text-zinc-500 text-xs">
                      {new Date(f.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
  <div className="flex items-center justify-end gap-2">
    
      href={f.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-800 rounded-lg transition-colors"
      aria-label="Open"
    >
      <ExternalLink size={15} />
    </a>
    
      href={f.fileUrl}
      download
      className="p-2 text-zinc-400 hover:text-[#D4AF37] hover:bg-zinc-800 rounded-lg transition-colors"
      aria-label="Download"
    >
      <Download size={15} />
    </a>
  </div>
</td>                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </RsmShell>
  );
}
