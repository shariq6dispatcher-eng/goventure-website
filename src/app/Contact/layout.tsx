import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with GoVenture Embroidery & Manufacturing for custom patches, embroidery digitizing, and apparel manufacturing quotes.",
  alternates: {
    canonical: "https://www.goventuresembroidery.shop/Contact",
  },
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
