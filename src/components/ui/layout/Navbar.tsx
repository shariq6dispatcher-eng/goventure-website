"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      id="navbar"
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/40 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-wider"
        >
          <span className="text-[#D4AF37]">GO</span>VENTURE
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8 text-sm uppercase tracking-wide">

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

        {/* Desktop Button */}
        <Link
          href="/quote"
          className="hidden lg:block bg-[#D4AF37] text-black px-5 py-2 rounded-full font-semibold hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all duration-300"
        >
          Get Quote
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ${
          open ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="bg-black/95 backdrop-blur-xl border-t border-white/10 px-6 py-6 flex flex-col gap-5 uppercase text-sm tracking-wide">

          <Link href="/" onClick={() => setOpen(false)}>
            Home
          </Link>

          <Link href="/Services" onClick={() => setOpen(false)}>
            Services
          </Link>

          <Link href="/Portfolio" onClick={() => setOpen(false)}>
            Portfolio
          </Link>

          <Link href="/about" onClick={() => setOpen(false)}>
            About
          </Link>

          <Link href="/blog" onClick={() => setOpen(false)}>
            Blog
          </Link>

          <Link href="/Contact" onClick={() => setOpen(false)}>
            Contact
          </Link>

          <Link href="/shop" onClick={() => setOpen(false)}>
            Shop
          </Link>

          <Link
            href="/quote"
            onClick={() => setOpen(false)}
            className="mt-4 bg-[#D4AF37] text-black rounded-full py-3 text-center font-semibold"
          >
            Get Quote
          </Link>

        </div>
      </div>
    </header>
  );
}
