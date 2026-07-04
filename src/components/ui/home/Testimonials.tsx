"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import TiltCard from "@/components/ui/common/TiltCard";
import { staggerContainer, fadeUp } from "@/lib/motion";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Michael Anderson",
      company: "USA Apparel Brand",
      review:
        "Outstanding digitizing quality and extremely fast turnaround. GoVenture has become our preferred production partner.",
    },
    {
      name: "James Walker",
      company: "Sportswear Company",
      review:
        "Professional communication, excellent patch quality and reliable delivery schedules.",
    },
    {
      name: "Sarah Mitchell",
      company: "Promotional Products",
      review:
        "The embroidery files stitched perfectly. We saved both time and production costs.",
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
              Testimonials
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-bold"
            >
              What Our Clients Say
            </motion.h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer(0.15)}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-20"
            style={{ perspective: 1200 }}
          >
            {testimonials.map((item) => (
              <TiltCard
                key={item.name}
                variants={fadeUp}
                tilt={5}
                className="group relative overflow-hidden bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] transition-colors duration-300"
              >
                <Quote className="absolute -top-2 -right-2 w-20 h-20 text-[#D4AF37]/[0.06] rotate-12 pointer-events-none" />

                <div className="flex gap-1 text-[#D4AF37] mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -90 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.35 }}
                    >
                      <Star className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                    </motion.span>
                  ))}
                </div>

                <p className="text-zinc-400 leading-relaxed relative">
                  {item.review}
                </p>

                <div className="mt-8">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-zinc-500 text-sm">{item.company}</p>
                </div>
              </TiltCard>
            ))}
          </motion.div>
        </div>
      </section>
    </AnimatedSection>
  );
}
