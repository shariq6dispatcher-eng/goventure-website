"use client";

import Link from "next/link";
import {
  Instagram,
  Facebook,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800 text-zinc-400">

      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Company */}
          <div>
            <Link href="/" className="text-3xl font-bold tracking-wider">
              <span className="text-[#D4AF37]">GO</span>
              <span className="text-white">VENTURE</span>
            </Link>

            <p className="mt-5 leading-7 text-zinc-500">
              Premium embroidery digitizing, custom patches, sportswear,
              uniforms, and apparel manufacturing trusted by businesses
              worldwide.
            </p>

            <div className="flex gap-4 mt-6">

              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition"
              >
                <Instagram size={20} />
              </a>

              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition"
              >
                <Facebook size={20} />
              </a>

              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition"
              >
                <Linkedin size={20} />
              </a>

            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-5">
              Services
            </h3>

            <ul className="space-y-3">

              <li>
                <Link
                  href="/services"
                  className="hover:text-[#D4AF37] transition"
                >
                  Embroidery Digitizing
                </Link>
              </li>

              <li>
                <Link
                  href="/services"
                  className="hover:text-[#D4AF37] transition"
                >
                  Custom Patches
                </Link>
              </li>

              <li>
                <Link
                  href="/services"
                  className="hover:text-[#D4AF37] transition"
                >
                  Sportswear Manufacturing
                </Link>
              </li>

              <li>
                <Link
                  href="/services"
                  className="hover:text-[#D4AF37] transition"
                >
                  Custom Apparel
                </Link>
              </li>

            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3">

              <li>
                <Link href="/" className="hover:text-[#D4AF37] transition">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/about" className="hover:text-[#D4AF37] transition">
                  About Us
                </Link>
              </li>

              <li>
                <Link href="/portfolio" className="hover:text-[#D4AF37] transition">
                  Portfolio
                </Link>
              </li>

              <li>
                <Link href="/blog" className="hover:text-[#D4AF37] transition">
                  Blog
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-[#D4AF37] transition">
                  Contact
                </Link>
              </li>

              <li>
                <Link href="/quote" className="hover:text-[#D4AF37] transition">
                  Get a Quote
                </Link>
              </li>

            </ul>
          </div>

          {/* Contact */}
          <div>

            <h3 className="text-white text-lg font-semibold mb-5">
              Contact
            </h3>

            <div className="space-y-4">

              <a
                href="mailto:embroidery@goventuresdispatch.com"
                className="flex items-center gap-3 hover:text-[#D4AF37] transition"
              >
                <Mail size={18} />
                embroidery@goventuresdispatch.com
              </a>

              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-[#D4AF37] transition"
              >
                <Phone size={18} />
                WhatsApp Support
              </a>

              <p>
                🌍 Worldwide Service
              </p>

              <Link
                href="/contact"
                className="inline-block mt-4 bg-[#D4AF37] text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition duration-300"
              >
                Contact Us
              </Link>

            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">

          <p>
            © {new Date().getFullYear()} GoVenture Embroidery & Manufacturing.
            All Rights Reserved.
          </p>

          <div className="flex gap-6">

            <Link
              href="/privacy-policy"
              className="hover:text-[#D4AF37] transition"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="hover:text-[#D4AF37] transition"
            >
              Terms & Conditions
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}
