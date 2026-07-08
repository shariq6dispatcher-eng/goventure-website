"use client";

import { useState } from "react";
import { UploadCloud, X, Loader2, FileCheck2 } from "lucide-react";

interface PendingFile {
  file: File;
  status: "pending" | "uploading" | "done" | "error";
}

interface OnlineOrderFileUploadProps {
  orderId: string;
  onSubmitted: () => void;
}

export default function OnlineOrderFileUpload({
  orderId,
  onSubmitted,
}: OnlineOrderFileUploadProps) {
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const newOnes: PendingFile[] = Array.from(files).map((file) => ({
      file,
      status: "pending",
    }));
    setPendingFiles((prev) => [...prev, ...newOnes]);
  };

  const removeFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadAllAndSubmit = async () => {
    setError("");

    if (pendingFiles.length === 0) {
      setError("Add at least one finished file first.");
      return;
    }

    setSubmitting(true);

    try {
      const uploaded: { name: string; url: string }[] = [];

      for (let i = 0; i < pendingFiles.length; i++) {
        setPendingFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: "uploading" } : f))
        );

        const fd = new FormData();
        fd.append("file", pendingFiles[i].file);

        // Reuses the existing digitizing-jobs upload route — it's a
        // generic Cloudinary "raw" uploader that already accepts any
        // embroidery/vector file extension, no need for a duplicate.
        const res = await fetch("/api/rsm/digitizing-jobs/upload", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();

        if (!res.ok || !data.url) {
          setPendingFiles((prev) =>
            prev.map((f, idx) => (idx === i ? { ...f, status: "error" } : f))
          );
          throw new Error(data.error || `Failed to upload ${pendingFiles[i].file.name}`);
        }

        uploaded.push({ name: data.name || pendingFiles[i].file.name, url: data.url });
        setPendingFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: "done" } : f))
        );
      }

      const res = await fetch(`/api/online-orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "uploadFiles", files: uploaded }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save files");

      setPendingFiles([]);
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <input
        id="online-order-file-input"
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFilesSelected(e.target.files);
          e.target.value = "";
        }}
      />
      <label
        htmlFor="online-order-file-input"
        className="flex flex-col items-center justify-center gap-2 border border-dashed border-zinc-700 rounded-xl p-6 cursor-pointer hover:border-[#D4AF37]/60 transition text-zinc-500"
      >
        <UploadCloud size={20} />
        <span className="text-xs">
          Click to add finished files (DST, PES, AI, PDF…) — 4 or more is fine
        </span>
      </label>

      {pendingFiles.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {pendingFiles.map((f, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs"
            >
              <span className="truncate text-zinc-300">{f.file.name}</span>
              <div className="flex items-center gap-2 shrink-0">
                {f.status === "uploading" && (
                  <Loader2 size={13} className="animate-spin text-zinc-500" />
                )}
                {f.status === "done" && (
                  <FileCheck2 size={13} className="text-emerald-400" />
                )}
                {f.status === "error" && (
                  <span className="text-red-400">Failed</span>
                )}
                {f.status === "pending" && (
                  <button onClick={() => removeFile(i)} aria-label="Remove">
                    <X size={13} className="text-zinc-500 hover:text-red-400" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-rose-400 text-xs mt-2 bg-rose-950/30 border border-rose-900/40 rounded-lg p-2">
          {error}
        </p>
      )}

      <button
        onClick={uploadAllAndSubmit}
        disabled={submitting || pendingFiles.length === 0}
        className="w-full mt-3 bg-[#D4AF37] text-black font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {submitting && <Loader2 size={15} className="animate-spin" />}
        {submitting ? "Uploading…" : "Upload & Mark Files Ready"}
      </button>
    </div>
  );
}
