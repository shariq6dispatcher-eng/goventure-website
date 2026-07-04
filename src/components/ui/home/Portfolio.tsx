"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { staggerContainer, revealUp } from "@/lib/motion";

const portfolioItems = [
  {
    title: "Embroidery Digitizing",
    image: "/portfolio/digitizing-1.jpeg",
  },
  {
    title: "Character Embroidery",
    image: "/portfolio/digitizing-2.jpeg",
  },
  {
    title: "Manufacturing",
    image: "/images/Hero.jpg",
  },
  {
    title: "Custom Physical Patches",
    image: "/portfolio/patches.png",
  },
];

export default function Portfolio() {
  return (
    <AnimatedSection>
      <section
        id="portfolio"
        className="py-20 sm:py-28 lg:py-32 bg-black border-t border-zinc-900"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-14 sm:mb-20">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#D4AF37] uppercase tracking-[3px] sm:tracking-[4px] text-xs sm:text-sm mb-4"
            >
              Our Work
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl font-bold text-white"
            >
              Portfolio Showcase
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 max-w-3xl mx-auto mt-4 sm:mt-6 text-sm sm:text-base"
            >
              Explore our premium embroidery digitizing, custom patch
              manufacturing and apparel production projects delivered to clients
              worldwide.
            </motion.p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer(0.15)}
            className="grid sm:grid-cols-2 gap-6 sm:gap-8"
          >
            {portfolioItems.map((item, index) => (
              <motion.div
                key={index}
                variants={revealUp}
                whileHover="hover"
                whileTap="hover"
                initial="rest"
                animate="rest"
                className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 hover:border-[#D4AF37] active:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] transition-colors duration-300"
              >
                <div className="relative h-[280px] sm:h-[360px] md:h-[420px] lg:h-[500px] overflow-hidden">
                  <motion.div
                    variants={{
                      rest: { scale: 1 },
                      hover: { scale: 1.12 },
                    }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </motion.div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <motion.div
                  variants={{
                    rest: { opacity: 0, scale: 0.6, rotate: -20 },
                    hover: { opacity: 1, scale: 1, rotate: 0 },
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-5 right-5 sm:top-8 sm:right-8 bg-[#D4AF37] text-black rounded-full p-2.5"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </motion.div>

                <motion.div
                  variants={{
                    rest: { y: 0 },
                    hover: { y: -6 },
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8"
                >
                  <span className="inline-block text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                    View Project
                  </span>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white">
                    {item.title}
                  </h3>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </AnimatedSection>
  );
}
