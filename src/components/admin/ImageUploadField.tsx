"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

interface ImageUploadFieldProps {
  imageUrl: string;
  onChange: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

/**
 * Handles picking a file, uploading it to /api/upload (Cloudinary),
 * and reporting the resulting URL back to the parent form. Shows a
 * live preview and surfaces upload failures instead of failing silently.
 */
export default function ImageUploadField({
  imageUrl,
  onChange,
  onUploadingChange,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setLocalPreview(URL.createObjectURL(file));
    setUploading(true);
    onUploadingChange?.(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.imageUrl) {
        throw new Error(data.error || "Upload failed. Please try again.");
      }

      onChange(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setLocalPreview(null);
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  };

  const displaySrc = localPreview || imageUrl;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {displaySrc ? (
        <div className="relative group rounded-xl overflow-hidden border border-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displaySrc}
            alt="Preview"
            className="w-full h-56 object-cover"
          />

          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-2 text-sm text-white">
              <Loader2 size={16} className="animate-spin" />
              Uploading…
            </div>
          )}

          {!uploading && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setLocalPreview(null);
                }}
                className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center"
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-56 rounded-xl border-2 border-dashed border-zinc-800 hover:border-[#D4AF37]/50 hover:bg-zinc-900/50 flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ImagePlus size={26} />
          <span className="text-sm">Click to upload an image</span>
        </button>
      )}

      {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
    </div>
  );
}
