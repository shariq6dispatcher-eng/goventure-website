"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface PortfolioItemProps {
  title: string;
  category: string;
  image: string;
  onClick?: () => void;
}

export default function PortfolioItem({
  title,
  category,
  image,
  onClick,
}: PortfolioItemProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-lg cursor-pointer bg-zinc-900"
    >
      <div className="relative aspect-square w-full">
        <Image
          src={image}
          alt={`${title} - ${category} custom embroidery by GoVenture`}
          fill
          sizes="33vw"
          className="object-cover transition-transform duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/10 transition-all duration-500" />

        <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <p className="text-[#D4AF37] text-sm uppercase tracking-[3px]">
            {category}
          </p>

          <h3 className="text-2xl font-bold mt-2">{title}</h3>
        </div>
      </div>
    </motion.div>
  );
}
