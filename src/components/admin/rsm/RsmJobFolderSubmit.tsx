"use client";

import { useState } from "react";
import { UploadCloud, X, Loader2, FolderPlus, FileCheck2 } from "lucide-react";

interface PendingFile {
  file: File;
  status: "pending" | "uploading" | "done" | "error";
  url?: string;
}

interface RsmJobFolderSubmitProps {
  jobId: string;
  onSubmitted: () => void;
}

export default function RsmJobFolderSubmit({ jobId, onSubmitted }: RsmJobFolderSubmitProps) {
  const [folderName, setFolderName] = useState("");
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

    if (!folderName.trim()) {
      setError("Please name this submission (e.g. today's date or a batch name).");
      return;
    }
    if (pendingFiles.length === 0) {
      setError("Please add at least one finished file.");
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

        const res = await fetch("/api/rsm/digitizing-jobs/upload", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();

        if (!res.ok) {
          setPendingFiles((prev) =>
            prev.map((f, idx) => (idx === i ? { ...f, status: "error" } : f))
          );
          throw new Error(data.error || `Failed to upload ${pendingFiles[i].file.name}`);
        }

        setPendingFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: "done", url: data.url } : f))
        );
        uploaded.push({ name: data.name, url: data.url });
      }

      const submitRes = await fetch(`/api/rsm/digitizing-jobs/${jobId}/folders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: folderName.trim(), files: uploaded }),
      });
      const submitData = await submitRes.json();
      if (!submitRes.ok) throw new Error(submitData.error || "Submission failed");

      setFolderName("");
      setPendingFiles([]);
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-5 space-y-4">
      <h4 className="font-bold text-sm text-white flex items-center gap-2">
        <FolderPlus className="w-4 h-4 text-[#D4AF37]" />
        Submit Completed Files
      </h4>
      <p className="text-xs text-zinc-500 -mt-2">
        Upload the finished embroidery files (DST/PES/EXP/AI/etc.) as a batch.
      </p>

      <div>
        <label className="block text-xs text-zinc-500 mb-1.5">Submission Name</label>
        <input
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="e.g. Final Files — Jul 8"
          disabled={submitting}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] disabled:opacity-50"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 w-fit cursor-pointer bg-zinc-900 border border-dashed border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-400 hover:border-zinc-600 transition">
          <UploadCloud className="w-4 h-4" />
          Add finished files
          <input
            type="file"
            multiple
            className="hidden"
            disabled={submitting}
            onChange={(e) => handleFilesSelected(e.target.files)}
          />
        </label>
      </div>

      {pendingFiles.length > 0 && (
        <div className="space-y-1.5">
          {pendingFiles.map((pf, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs"
            >
              <span className="truncate text-zinc-300 flex items-center gap-2">
                {pf.status === "uploading" && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />}
                {pf.status === "done" && <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />}
                {pf.file.name}
              </span>
              {pf.status === "pending" && (
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-zinc-500 hover:text-red-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              {pf.status === "error" && (
                <span className="text-red-400">Failed</span>
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded-xl px-3.5 py-2.5">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={uploadAllAndSubmit}
        disabled={submitting}
        className="flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
      >
        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {submitting ? "Submitting…" : "Submit Files"}
      </button>
    </div>
  );
}
