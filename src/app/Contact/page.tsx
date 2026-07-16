import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with GoVenture Embroidery & Manufacturing for custom patches, embroidery digitizing, and apparel manufacturing quotes.",
  alternates: {
    canonical: "https://www.goventuresembroidery.shop/Contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white p-20">
      <h1 className="text-6xl font-bold">Contact Us</h1>
    </main>
  );
}
