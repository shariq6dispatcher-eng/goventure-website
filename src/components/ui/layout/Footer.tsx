import Link from 'next/link';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b1b36] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
        {/* Brand Overview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-base">
              GV
            </div>
            <span className="text-xl font-bold text-white">GoVenture</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Professional custom embroidery digitizing and vector conversion services. High-precision, machine-tested files delivered within 4 to 12 hours.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>Guaranteed Free Revisions</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Our Services</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><Link href="/services/custom-embroidery-digitizing" className="hover:text-white transition-colors">Custom Logo Digitizing</Link></li>
            <li><Link href="/services/3d-puff-embroidery" className="hover:text-white transition-colors">3D Puff Embroidery</Link></li>
            <li><Link href="/services/cap-hat-digitizing" className="hover:text-white transition-colors">Cap & Hat Digitizing</Link></li>
            <li><Link href="/services/vector-art-conversion" className="hover:text-white transition-colors">Vector Artwork Conversion</Link></li>
            <li><Link href="/services/applique-patches" className="hover:text-white transition-colors">Embroidered Patches</Link></li>
          </ul>
        </div>

        {/* Formats Delivered */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Supported Formats</h4>
          <p className="text-xs text-slate-400 mb-3">
            Compatible with all commercial & home embroidery machines:
          </p>
          <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-slate-300">
            {['DST', 'PES', 'EXP', 'JEF', 'VP3', 'HUS', 'XXX', 'AI', 'EPS', 'PDF', 'SVG'].map((ext) => (
              <span key={ext} className="bg-slate-800 border border-slate-700 px-2 py-1 rounded">
                .{ext}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Get In Touch</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-blue-400 shrink-0" />
              <span>+1 (800) 123-4567</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <span>support@goventure.com</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>Serving Embroidery Shops Worldwide (24/7 Production)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© 2026 GoVenture Digitizing. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy-policy" className="hover:text-slate-300">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
