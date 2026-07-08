"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2, X } from "lucide-react";

const SERVICE_CATEGORIES = [
  "Embroidery Digitizing",
  "Vector Art",
  "Custom Patches",
  "T-Shirts",
  "Hats",
  "Other",
] as const;

const FILE_FORMATS = ["DST", "PES", "EMB", "AI", "EPS", "PDF", "PNG", "CDR", "Other"] as const;

export default function PlaceOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designPreview, setDesignPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    category: "Embroidery Digitizing" as (typeof SERVICE_CATEGORIES)[number],
    size: "",
    needDate: "",
    urgent: false,
    notes: "",
  });
  const [formats, setFormats] = useState<string[]>([]);

  const toggleFormat = (fmt: string) => {
    setFormats((prev) =>
      prev.includes(fmt) ? prev.filter((f) => f !== fmt) : [...prev, fmt]
    );
  };

  const handleFile = (file: File) => {
    setDesignFile(file);
    setDesignPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!formData.customerName.trim() || !formData.customerEmail.trim()) {
      setError("Name and email are required.");
      return;
    }

    try {
      setLoading(true);

      let designImageUrl = "";
      if (designFile) {
        setUploading(true);
        const uploadForm = new FormData();
        uploadForm.append("file", designFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });
        const uploadData = await uploadRes.json();
        designImageUrl = uploadData.imageUrl || "";
        setUploading(false);
      }

      const res = await fetch("/api/online-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          designImageUrl,
          formats,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit your order");
      }

      router.push(`/order-status/${data.requestNo}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <main className="bg-black text-white min-h-screen">
      <section className="py-24 border-b border-zinc-900">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[#D4AF37] uppercase tracking-[4px] mb-4">
            GoVenture Manufacturing
          </p>
          <h1 className="text-6xl font-bold mb-6">Place An Order</h1>
          <p className="text-zinc-400 text-lg max-w-3xl mx-auto">
            Upload your design, tell us what you need, and we&apos;ll send you a
            rate to approve before any work begins.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <form
            onSubmit={handleSubmit}
            className="bg-zinc-950 border border-zinc-800 rounded-3xl p-10"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                className="bg-zinc-900 p-4 rounded-xl"
                required
              />

              <input
                type="email"
                placeholder="Email Address"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, customerEmail: e.target.value })
                }
                className="bg-zinc-900 p-4 rounded-xl"
                required
              />

              <input
                type="text"
                placeholder="Phone / WhatsApp"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
                className="bg-zinc-900 p-4 rounded-xl"
              />

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as typeof formData.category,
                  })
                }
                className="bg-zinc-900 p-4 rounded-xl"
              >
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Size (e.g. 4x4 in, Left Chest, 10cm)"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
                className="bg-zinc-900 p-4 rounded-xl"
              />

              <input
                type="date"
                value={formData.needDate}
                onChange={(e) =>
                  setFormData({ ...formData, needDate: e.target.value })
                }
                className="bg-zinc-900 p-4 rounded-xl text-zinc-300"
              />
            </div>

            {/* Design upload */}
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
                Design Image
              </p>
              <input
                id="design-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                  e.target.value = "";
                }}
              />
              {designPreview ? (
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={designPreview}
                    alt="Design preview"
                    className="h-40 w-40 object-cover rounded-xl border border-zinc-800"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setDesignFile(null);
                      setDesignPreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-black border border-zinc-700 rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="design-upload"
                  className="flex flex-col items-center justify-center gap-2 border border-dashed border-zinc-700 rounded-xl p-8 cursor-pointer hover:border-[#D4AF37]/60 transition text-zinc-500"
                >
                  <UploadCloud size={22} />
                  <span className="text-xs">Click to upload your design (optional)</span>
                </label>
              )}
            </div>

            {/* Recommended file formats */}
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
                Recommended File Formats Needed
              </p>
              <div className="flex flex-wrap gap-2">
                {FILE_FORMATS.map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => toggleFormat(fmt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      formats.includes(fmt)
                        ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Urgent */}
            <label className="mt-6 flex items-center gap-3 bg-zinc-900 rounded-xl p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.urgent}
                onChange={(e) =>
                  setFormData({ ...formData, urgent: e.target.checked })
                }
                className="w-4 h-4 accent-[#D4AF37]"
              />
              <span className="text-sm">
                <span className="font-semibold text-[#D4AF37]">Urgent</span>{" "}
                — I need this by today
              </span>
            </label>

            <textarea
              placeholder="Anything else we should know? (colors, placement, references...)"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="bg-zinc-900 p-4 rounded-xl w-full mt-6 min-h-32"
            />

            {error && (
              <p className="text-rose-400 text-sm mt-4 bg-rose-950/30 border border-rose-900/40 rounded-xl p-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full bg-[#D4AF37] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {uploading
                ? "Uploading design..."
                : loading
                ? "Submitting..."
                : "Submit Order Request"}
            </button>

            <p className="text-center text-xs text-zinc-600 mt-4">
              We&apos;ll review your request and send you a rate to approve —
              no payment is required to submit.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
