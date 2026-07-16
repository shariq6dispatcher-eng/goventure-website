import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Custom Patches & Embroidery Products",
  description:
    "Browse and order custom embroidered patches, apparel, and merchandise directly from GoVenture. Premium quality, fast turnaround, worldwide shipping.",
  alternates: {
    canonical: "https://www.goventuresembroidery.shop/shop",
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
