import Link from "next/link";

function InstagramIcon() {
  const gradId = "ig-gradient";
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <defs>
        <radialGradient id={gradId} cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="1" y="1" width="22" height="22" rx="6" fill={`url(#${gradId})`} />
      <rect
        x="6.2"
        y="6.2"
        width="11.6"
        height="11.6"
        rx="3.6"
        fill="none"
        stroke="#fff"
        strokeWidth="1.4"
      />
      <circle cx="12" cy="12" r="3.1" fill="none" stroke="#fff" strokeWidth="1.4" />
      <circle cx="15.6" cy="8.4" r="0.9" fill="#fff" />
    </svg>
  );
}

function EtsyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <circle cx="12" cy="12" r="12" fill="#F1641E" />
      <path
        d="M9.3 6.6c-.35 0-.55.18-.55.55v9.7c0 .37.2.55.55.55h5.55c.3 0 .45-.12.5-.4l.4-2.05h-.85c-.2.85-.4 1.15-1.2 1.15h-2.9c-.3 0-.42-.12-.42-.4v-3.35h2.35c.55 0 .7.32.83 1h.8v-2.95h-.8c-.13.68-.28 1-.83 1h-2.35V7.8c0-.28.12-.4.42-.4h2.8c.8 0 .98.42 1.15 1.15h.85l-.32-1.95c-.05-.28-.2-.4-.5-.4H9.3z"
        fill="#fff"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        fill="#fff"
        d="M12.01 5.5c-3.6 0-6.5 2.9-6.5 6.5 0 1.15.3 2.25.87 3.22L5.5 18.5l3.36-.88a6.47 6.47 0 0 0 3.15.82c3.6 0 6.5-2.9 6.5-6.5s-2.91-6.44-6.5-6.44zm3.8 9.1c-.16.44-.79.81-1.28.9-.34.06-.79.11-2.28-.49-1.91-.79-3.16-2.71-3.26-2.84-.1-.13-.78-1.04-.78-1.98s.49-1.4.67-1.6c.16-.16.35-.2.47-.2h.34c.11 0 .26-.03.4.3.16.4.53 1.31.58 1.4.05.1.08.21.02.34-.05.13-.08.2-.16.3-.08.1-.17.22-.24.3-.08.08-.16.17-.07.33.09.16.4.68.87 1.1.6.53 1.1.7 1.26.78.16.08.26.07.35-.03.11-.13.44-.51.56-.68.12-.17.24-.14.4-.08.16.05 1.03.48 1.2.57.18.09.3.13.34.2.04.08.04.44-.12.88z"
      />
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
                className="w-9 h-9 rounded-full overflow-hidden hover:scale-110 hover:opacity-90 transition-transform"
              >
                <InstagramIcon />
              </a>

              <a
                href="https://www.etsy.com/shop/YOUR_SHOP_NAME"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Etsy"
                className="w-9 h-9 rounded-full overflow-hidden hover:scale-110 hover:opacity-90 transition-transform"
              >
                <EtsyIcon />
              </a>

              <a
                href="https://wa.me/18322807084"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full overflow-hidden hover:scale-110 hover:opacity-90 transition-transform"
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
