"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { staggerContainer, popIn } from "@/lib/motion";

export default function Industries() {
  const industries = [
    "Embroidery Shops",
    "Sports Teams",
    "Fashion Brands",
    "Corporate Businesses",
    "E-commerce Stores",
    "Print On Demand Brands",
    "Uniform Suppliers",
    "Promotional Product Companies",
  ];

  return (
    <AnimatedSection>
      <section className="py-20 sm:py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#D4AF37] uppercase tracking-[3px] sm:tracking-[4px] text-xs sm:text-sm mb-4"
            >
              Industries Served
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-bold"
            >
              Trusted Across Industries
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 mt-4 sm:mt-6 max-w-2xl mx-auto text-sm sm:text-base"
            >
              From embroidery businesses to global apparel brands,
              we provide scalable manufacturing solutions.
            </motion.p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer(0.08)}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-20"
          >
            {industries.map((industry) => (
              <motion.div
                key={industry}
                variants={popIn}
                whileHover={{
                  scale: 1.06,
                  rotate: [0, -1.5, 1.5, 0],
                  y: -6,
                }}
                whileTap={{
                  scale: 1.06,
                  rotate: [0, -1.5, 1.5, 0],
                }}
                transition={{ duration: 0.4 }}
                className="border border-zinc-800 bg-zinc-950 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-sm sm:text-base text-center flex items-center justify-center min-h-[88px] sm:min-h-0 hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] transition-colors duration-300 cursor-default"
              >
                {industry}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </AnimatedSection>
  );
}
