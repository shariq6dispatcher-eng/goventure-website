"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
}

export default function ProductCard({
  id,
  title,
  category,
  price,
  image,
}: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="
      group
      bg-zinc-950
      border
      border-zinc-800
      rounded-3xl
      overflow-hidden
      transition-all
      duration-500
      hover:border-[#D4AF37]
      hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]
    "
    >
      <div className="relative h-72 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="
            object-cover
            transition-transform
            duration-700
            group-hover:scale-110
          "
        />

        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="p-6">
        <span className="text-[#D4AF37] text-sm">
          {category}
        </span>

        <h3 className="text-2xl font-bold mt-2 mb-3">
          {title}
        </h3>

        <p className="text-zinc-400 mb-6">
          Starting From {price}
        </p>

        <Link
          href={`/shop/${id}`}
          className="
            inline-block
            bg-[#D4AF37]
            text-black
            px-6
            py-3
            rounded-full
            font-semibold
          "
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}