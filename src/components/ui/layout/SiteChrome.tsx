"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/ui/layout/Navbar";
import Footer from "@/components/ui/layout/Footer";
import WhatsAppButton from "@/components/ui/layout/WhatsAppButton";
import StickyQuote from "@/components/ui/layout/StickyQuote";

/**
 * The admin dashboard is a separate, self-contained application shell.
 * It shouldn't show the public site's navbar, footer, WhatsApp bubble,
 * or sticky "get a quote" CTA, so we skip rendering them for any
 * /admin* route.
 */
export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
      <WhatsAppButton />
      <StickyQuote />
    </>
  );
}
