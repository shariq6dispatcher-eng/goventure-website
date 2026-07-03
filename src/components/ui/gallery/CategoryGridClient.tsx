"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, ImageOff, X } from "lucide-react";

interface Project {
  _id: string;
  image: string;
  title?: string;
}

function GridImage({ project }: { project: Project }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-900 text-zinc-600">
        <ImageOff size={24} strokeWidth={1.5} />
        <span className="text-[10px] uppercase tracking-widest">
          Image unavailable
        </span>
      </div>
    );
  }

  return (
    <Image
      src={project.image}
      alt={project.title || "Portfolio project"}
      fill
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      onError={() => setErrored(true)}
    />
  );
}

export default function CategoryGridClient({
  projects,
  categoryName,
}: {
  projects: Project[];
  categoryName: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const [lightboxErrored, setLightboxErrored] = useState(false);

  const current = index !== null ? projects[index] : null;

  const close = useCallback(() => setIndex(null), []);

  const next = useCallback(() => {
    setLightboxErrored(false);
    setIndex((prev) =>
      prev !== null ? (prev + 1) % projects.length : null
    );
  }, [projects.length]);

  const prev = useCallback(() => {
    setLightboxErrored(false);
    setIndex((prev) =>
      prev !== null ? (prev - 1 + projects.length) % projects.length : null
    );
  }, [projects.length]);

  useEffect(() => {
    if (index === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "auto";
    };
  }, [index, close, next, prev]);

  return (
    <>
      {/* HEADER */}
      <div className="mb-10 text-center">
        <Link
          href="/Portfolio"
          className="mb-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-zinc-500 transition-colors hover:text-[#D4AF37]"
        >
          <ArrowLeft size={14} />
          All Categories
        </Link>
        <h1 className="text-2xl font-bold uppercase tracking-widest text-white sm:text-3xl">
          {categoryName}
        </h1>
        <div className="mx-auto mt-3 h-[2px] w-24 bg-[#D4AF37]" />
        {projects.length > 0 && (
          <p className="mt-3 text-xs uppercase tracking-wider text-zinc-500">
            {projects.length} {projects.length === 1 ? "Project" : "Projects"}
          </p>
        )}
      </div>

      {/* GRID */}
      {projects.length === 0 ? (
        <div className="py-20 text-center text-zinc-500">
          No projects in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {projects.map((p, i) => (
            <div
              key={p._id}
              onClick={() => {
                setLightboxErrored(false);
                setIndex(i);
              }}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/60 hover:shadow-[0_0_35px_rgba(212,175,55,0.2)]"
            >
              <GridImage project={p} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              {p.title && (
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="truncate text-xs font-medium text-white">
                    {p.title}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX */}
      {current && (
        <div
          className="fixed inset-0 z-[9997] flex animate-in fade-in items-center justify-center bg-black/95 p-4 backdrop-blur-sm sm:p-6"
          onClick={close}
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6 sm:top-6"
          >
            <X size={20} />
          </button>

          {index !== null && projects.length > 1 && (
            <span className="absolute top-4 left-4 z-10 rounded-full bg-white/10 px-3 py-1.5 text-xs text-zinc-300 sm:top-6 sm:left-6">
              {index + 1} / {projects.length}
            </span>
          )}

          {projects.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
              className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          <div
            className="relative h-[70vh] w-full max-w-5xl sm:h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {!lightboxErrored ? (
              <Image
                src={current.image}
                alt={current.title || "Portfolio project"}
                fill
                sizes="100vw"
                priority
                className="object-contain"
                onError={() => setLightboxErrored(true)}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-zinc-500">
                <ImageOff size={40} strokeWidth={1.5} />
                <span className="text-sm uppercase tracking-widest">
                  Image unavailable
                </span>
              </div>
            )}
          </div>

          {projects.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
              className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
