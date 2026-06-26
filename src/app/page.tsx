import Navbar from "@/components/ui/layout/Navbar";
import Footer from "@/components/ui/layout/Footer";
import Hero from "@/components/ui/home/Hero";
import Services from "@/components/ui/home/Services";
import Portfolio from "@/components/ui/home/Portfolio";
import TrustSection from "@/components/ui/home/trustSection";
import CTA from "@/components/ui/home/CTA";
import WhatsAppButton from "@/components/ui/layout/WhatsAppButton";
import Testimonials from "@/components/ui/home/Testimonials";
import Industries from "@/components/ui/home/Industries";
import StickyQuote from "@/components/ui/layout/StickyQuote";
import Stats from "@/components/ui/home/Stats";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Stats />
      <Services />
      <Portfolio />
      <TrustSection />
      <Industries />
      <Testimonials />
      <CTA />
    </main>
  );
}
