"use client";

import { useState } from "react";
import Image from "next/image";


export default function CategoryGridClient({
  projects,
  categoryName,
}: {
  projects: any[];
  categoryName: string;
}) {
  const [index, setIndex] = useState<number | null>(null);

  const current = index !== null ? projects[index] : null;

  const next = () => {
    setIndex((prev) =>
      prev !== null ? (prev + 1) % projects.length : null
    );
  };

  const prev = () => {
    setIndex((prev) =>
      prev !== null
        ? (prev - 1 + projects.length) % projects.length
        : null
    );
  };

  return (
    <>
      {/* CATEGORY HEADER */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-white">
          {categoryName}
        </h1>

        <div className="w-24 h-[2px] bg-[#D4AF37] mx-auto mt-3" />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {projects.map((p: any, i: number) => (
          <div
            key={p._id}
            onClick={() => setIndex(i)}
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
          >
            <Image
              src={p.image}
              alt=""
              fill
              className="object-cover group-hover:scale-110 transition"
            />
          </div>
        ))}
      </div>

      {/* LIGHTBOX */}
      {current && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          
          {/* CLOSE */}
          <div
            className="absolute inset-0"
            onClick={() => setIndex(null)}
          />

          {/* LEFT */}
          <button
            onClick={prev}
            className="absolute left-4 text-white text-4xl z-50"
          >
            ‹
          </button>

          {/* IMAGE */}
          <div className="relative w-full max-w-5xl h-[80vh]">
            <Image
              src={current.image}
              alt=""
              fill
              className="object-contain"
            />
          </div>

          {/* RIGHT */}
          <button
            onClick={next}
            className="absolute right-4 text-white text-4xl z-50"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}