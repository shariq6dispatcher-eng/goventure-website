import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about GoVenture Embroidery & Manufacturing — 15+ years of experience delivering premium embroidery digitizing, custom patches, and apparel manufacturing to 50+ countries.",
  alternates: {
    canonical: "https://www.goventuresembroidery.shop/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
