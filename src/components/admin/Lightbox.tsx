"use client";

import { useEffect } from "react";
import { X, Download } from "lucide-react";

interface LightboxProps {
  src: string | null;
  alt?: string;
  onClose: () => void;
}

export default function Lightbox({ src, alt = "", onClose }: LightboxProps) {
  useEffect(() => {
    if (!src) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "auto";
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[9997] bg-black/95 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <X size={20} />
      </button>

      <a
        href={src}
        download
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Download image"
        className="absolute top-6 right-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <Download size={18} />
      </a>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-[88vh] object-contain rounded-lg border border-white/10 shadow-2xl"
      />
    </div>
  );
}
