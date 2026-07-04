"use client";

import { motion } from "framer-motion";
import {
  PenTool,
  Shield,
  Shirt,
  Package,
  Layers,
  Award,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import TiltCard from "@/components/ui/common/TiltCard";
import { staggerContainer, fadeUp } from "@/lib/motion";

const services = [
  {
    icon: PenTool,
    title: "Embroidery Digitizing",
    description:
      "Professional embroidery digitizing with clean stitch paths, optimized density, and machine-ready files.",
  },
  {
    icon: Shield,
    title: "Custom Patches",
    description:
      "Premium embroidered, woven, PVC and chenille patches manufactured to the highest standards.",
  },
  {
    icon: Shirt,
    title: "Jersey Manufacturing",
    description:
      "Custom sports jerseys and teamwear with full sublimation, embroidery and private labeling.",
  },
  {
    icon: Package,
    title: "Private Label Production",
    description:
      "Complete apparel manufacturing solutions for emerging and established brands.",
  },
  {
    icon: Layers,
    title: "Vector Conversion",
    description:
      "Convert low-quality artwork into scalable vector files ready for printing and production.",
  },
  {
    icon: Award,
    title: "Premium Apparel",
    description:
      "Custom t-shirts, hoodies, hats, gloves and branded merchandise produced globally.",
  },
];

export default function Services() {
  return (
    <AnimatedSection>
      <section
        id="services"
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
              What We Offer
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl font-bold text-white"
            >
              Our Services
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 max-w-2xl mx-auto mt-4 sm:mt-6 text-sm sm:text-base"
            >
              End-to-end embroidery digitizing, custom patch and apparel
              manufacturing solutions built for quality, speed and scale.
            </motion.p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer(0.1)}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            style={{ perspective: 1200 }}
          >
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <TiltCard
                  key={service.title}
                  variants={fadeUp}
                  tilt={6}
                  className="group relative overflow-hidden bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] transition-colors duration-300"
                >
                  <span className="pointer-events-none absolute -right-2 -top-4 text-6xl sm:text-7xl font-bold text-white/[0.03] select-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <motion.div
                    whileHover={{ rotate: -10, scale: 1.12 }}
                    transition={{ type: "spring", stiffness: 260, damping: 12 }}
                    className="inline-flex"
                  >
                    <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-[#D4AF37] mb-5 sm:mb-6" />
                  </motion.div>

                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">
                    {service.title}
                  </h3>

                  <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
                    {service.description}
                  </p>

                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                </TiltCard>
              );
            })}
          </motion.div>
        </div>
      </section>
    </AnimatedSection>
  );
}
