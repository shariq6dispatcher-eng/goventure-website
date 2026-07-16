import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import SiteChrome from "@/components/ui/layout/SiteChrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.goventuresembroidery.shop"),
  title: {
    default: "GoVenture Embroidery & Manufacturing",
    template: "%s | GoVenture",
  },
  description:
    "Premium embroidery digitizing, custom patches, apparel manufacturing, sportswear production, and private label solutions.",
  keywords: [
    "custom patches",
    "embroidery digitizing",
    "custom embroidery",
    "jersey manufacturing",
    "private label apparel",
    "sportswear manufacturing",
    "embroidered patches",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "GoVenture Embroidery & Manufacturing",
    description:
      "Premium embroidery digitizing, custom patches, apparel manufacturing, sportswear production, and private label solutions.",
    url: "https://www.goventuresembroidery.shop",
    image: "https://www.goventuresembroidery.shop/images/Hero.jpg",
    priceRange: "$$",
    areaServed: "Worldwide",
    sameAs: [
      "https://www.instagram.com/go_ventures.11",
      "https://www.etsy.com/shop/GoventuresDesign",
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Embroidery Digitizing",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Custom Patches",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Jersey Manufacturing",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Private Label Apparel Production",
        },
      },
    ],
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
