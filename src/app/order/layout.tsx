import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Custom Embroidery & Patches",
  description:
    "Place your order for custom patches, embroidery digitizing, or apparel manufacturing with GoVenture. Fast quotes, quality guaranteed.",
  alternates: {
    canonical: "https://www.goventuresembroidery.shop/order",
  },
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
