"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-grid">

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#D4AF37]/10 blur-[180px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* LEFT CONTENT */}

        <div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <span className="text-[#D4AF37] uppercase tracking-[0.35em] text-sm">
              Premium Manufacturing Partner
            </span>

            <div className="h-px w-20 bg-[#D4AF37]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-5xl md:text-7xl font-bold leading-[1.05]"
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

          <p className="text-zinc-400 text-lg mt-8 max-w-xl leading-relaxed">
            Custom patches, embroidery digitizing,
            sportswear manufacturing, private label apparel
            production, and premium merchandise solutions
            for brands worldwide.
          </p>

          {/* CTA Buttons */}

          <div className="flex flex-wrap gap-4 mt-10">

            <button
              className="bg-[#D4AF37] text-black px-8 py-4 rounded-full font-semibold hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all"
            >
<<<<<<< HEAD
             <Link href="/quote" className="hover:text-[#D4AF37] transition"> Get Quote → </Link>
=======
            Get Quote →
>>>>>>> c793eac1b7c99797abfcc5d70074259a10c67a2b
            </button>

            <button
              className="border border-[#D4AF37] text-white px-8 py-4 rounded-full hover:bg-[#D4AF37] hover:text-black transition-all"
            >
              View Portfolio
            </button>

          </div>

          {/* Stats */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">

            <div>
              <h3 className="text-4xl font-bold text-[#D4AF37]">
                10+
              </h3>
              <p className="text-zinc-500">
                Years Experience
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-[#D4AF37]">
                5000+
              </h3>
              <p className="text-zinc-500">
                Orders Completed
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-[#D4AF37]">
                50+
              </h3>
              <p className="text-zinc-500">
                Countries Served
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-[#D4AF37]">
                99%
              </h3>
              <p className="text-zinc-500">
                Satisfaction
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT IMAGE */}

        <div className="relative">

          {/* Glow Behind Image */}

          <div className="absolute inset-0 bg-[#D4AF37]/10 blur-[120px] rounded-full" />

          <div
            className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/40  shadow-[0_0_50px_rgba(212,175,55,0.15)]"
          >

            <Image
  src="/images/pricing/manufacturing.png"
  alt="Luxury Embroidery Manufacturing"
  width={900}
  height={1000}
  priority
  className="w-full h-auto object-cover"
/>
            {/* Overlay */}

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          </div>

          {/* Floating Card */}

          <div
            className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-xl border border-[#D4AF37]/20 p-6 rounded-2xl"
          >

            <h4 className="text-[#D4AF37] text-xl font-semibold">
              Custom T-Shirts & Jerseys
            </h4>

            <p className="text-zinc-400 text-sm mt-2">
              Jerseys • Sportswear • Teamwear • Caps
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}
