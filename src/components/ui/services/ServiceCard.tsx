"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
}

export default function ServiceCard({
  title,
  description,
  image,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -12 }}
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-zinc-800
        bg-zinc-950
        cursor-pointer
        transition-all
        duration-500
        hover:border-[#D4AF37]
        hover:shadow-[0_0_50px_rgba(212,175,55,0.18)]
      "
    >
      {/* IMAGE */}

      <div className="relative h-[280px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="33vw"
          className="
            object-cover
            transition-transform
            duration-700
            group-hover:scale-110
          "
        />

        {/* DARK OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black
            via-black/40
            to-transparent
          "
        />

        {/* GOLD OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-[#D4AF37]/0
            transition-all
            duration-500
            group-hover:bg-[#D4AF37]/10
          "
        />
      </div>

      {/* CONTENT */}

      <div className="p-8">
        <h3
          className="
            text-2xl
            font-bold
            mb-4
            transition-colors
            duration-300
            group-hover:text-[#D4AF37]
          "
        >
          {title}
        </h3>

        <p className="text-zinc-400 leading-relaxed">
          {description}
        </p>

        {/* BUTTON */}

        <div className="mt-6">
          <span
            className="
              inline-flex
              items-center
              text-[#D4AF37]
              font-medium
              transition-all
              duration-300
              group-hover:translate-x-2
            "
          >
            Learn More →
          </span>
        </div>
      </div>
    </motion.div>
  );
}