"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden hero-grid py-14 sm:py-20 lg:min-h-screen lg:flex lg:items-center lg:py-0">

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] md:w-[700px] md:h-[700px] bg-[#D4AF37]/10 blur-[100px] md:blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">

        {/* LEFT CONTENT */}

        <div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-5 sm:mb-6"
          >
            <span className="text-[#D4AF37] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-xs sm:text-sm">
              Premium Manufacturing Partner
            </span>

            <div className="hidden sm:block h-px w-20 bg-[#D4AF37]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[2.5rem] leading-[1.1] sm:text-6xl md:text-7xl font-bold sm:leading-[1.05]"
          >
            Premium
            <br />

            <span className="text-[#D4AF37]">
              Embroidery
            </span>

            <br />
            Digitizing &
            <br />
            Manufacturing
          </motion.h1>

          <p className="text-zinc-400 text-base sm:text-lg mt-6 sm:mt-8 max-w-xl leading-relaxed">
            Custom patches, embroidery digitizing,
            sportswear manufacturing, private label apparel
            production, and premium merchandise solutions
            for brands worldwide.
          </p>

          {/* CTA Buttons */}

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8 sm:mt-10">

            <Link
              href="/quote"
              className="bg-[#D4AF37] text-black px-8 py-4 rounded-full font-semibold text-center hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all"
            >
              Get Quote →
            </Link>

            <Link
              href="/Portfolio"
              className="border border-[#D4AF37] text-white px-8 py-4 rounded-full text-center hover:bg-[#D4AF37] hover:text-black transition-all"
            >
              View Portfolio
            </Link>

          </div>

        </div>

        {/* RIGHT IMAGE */}

        <div className="relative">

          {/* Glow Behind Image */}

          <div className="absolute inset-0 bg-[#D4AF37]/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

          <div
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-[0_0_50px_rgba(212,175,55,0.15)]"
          >

            <Image
              src="/images/pricing/manufacturing.png"
              alt="Luxury Embroidery Manufacturing"
              width={900}
              height={1000}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full h-auto object-cover"
            />
            {/* Overlay */}

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          </div>

          {/* Floating Card */}

          <div
            className="absolute bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 bg-black/70 backdrop-blur-xl border border-[#D4AF37]/20 p-4 sm:p-6 rounded-xl sm:rounded-2xl max-w-[calc(100%-2rem)] sm:max-w-xs"
          >

            <h4 className="text-[#D4AF37] text-base sm:text-xl font-semibold">
              Custom T-Shirts & Jerseys
            </h4>

            <p className="text-zinc-400 text-xs sm:text-sm mt-1 sm:mt-2">
              Jerseys • Sportswear • Teamwear • Caps
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}
