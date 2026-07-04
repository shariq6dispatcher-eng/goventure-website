"use client";

import { Sparkle } from "lucide-react";

const items = [
  "Embroidery Digitizing",
  "Custom Patches",
  "Jersey Manufacturing",
  "Private Label Apparel",
  "Sportswear Production",
  "Vector Conversion",
  "Premium Merchandise",
  "Worldwide Shipping",
];

function Row({ reverse = false }: { reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div
      className={`flex w-max group-hover:[animation-play-state:paused] ${
        reverse ? "animate-marquee-reverse" : "animate-marquee"
      }`}
    >
      {doubled.map((item, i) => (
        <div
          key={`${item}-${i}`}
          className="flex items-center gap-3 px-6 sm:px-10 shrink-0"
        >
          <Sparkle className="w-4 h-4 text-[#D4AF37] transition-transform duration-500 group-hover:rotate-180" />
          <span className="text-zinc-400 hover:text-[#D4AF37] hover:scale-110 transition-all duration-300 inline-block text-sm sm:text-base uppercase tracking-[0.15em] whitespace-nowrap">
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function TrustMarquee() {
  return (
    <section className="relative py-6 sm:py-8 border-y border-zinc-900 bg-zinc-950/60 overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-black to-transparent z-10" />

      <div className="group">
        <Row />
      </div>
    </section>
  );
}
