"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Pencil, FileImage } from "lucide-react";
import RsmShell from "@/components/admin/rsm/RsmShell";
import RsmJobStatusBadge from "@/components/admin/rsm/RsmJobStatusBadge";
import { useRsmAccess } from "@/lib/useRsmAccess";
import type { DigitizingJob } from "@/types/rsm";

export default function ViewDigitizingJobPage() {
  const params = useParams();
  const id = params.id as string;

  const me = useRsmAccess("digitizing");
  const [job, setJob] = useState<DigitizingJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadJob = () => {
    fetch(`/api/rsm/digitizing-jobs/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setJob(data.job);
      })
      .catch((err) => setError(err.message || "Failed to load job"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!me) return null;

  const money = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

  return (
    <RsmShell
      staffName={me.username}
      staffRole={me.role}
      title="Digitizing Job"
      subtitle={job ? job.designName : ""}
    >
      <div className="mb-5 flex items-center justify-between">
        <Link
          href="/RSM/digitizing-jobs"
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={15} /> Back to Digitizing Jobs
        </Link>

        {job && (
          <Link
            href={`/RSM/digitizing-jobs/${job._id}/edit`}
            className="flex items-center gap-1.5 bg-[#D4AF37] text-black text-sm font-medium px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
          >
            <Pencil size={14} /> Edit Job
          </Link>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <Loader2 size={20} className="animate-spin mr-2" />
          Loading job…
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-xl p-4">
          {error}
        </div>
      )}

      {!loading && !error && job && (
        <div className="space-y-6 max-w-4xl">
          {/* Header card */}
          <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Design Name</p>
              <p className="font-medium">{job.designName}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Status</p>
              <RsmJobStatusBadge status={job.status} />
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Customer</p>
              <p className="font-medium">{job.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Format</p>
              <p className="font-medium">{job.format}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Price</p>
              <p className="font-medium">{money(job.price)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Submitted By</p>
              <p className="font-medium">{job.uploadedBy}</p>
            </div>
            {job.orderId && (
              <div>
                <p className="text-xs text-zinc-500 mb-1">Linked Order</p>
                <Link
                  href={`/RSM/orders/${job.orderId}`}
                  className="font-medium text-[#D4AF37] hover:underline"
                >
                  View Order →
                </Link>
              </div>
            )}
            <div>
              <p className="text-xs text-zinc-500 mb-1">Created</p>
              <p className="font-medium">
                {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Reference image */}
          <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5">
            <h4 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
              <FileImage className="w-4 h-4 text-[#D4AF37]" />
              Design Reference Image
            </h4>
            {job.imageUrl ? (
              <img
                src={job.imageUrl}
                alt={job.designName}
                className="w-full max-w-sm rounded-xl border border-zinc-800 object-cover"
              />
            ) : (
              <p className="text-xs text-zinc-500">No reference image uploaded.</p>
            )}
          </div>

          {/* Notes */}
          {job.notes && (
            <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5">
              <h4 className="font-bold text-sm text-white mb-2">Notes</h4>
              <p className="text-sm text-zinc-300 whitespace-pre-wrap">{job.notes}</p>
            </div>
          )}

          {/* Submitted folders (placeholder — Part 8 will make this functional) */}
          <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5">
            <h4 className="font-bold text-sm text-white mb-2">
              Submitted Files ({job.folders?.length || 0} folder{job.folders?.length === 1 ? "" : "s"})
            </h4>
            {(!job.folders || job.folders.length === 0) && (
              <p className="text-xs text-zinc-500">
                No completed files submitted yet.
              </p>
            )}
          </div>
        </div>
      )}
    </RsmShell>
  );
}
