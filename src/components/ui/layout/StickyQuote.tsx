"use client";

export default function StickyQuote() {
  return (
    <div className="fixed left-6 bottom-6 z-50">
      <button className="bg-[#D4AF37] text-black px-6 py-4 rounded-full font-semibold shadow-xl hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all duration-300">
        Get Quote
      </button>
    </div>
  );
}