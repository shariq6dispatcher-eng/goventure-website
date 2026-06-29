import Link from "next/link";
export default function Footer() {
  return (
    <footer className="border-t border-zinc-900">

      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid md:grid-cols-4 gap-12">

          <div>
            <h3 className="text-3xl font-bold">
              <span className="text-[#D4AF37]">GO</span>VENTURE
            </h3>

            <p className="text-zinc-500 mt-4">
              Premium embroidery digitizing,
              custom patches and apparel manufacturing.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              Services
            </h4>

           <ul className="space-y-2 text-zinc-500">
  <li>
    <Link href="/Services#digitizing" className="hover:text-[#D4AF37] transition">
      Embroidery Digitizing
    </Link>
  </li>

  <li>
    <Link href="/Services#patches" className="hover:text-[#D4AF37] transition">
      Custom Patches
    </Link>
  </li>

  <li>
    <Link href="/Services#sportswear" className="hover:text-[#D4AF37] transition">
      Sportswear
    </Link>
  </li>

  <li>
    <Link href="/Services#manufacturing" className="hover:text-[#D4AF37] transition">
      Apparel Manufacturing
    </Link>
  </li>
</ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              Company
            </h4>

            <ul className="space-y-2 text-zinc-500">
  <li>
    <Link href="/about" className="hover:text-[#D4AF37] transition">
      About
    </Link>
  </li>

  <li>
    <Link href="/Portfolio" className="hover:text-[#D4AF37] transition">
      Portfolio
    </Link>
  </li>

  <li>
    <Link href="/Contact" className="hover:text-[#D4AF37] transition">
      Contact
    </Link>
  </li>

  <li>
    <Link href="/blog" className="hover:text-[#D4AF37] transition">
      Blog
    </Link>
  </li>
</ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              Contact
            </h4>

            <ul className="space-y-2 text-zinc-500">
              <li>
  <a
    href="mailto:embroidery@goventuresdispatch.com"
    className="hover:text-[#D4AF37] transition"
  >
    embroidery@goventuresdispatch.com
  </a>
</li>
              <li>
  <a
    href="https://wa.me/18322807084"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-[#D4AF37] transition"
  >
    WhatsApp Support
  </a>
</li>
              <li>Worldwide Service</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-zinc-900 mt-16 pt-8 text-zinc-600">
          © 2026 GoVenture Embroidery & Manufacturing
        </div>

      </div>

    </footer>
  );
}
