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
              <li>Embroidery Digitizing</li>
              <li>Custom Patches</li>
              <li>Sportswear</li>
              <li>Apparel Manufacturing</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              Company
            </h4>

            <ul className="space-y-2 text-zinc-500">
              <li>About</li>
              <li>Portfolio</li>
              <li>Contact</li>
              <li>Blog</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              Contact
            </h4>

            <ul className="space-y-2 text-zinc-500">
              <li>sales@goventure.com</li>
              <li>WhatsApp Support</li>
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