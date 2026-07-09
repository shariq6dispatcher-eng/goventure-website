"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";

function MagneticLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  function handleMove(e: React.PointerEvent<HTMLAnchorElement>) {
    if (e.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div style={{ x: sx, y: sy }}>
      <Link
        ref={ref}
        href={href}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className={className}
      >
        {children}
      </Link>
    </motion.div>
  );
}

export default function CTA() {
  return (
    <AnimatedSection direction="scale">
      <section className="py-20 sm:py-28 lg:py-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="relative overflow-hidden rounded-[24px] sm:rounded-[40px] border border-[#D4AF37]/20 bg-gradient-to-r from-zinc-950 to-black p-8 sm:p-12 md:p-16 text-center">
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[220px] bg-[#D4AF37]/10 blur-[110px] rounded-full pointer-events-none"
              animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.1, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[#D4AF37] uppercase tracking-[3px] sm:tracking-[4px] text-xs sm:text-sm"
              >
                Ready To Start?
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 sm:mt-6"
              >
                Let&apos;s Build Something Exceptional
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-zinc-400 max-w-2xl mx-auto mt-4 sm:mt-6 text-sm sm:text-base"
              >
                Whether you need embroidery digitizing,
                custom patches or apparel manufacturing,
                our team is ready to help.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row justify-center gap-4 mt-8 sm:mt-10"
              >
                <MagneticLink
                  href="/order"
                  className="bg-[#D4AF37] text-black px-8 py-4 rounded-full font-semibold text-center hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-shadow duration-300 inline-block"
                >
                  Order Now!
                </MagneticLink>

                <MagneticLink
                  href="/Contact"
                  className="border border-white/20 px-8 py-4 rounded-full text-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-300 inline-block"
                >
                  Contact Us
                </MagneticLink>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
