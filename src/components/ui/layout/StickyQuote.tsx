"use client";

import Link from "next/link";

export default function StickyQuote() {
  return (
    <div className="fixed left-4 sm:left-6 bottom-4 sm:bottom-6 z-50">
      <Link
        href="/quote"
        className="inline-block bg-[#D4AF37] text-black px-5 py-3 sm:px-6 sm:py-4 rounded-full font-semibold text-sm sm:text-base shadow-xl hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all duration-300"
      >
        Get Quote
      </Link>
    </div>
  );
}
