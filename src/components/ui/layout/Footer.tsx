import Link from "next/link";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" />
    </svg>
  );
}

function EtsyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
      <path
        d="M7.2 3.2h9.4l.9 3.9h-1.3c-.5-1.7-1-2.4-2.8-2.4h-3.1c-.5 0-.6.1-.6.6v5.1h2.1c1.4 0 1.6-.5 1.9-1.9h1.2v5.4h-1.2c-.2-1.3-.5-1.9-1.9-1.9h-2.1v4.4c0 .8.3 1.1 1.2 1.1h2.9c1.9 0 2.6-.7 3.4-2.6h1.2l-.6 4.1H7.1v-1.2c1.4-.1 1.7-.2 1.7-1.2V5.7c0-.9-.3-1.1-1.7-1.2z"
        fill="currentColor"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.1.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.3-.1-.1-.3-.2-.5-.3z" />
      <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.6 1.4 5.2L2 22l4.9-1.3C8.4 21.5 10.1 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.7 0-3.3-.5-4.7-1.3l-.3-.2-3 .8.8-2.9-.2-.3C3.7 15 3.3 13.5 3.3 12c0-4.8 3.9-8.7 8.7-8.7s8.7 3.9 8.7 8.7-3.9 8.7-8.7 8.7z" />
    </svg>
  );
}

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

            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.instagram.com/go_ventures.11"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition"
              >
                <InstagramIcon />
              </a>

              <a
                href="https://www.etsy.com/shop/YOUR_SHOP_NAME"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Etsy"
                className="w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition"
              >
                <EtsyIcon />
              </a>

              <a
                href="https://wa.me/18322807084"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#D4AF37] hover:border-[#D4AF37] transition"
              >
                <WhatsAppIcon />
              </a>
            </div>
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
