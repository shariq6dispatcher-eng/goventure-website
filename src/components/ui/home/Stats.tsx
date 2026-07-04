"use client";

import { motion } from "framer-motion";
import { Award, PackageCheck, Globe2, ThumbsUp } from "lucide-react";
import AnimatedCounter from "@/components/ui/home/AnimatedCounter";
import { staggerContainer, popIn } from "@/lib/motion";

const stats = [
  {
    icon: Award,
    value: 15,
    suffix: "+",
    label: "Years Experience",
  },
  {
    icon: PackageCheck,
    value: 20,
    suffix: "K+",
    label: "Orders Completed",
  },
  {
    icon: Globe2,
    value: 50,
    suffix: "+",
    label: "Countries Served",
  },
  {
    icon: ThumbsUp,
    value: 98,
    suffix: "%",
    label: "Client Satisfaction",
  },
];

export default function Stats() {
  return (
    <section className="relative py-14 sm:py-20 lg:py-24 border-y border-zinc-900 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none"
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 relative">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.12)}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                variants={popIn}
                whileHover={{ y: -8, scale: 1.04 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="group relative flex flex-col items-center rounded-2xl px-3 py-6 border border-transparent hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/[0.04]"
              >
                <motion.div
                  whileHover={{ rotate: 12, scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 300, damping: 12 }}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#D4AF37]/70 mb-2 sm:mb-3 group-hover:text-[#D4AF37] transition-colors duration-300" />
                </motion.div>

                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#D4AF37]">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </h3>

                <p className="text-zinc-400 mt-2 sm:mt-3 text-sm sm:text-base">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
