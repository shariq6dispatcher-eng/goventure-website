import type { Metadata } from "next";
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
  title: {
    default: "GoVenture Embroidery & Manufacturing",
    template: "%s | GoVenture",
  },
  description:
    "Premium embroidery digitizing, custom patches, apparel manufacturing, sportswear production, and private label solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}