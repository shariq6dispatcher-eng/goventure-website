"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import { useRef } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

const headingWords = ["Premium", "Embroidery", "Digitizing", "&", "Manufacturing"];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.15,
    },
  },
};

const wordVariant = {
  hidden: { opacity: 0, y: 40, rotateX: -40 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse-tilt on the manufacturing photo card (desktop only).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), {
    stiffness: 120,
    damping: 15,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), {
    stiffness: 120,
    damping: 15,
  });

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    mx.set(0);
    my.set(0);
  }

  // Scroll-driven "flip away" on the whole hero — as the user scrolls down,
  // the hero pins in place, folds backward at the top edge like a page
  // turning, lifts and fades, while the next section rises up over it.
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // Smooth out the raw scroll progress so the flip glides between scroll
  // ticks instead of jumping — this is what makes it feel buttery rather
  // than jittery, especially on mouse-wheel/trackpad scrolling.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    mass: 0.6,
    restDelta: 0.001,
  });

  const heroRotateX = useTransform(smoothProgress, [0, 1], [0, -65]);
  const heroY = useTransform(smoothProgress, [0, 1], [0, -140]);
  const heroScale = useTransform(smoothProgress, [0, 1], [1, 0.88]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.6, 1], [1, 0.9, 0]);
  const heroBrightness = useTransform(smoothProgress, [0, 1], [1, 0.5]);
  const heroFilter = useMotionTemplate`brightness(${heroBrightness})`;

  return (
    <div ref={wrapRef} className="relative" style={{ perspective: 1400 }}>
      <motion.section
        style={{
          rotateX: heroRotateX,
          y: heroY,
          scale: heroScale,
          opacity: heroOpacity,
          filter: heroFilter,
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
          willChange: "transform, opacity, filter",
        }}
        className="sticky top-0 relative overflow-hidden hero-grid py-14 sm:py-20 lg:min-h-screen lg:flex lg:items-center lg:py-0 bg-black"
      >

      <div className="absolute top-0 right-0 w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] md:w-[700px] md:h-[700px] bg-[#D4AF37]/10 blur-[100px] md:blur-[180px] rounded-full pointer-events-none animate-drift" />
      <div className="absolute bottom-0 left-0 w-[220px] h-[220px] sm:w-[380px] sm:h-[380px] bg-[#D4AF37]/5 blur-[100px] md:blur-[140px] rounded-full pointer-events-none animate-drift [animation-delay:3s]" />

      <div className="absolute inset-0 pointer-events-none hidden sm:block" aria-hidden="true">
        <span className="absolute top-[18%] left-[8%] w-1.5 h-1.5 rounded-full bg-[#D4AF37]/70 animate-float-slow" />
        <span className="absolute top-[65%] left-[14%] w-1 h-1 rounded-full bg-[#D4AF37]/50 animate-float-slower" />
        <span className="absolute top-[30%] left-[45%] w-1 h-1 rounded-full bg-[#D4AF37]/40 animate-float-slow [animation-delay:1.2s]" />
        <span className="absolute top-[12%] left-[55%] w-2 h-2 rounded-full bg-[#D4AF37]/30 animate-float-slower [animation-delay:2s]" />
        <span className="absolute top-[80%] left-[38%] w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50 animate-float-slow [animation-delay:0.6s]" />
        <Sparkles className="absolute top-[22%] left-[36%] w-4 h-4 text-[#D4AF37]/40 animate-sparkle" />
        <Sparkles className="absolute top-[70%] left-[52%] w-3 h-3 text-[#D4AF37]/30 animate-sparkle [animation-delay:1.3s]" />
      </div>

      <div className="absolute inset-0 noise-overlay pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">

        <div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative inline-flex items-center gap-4 mb-5 sm:mb-6"
          >
            <span className="relative flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-4 py-1.5 shine-wrap">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AF37] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D4AF37]" />
              </span>
              <span className="text-[#D4AF37] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-xs whitespace-nowrap">
                Premium Manufacturing Partner
              </span>
            </span>

            <div className="hidden sm:block h-px w-20 bg-gradient-to-r from-[#D4AF37] to-transparent" />
          </motion.div>

          <motion.h1
            variants={container}
            initial="hidden"
            animate="show"
            style={{ perspective: 800 }}
            className="text-[2.5rem] leading-[1.1] sm:text-6xl md:text-7xl font-bold sm:leading-[1.05]"
          >
            <span className="block">
              <motion.span variants={wordVariant} className="inline-block">
                {headingWords[0]}
              </motion.span>
            </span>
            <span className="block">
              <motion.span
                variants={wordVariant}
                className="inline-block text-gradient-gold"
              >
                {headingWords[1]}
              </motion.span>
            </span>
            <span className="block">
              <motion.span variants={wordVariant} className="inline-block">
                {headingWords[2]}
              </motion.span>{" "}
              <motion.span variants={wordVariant} className="inline-block">
                {headingWords[3]}
              </motion.span>
            </span>
            <span className="block">
              <motion.span variants={wordVariant} className="inline-block">
                {headingWords[4]}
              </motion.span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-zinc-400 text-base sm:text-lg mt-6 sm:mt-8 max-w-xl leading-relaxed"
          >
            Custom patches, embroidery digitizing,
            sportswear manufacturing, private label apparel
            production, and premium merchandise solutions
            for brands worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.05 }}
            className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8 sm:mt-10"
          >

            <Link
              href="/quote"
              className="group relative overflow-hidden bg-[#D4AF37] text-black px-8 py-4 rounded-full font-semibold text-center hover:scale-105 hover:shadow-[0_0_35px_rgba(212,175,55,0.45)] transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <span className="relative z-10">Get Quote</span>
              <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/30 skew-x-[-20deg] transition-transform duration-700 group-hover:translate-x-full" />
            </Link>

            <Link
              href="/Portfolio"
              className="border border-[#D4AF37] text-white px-8 py-4 rounded-full text-center hover:bg-[#D4AF37] hover:text-black transition-all duration-300 hover:scale-105"
            >
              View Portfolio
            </Link>

          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="flex items-center gap-6 sm:gap-8 mt-10 sm:mt-14 flex-wrap"
          >
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">15+</p>
              <p className="text-zinc-500 text-xs sm:text-sm">Years Experience</p>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">20K+</p>
              <p className="text-zinc-500 text-xs sm:text-sm">Orders Completed</p>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">50+</p>
              <p className="text-zinc-500 text-xs sm:text-sm">Countries Served</p>
            </div>
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
          style={{ perspective: 1000 }}
        >

          <div className="absolute inset-0 bg-[#D4AF37]/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none animate-drift [animation-delay:1.5s]" />

          <div className="absolute -inset-4 sm:-inset-6 rounded-2xl sm:rounded-3xl border border-dashed border-[#D4AF37]/20 pointer-events-none hidden md:block animate-spin-slow" />

          <motion.div
            ref={cardRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-[0_0_50px_rgba(212,175,55,0.15)]"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
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

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="absolute bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 bg-black/70 backdrop-blur-xl border border-[#D4AF37]/20 p-4 sm:p-6 rounded-xl sm:rounded-2xl max-w-[calc(100%-2rem)] sm:max-w-xs animate-float-slow"
          >

            <h4 className="text-[#D4AF37] text-base sm:text-xl font-semibold">
              Custom T-Shirts & Jerseys
            </h4>

            <p className="text-zinc-400 text-xs sm:text-sm mt-1 sm:mt-2">
              Jerseys • Sportswear • Teamwear • Caps
            </p>

          </motion.div>

        </motion.div>

      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-zinc-500"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="h-9 w-5 rounded-full border border-zinc-700 flex justify-center pt-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-bounce-y" />
        </div>
      </motion.div>

      </motion.section>

      {/* Scroll runway: gives the pinned hero room to flip/wrap away before
          the next section rises up over it. */}
      <div className="h-[55vh] sm:h-[70vh] lg:h-[85vh]" aria-hidden="true" />
    </div>
  );
}
