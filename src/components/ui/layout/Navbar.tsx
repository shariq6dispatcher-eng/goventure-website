"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header
  id="navbar"
  className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b border-white/10"
>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <Link
          href="/"
          className="text-2xl font-bold tracking-wider"
        >
          <span className="text-[#D4AF37]">GO</span>VENTURE
        </Link>

        <nav className="hidden md:flex gap-8 text-sm uppercase tracking-wide">

  <Link href="/" className="hover:text-[#D4AF37] transition">
    Home
  </Link>

  <Link href="/Services" className="hover:text-[#D4AF37] transition">
    Services
  </Link>

  <Link href="/Portfolio" className="hover:text-[#D4AF37] transition">
    Portfolio
  </Link>

  <Link href="/about" className="hover:text-[#D4AF37] transition">
    About
  </Link>

  <Link href="/blog" className="hover:text-[#D4AF37] transition">
    Blog
  </Link>

  <Link href="/Contact" className="hover:text-[#D4AF37] transition">
    Contact
  </Link>
 <Link href="/shop" className="hover:text-[#D4AF37] transition">
    Shop
  </Link>
</nav>

        <Link
  href="/quote"
  className="bg-[#D4AF37] text-black px-5 py-2 rounded-full font-semibold hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all duration-300"
>
  Get Quote
</Link>

      </div>
    </header>
  );
}