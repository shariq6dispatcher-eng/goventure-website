"use client";

import { motion } from "framer-motion";
import {
  Globe,
  PackageCheck,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import TiltCard from "@/components/ui/common/TiltCard";
import { staggerContainer, popIn } from "@/lib/motion";

export default function TrustSection() {
  const features = [
    {
      icon: Globe,
      title: "Worldwide Service",
      desc: "Serving embroidery shops, brands and businesses globally.",
    },
    {
      icon: PackageCheck,
      title: "Manufacturing Capability",
      desc: "From one sample to bulk production runs.",
    },
    {
      icon: Clock3,
      title: "Fast Turnaround",
      desc: "Quick digitizing and efficient production timelines.",
    },
    {
      icon: ShieldCheck,
      title: "Quality Assurance",
      desc: "Every project passes strict quality control checks.",
    },
  ];

  return (
    <AnimatedSection>
      <section className="py-20 sm:py-28 lg:py-32 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#D4AF37] uppercase tracking-[3px] sm:tracking-[4px] text-xs sm:text-sm mb-4"
            >
              Why Brands Trust Us
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl font-bold"
            >
              Built For Quality,
              Speed & Scale
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 mt-4 sm:mt-6 max-w-3xl mx-auto text-sm sm:text-base"
            >
              GoVenture provides embroidery digitizing,
              custom patches and apparel manufacturing
              solutions trusted by clients worldwide.
            </motion.p>
          </div>

          {/* Features */}

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer(0.12)}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-14 sm:mt-20"
            style={{ perspective: 1200 }}
          >
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <TiltCard
                  key={feature.title}
                  variants={popIn}
                  tilt={7}
                  className="group relative overflow-hidden bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] transition-colors duration-300"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex"
                  >
                    <Icon className="w-9 h-9 sm:w-10 sm:h-10 text-[#D4AF37] mb-5 sm:mb-6" />
                  </motion.div>

                  <h3 className="text-lg sm:text-xl font-semibold">
                    {feature.title}
                  </h3>

                  <p className="text-zinc-400 mt-3 sm:mt-4 text-sm sm:text-base">
                    {feature.desc}
                  </p>

                  <span className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent group-hover:w-full transition-[width] duration-500" />
                </TiltCard>
              );
            })}
          </motion.div>
        </div>
      </section>
    </AnimatedSection>
  );
}
