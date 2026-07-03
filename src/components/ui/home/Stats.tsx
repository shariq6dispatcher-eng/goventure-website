"use client";

import { motion } from "framer-motion";
import { Award, PackageCheck, Globe2, ThumbsUp } from "lucide-react";
import AnimatedCounter from "@/components/ui/home/AnimatedCounter";

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

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 relative">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">

          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group flex flex-col items-center"
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#D4AF37]/70 mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:text-[#D4AF37]" />

                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#D4AF37]">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </h3>

                <p className="text-zinc-400 mt-2 sm:mt-3 text-sm sm:text-base">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
