"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ImageOff } from "lucide-react";

interface Category {
  category: string;
  image: string;
  count?: number;
}

const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/\s+/g, "-");

function CategoryCard({ cat, index }: { cat: Category; index: number }) {
  const router = useRouter();
  const [errored, setErrored] = useState(false);

  return (
    <button
      type="button"
      onClick={() => router.push(`/Portfolio/${slugify(cat.category)}`)}
      style={{ animationDelay: `${index * 70}ms` }}
      className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both group relative aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-[#D4AF37]/60 hover:shadow-[0_0_45px_rgba(212,175,55,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
    >
      {!errored ? (
        <Image
          src={cat.image}
          alt={cat.category}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={() => setErrored(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-900 text-zinc-600">
          <ImageOff size={26} strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-widest">
            Image unavailable
          </span>
        </div>
      )}

      {/* legibility gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/5 transition-colors duration-500 group-hover:from-black/95" />

      {/* gold sheen sweep */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -inset-y-10 left-0 w-1/3 -translate-x-[200%] rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[420%]" />
      </div>

      {/* top-corner glow accent */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-[#D4AF37]/0 blur-2xl transition-all duration-500 group-hover:bg-[#D4AF37]/25" />

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <div className="mb-2 h-[2px] w-8 bg-[#D4AF37] transition-all duration-500 group-hover:w-14" />
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold uppercase tracking-widest text-white sm:text-base">
              {cat.category}
            </h2>
            {typeof cat.count === "number" && (
              <p className="mt-1 text-[11px] uppercase tracking-wider text-zinc-400">
                {cat.count} {cat.count === 1 ? "Project" : "Projects"}
              </p>
            )}
          </div>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-all duration-300 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black">
            <ArrowUpRight size={15} />
          </span>
        </div>
      </div>
    </button>
  );
}

export default function CategoryPreview({
  categories,
}: {
  categories: Category[];
}) {
  if (!categories.length) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <p className="text-zinc-500">
          No portfolio categories yet. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat, i) => (
          <CategoryCard key={cat.category} cat={cat} index={i} />
        ))}
      </div>
    </section>
  );
}
