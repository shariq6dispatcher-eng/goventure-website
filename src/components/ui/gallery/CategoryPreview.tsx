"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CategoryPreview({
  categories,
}: {
  categories: { category: string; image: string }[];
}) {
  const router = useRouter();
  const slugify = (text: string) =>
  text.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
      {categories.map((cat) => (
        <div
          key={cat.category}
          onClick={() => router.push(`/Portfolio/${slugify(cat.category)}`)}
          className="relative aspect-square cursor-pointer overflow-hidden rounded-lg group"
        >
          <Image
    src={cat.image || "/placeholder.jpg"}
    alt={cat.category}
    fill
    className="object-cover group-hover:scale-110 transition"
/>
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h2 className="text-white font-bold uppercase tracking-widest">
              {cat.category}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
}