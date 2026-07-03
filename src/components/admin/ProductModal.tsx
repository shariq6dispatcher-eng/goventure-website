"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import ImageUploadField from "./ImageUploadField";

export interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
}

const CATEGORIES = ["Patch", "Digitizing", "Sportswear", "Jersey"];

interface ProductModalProps {
  open: boolean;
  item: Product | null;
  saving: boolean;
  onClose: () => void;
  onSave: (values: {
    title: string;
    description: string;
    category: string;
    price: string;
    image: string;
  }) => void;
}

export default function ProductModal({
  open,
  item,
  saving,
  onClose,
  onSave,
}: ProductModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(item?.title || "");
      setDescription(item?.description || "");
      setCategory(item?.category || CATEGORIES[0]);
      setPrice(item ? String(item.price ?? "") : "");
      setImage(item?.image || "");
      setUploading(false);
    }
  }, [open, item]);

  if (!open) return null;

  const isValid =
    title.trim() && category.trim() && image.trim() && price !== "" && !uploading;

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
            {item ? "Edit Product" : "Add Shop Product"}
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
            <label className="block text-sm text-zinc-400 mb-1.5">
              Product Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Embroidered Varsity Patch"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37] outline-none p-3.5 rounded-xl text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Short description shown on the shop page"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37] outline-none p-3.5 rounded-xl text-sm transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Price (USD)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37] outline-none p-3.5 rounded-xl text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Category
              </label>
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
              onSave({
                title: title.trim(),
                description: description.trim(),
                category,
                price,
                image: image.trim(),
              })
            }
            disabled={!isValid || saving}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#D4AF37] text-black hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : item ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
