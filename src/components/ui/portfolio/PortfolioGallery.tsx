"use client";

import { useMemo, useState } from "react";
import PortfolioItem from "./PortfolioItem";

interface Project {
  _id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
}

export default function PortfolioGallery({
  projects,
}: {
  projects: Project[];
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  return (
    <>
      {/* FILTER BAR */}
      <div className="flex justify-center gap-4 mb-16 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-3 rounded-full transition-all duration-300 ${
              activeCategory === cat
                ? "bg-[#D4AF37] text-black font-semibold"
                : "border border-zinc-700 hover:border-[#D4AF37]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filteredProjects.map((project) => (
          <PortfolioItem
            key={project._id}
            title={project.title}
            category={project.category}
            image={project.image}
            onClick={() => setSelectedImage(project.image)}
          />
        ))}
      </div>

      {/* LIGHTBOX */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            className="max-w-5xl max-h-[85vh] rounded-xl shadow-2xl"
            alt="Portfolio preview"
          />
        </div>
      )}
    </>
  );
}