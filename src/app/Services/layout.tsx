import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Embroidery Digitizing & Custom Patch Services",
  description:
    "Professional embroidery digitizing, custom patches, jersey manufacturing, private label apparel, vector conversion, and premium merchandise production.",
  alternates: {
    canonical: "https://www.goventuresembroidery.shop/Services",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
