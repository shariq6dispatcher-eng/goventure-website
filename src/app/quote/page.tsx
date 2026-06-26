"use client";

import { useState } from "react";

export default function QuotePage() {
  const [loading, setLoading] = useState(false);
const [artworkFile, setArtworkFile] =
  useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "Embroidery Digitizing",
    description: "",
    quantity: "",
    country: "",
    deliveryDate: "",
  });

  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  try {
    setLoading(true);

    let artworkUrl = "";

    // Upload image first
    if (artworkFile) {
      const uploadForm = new FormData();

      uploadForm.append(
        "file",
        artworkFile
      );

      const uploadRes = await fetch(
        "/api/upload",
        {
          method: "POST",
          body: uploadForm,
        }
      );

      const uploadData =
        await uploadRes.json();

      artworkUrl =
        uploadData.imageUrl || "";
    }

    // Save quote
    const res = await fetch(
      "/api/quotes",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          ...formData,
          artwork: artworkUrl,
        }),
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to submit quote"
      );
    }

    alert(
      "Quote Request Submitted Successfully"
    );

    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      service:
        "Embroidery Digitizing",
      description: "",
      quantity: "",
      country: "",
      deliveryDate: "",
    });

    setArtworkFile(null);

  } catch (error) {
    console.error(error);

    alert(
      "Something went wrong"
    );
  } finally {
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

          <h1 className="text-6xl font-bold mb-6">
            Request A Quote
          </h1>

          <p className="text-zinc-400 text-lg max-w-3xl mx-auto">
            Tell us about your project and receive a detailed
            quotation within 24 hours.
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
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="bg-zinc-900 p-4 rounded-xl"
                required
              />

              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="bg-zinc-900 p-4 rounded-xl"
                required
              />

              <input
                type="text"
                placeholder="Phone / WhatsApp"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
                className="bg-zinc-900 p-4 rounded-xl"
              />

              <input
                type="text"
                placeholder="Company Name"
                value={formData.company}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    company: e.target.value,
                  })
                }
                className="bg-zinc-900 p-4 rounded-xl"
              />

            </div>

            <select
              value={formData.service}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  service: e.target.value,
                })
              }
              className="w-full bg-zinc-900 p-4 rounded-xl mt-6"
            >
              <option>Embroidery Digitizing</option>
              <option>Custom Patches</option>
              <option>Sportswear Manufacturing</option>
              <option>Jersey Manufacturing</option>
              <option>Custom Apparel</option>
              <option>Vector Conversion</option>
              <option>Other</option>
            </select>

            <textarea
              placeholder="Describe your project..."
              rows={7}
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="w-full bg-zinc-900 p-4 rounded-xl mt-6"
            />

            <div className="grid md:grid-cols-3 gap-6 mt-6">

              <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: e.target.value,
                  })
                }
                className="bg-zinc-900 p-4 rounded-xl"
              />

              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deliveryDate: e.target.value,
                  })
                }
                className="bg-zinc-900 p-4 rounded-xl"
              />

              <input
                type="text"
                placeholder="Country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    country: e.target.value,
                  })
                }
                className="bg-zinc-900 p-4 rounded-xl"
              />

            </div>

            <div className="mt-6">

              <label className="block mb-3 text-zinc-400">
                Upload Artwork
              </label>

              <div className="mt-6">

  <label className="block mb-3 text-zinc-400">
    Upload Artwork
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setArtworkFile(
        e.target.files?.[0] || null
      )
    }
    className="w-full"
  />

  {artworkFile && (
    <img
      src={URL.createObjectURL(artworkFile)}
      alt="Preview"
      className="
      mt-4
      rounded-xl
      max-h-60
      object-cover
      border
      border-zinc-800
      "
    />
  )}

</div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                mt-10
                bg-[#D4AF37]
                text-black
                px-10
                py-4
                rounded-full
                font-semibold
                hover:scale-105
                transition-all
                disabled:opacity-50
              "
            >
              {loading
                ? "Submitting..."
                : "GET MY QUOTE"}
            </button>

          </form>

        </div>
      </section>

    </main>
  );
}