"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import ImageUploadField from "./ImageUploadField";

export interface PortfolioItem {
  _id: string;
  title: string;
  category: string;
  image: string;
}

const CATEGORIES = ["Digitizing", "Patches", "Jerseys", "Sportswear"];

interface PortfolioModalProps {
  open: boolean;
  item: PortfolioItem | null;
  saving: boolean;
  onClose: () => void;
  onSave: (values: { title: string; category: string; image: string }) => void;
}

export default function PortfolioModal({
  open,
  item,
  saving,
  onClose,
  onSave,
}: PortfolioModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(item?.title || "");
      setCategory(item?.category || CATEGORIES[0]);
      setImage(item?.image || "");
      setUploading(false);
    }
  }, [open, item]);

  if (!open) return null;

  const isValid = title.trim() && category.trim() && image.trim() && !uploading;

  return (
    <div
      className="fixed inset-0 z-[9996] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 p-6 my-10"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">
            {item ? "Edit Portfolio Item" : "Upload Portfolio Item"}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <ImageUploadField
            imageUrl={image}
            onChange={setImage}
            onUploadingChange={setUploading}
          />

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Custom Varsity Jacket Patch"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37] outline-none p-3.5 rounded-xl text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37] outline-none p-3.5 rounded-xl text-sm transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-7">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:bg-zinc-900 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSave({ title: title.trim(), category, image: image.trim() })
            }
            disabled={!isValid || saving}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#D4AF37] text-black hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : item ? "Save Changes" : "Add to Portfolio"}
          </button>
        </div>
      </div>
    </div>
  );
}
