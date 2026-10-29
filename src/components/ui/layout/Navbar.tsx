import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Clock, ShieldCheck, ChevronDown } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">
      {/* Top Utility / Trust Bar */}
      <div className="bg-[#0b1b36] text-slate-200 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>+1 (800) 123-4567</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>support@goventure.com</span>
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>4 to 12 Hours Rush Service Available</span>
            </span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>100% Machine-Tested Guarantee</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xl shadow-md shadow-blue-500/20">
            GV
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Go<span className="text-blue-600">Venture</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Embroidery Digitizing & Vector
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-700">
          <Link href="/" className="text-blue-600 hover:text-blue-700 transition-colors">
            Home
          </Link>

          {/* Services Menu */}
          <div className="relative group cursor-pointer py-2">
            <span className="flex items-center gap-1 group-hover:text-blue-600 transition-colors">
              Services <ChevronDown className="w-4 h-4" />
            </span>
            <div className="absolute top-full left-0 hidden group-hover:block w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 text-xs">
              <Link
                href="/services/custom-embroidery-digitizing"
                className="block px-3 py-2.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
              >
                Custom Embroidery Digitizing
              </Link>
              <Link
                href="/services/3d-puff-embroidery"
                className="block px-3 py-2.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
              >
                3D Puff / Foam Digitizing
              </Link>
              <Link
                href="/services/cap-hat-digitizing"
                className="block px-3 py-2.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
              >
                Cap & Hat Digitizing
              </Link>
              <Link
                href="/services/vector-art-conversion"
                className="block px-3 py-2.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
              >
                Vector Art Conversion
              </Link>
              <Link
                href="/services/applique-patches"
                className="block px-3 py-2.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
              >
                Applique & Patches
              </Link>
            </div>
          </div>

          <Link href="/pricing" className="hover:text-blue-600 transition-colors">
            Pricing
          </Link>
          <Link href="/samples" className="hover:text-blue-600 transition-colors">
            Stitch Samples
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">
            Contact
          </Link>
        </nav>

        {/* Header CTAs */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="hidden sm:inline-flex border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold"
            asChild
          >
            <Link href="/login">Customer Login</Link>
          </Button>
          <Button
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 shadow-md shadow-amber-500/25 transition-all"
            asChild
          >
            <Link href="/get-quote">Get Free Quote</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
