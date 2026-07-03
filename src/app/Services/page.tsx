"use client";

import PageHero from "@/components/ui/common/PageHero";
import ServiceCard from "@/components/ui/services/ServiceCard";
import { motion } from "framer-motion";
import Image from "next/image";
export default function ServicesPage() {
  return (
    <main className="bg-black text-white">

      <PageHero
        title="Premium Services"
        subtitle="From embroidery digitizing to full-scale apparel manufacturing."
      />

      {/* Service Categories */}

      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            <ServiceCard
  title="Embroidery Digitizing"
  description="Machine-ready embroidery files optimized for quality, efficiency and precision."
  image="/images/services/digitizing.jpeg"
/>

            <ServiceCard
  title="Custom Patches"
  description="Premium embroidered, woven, PVC, chenille and leather patches."
  image="/portfolio/patches.png"
/>

            <ServiceCard
  title="Apparel Manufacturing"
  description="Sportswear, jerseys, uniforms and private label apparel production."
  image="\images\pricing\manufacturing.png"
/>

          </div>

        </div>
      </section>
<section className="py-32 border-t border-zinc-900">

  <div className="max-w-7xl mx-auto px-6">

    <motion.h2
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7 }}
  className="text-5xl font-bold mb-12"
>
      Embroidery Digitizing
    </motion.h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

      {[
        "Cap Digitizing",
        "Left Chest Logos",
        "Jacket Back Designs",
        "3D Puff Digitizing",
        "Applique Digitizing",
        "Logo Conversion",
      ].map((service) => (
        <motion.div
  key={service}
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
  className="
    bg-zinc-950
    border
    border-zinc-800
    rounded-3xl
    p-8
    transition-all
    duration-500
    hover:border-[#D4AF37]
    hover:-translate-y-2
    hover:shadow-[0_0_35px_rgba(212,175,55,0.15)]
  "
>
  {service}
</motion.div>
      ))}

    </div>

  </div>

</section>
<section className="py-32 border-t border-zinc-900">

  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-5xl font-bold mb-12">
      Custom Patch Manufacturing
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

      {[
        "Embroidered Patches",
        "Woven Patches",
        "PVC Patches",
        "Leather Patches",
        "Chenille Patches",
        "Velcro Patches",
      ].map((patch) => (
        <div
  key={patch}
  className="
    bg-zinc-950
    border
    border-zinc-800
    rounded-3xl
    p-8
    transition-all
    duration-500
    hover:border-[#D4AF37]
    hover:-translate-y-2
    hover:shadow-[0_0_35px_rgba(212,175,55,0.15)]
  "
>
          {patch}
        </div>
      ))}

    </div>

  </div>

</section>
<section className="py-32 border-t border-zinc-900">

  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-5xl font-bold mb-12">
      Apparel Manufacturing
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

      {[
        "Sports Jerseys",
        "Sportswear",
        "T-Shirts",
        "Polo Shirts",
        "Hoodies",
        "Uniforms",
      ].map((item) => (
        <div
  key={item}
  className="
    bg-zinc-950
    border
    border-zinc-800
    rounded-3xl
    p-8
    transition-all
    duration-500
    hover:border-[#D4AF37]
    hover:-translate-y-2
    hover:shadow-[0_0_35px_rgba(212,175,55,0.15)]
  "
>
          {item}
        </div>
      ))}

    </div>

  </div>

</section>
<section className="py-32 border-t border-zinc-900">

  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center mb-20">

      <h2 className="text-5xl font-bold">
        Flexible Pricing
      </h2>

      <p className="text-zinc-400 mt-6">
        Pricing depends on artwork complexity, quantity and production requirements.
      </p>

    </div>

    <div className="grid md:grid-cols-3 gap-8">

      <motion.div
  whileHover={{ y: -10 }}
  className="
    bg-zinc-950
    border
    border-zinc-800
    rounded-3xl
    overflow-hidden
    transition-all
    duration-500
    hover:border-[#D4AF37]
  "
>
  <div className="relative h-56">
    <Image
      src="/images/portfolio/portfolio-6.jpeg"
      alt="Digitizing"
      fill
      sizes="33vw"
      className="object-cover"
    />
  </div>

  <div className="p-10">
    <h3 className="text-2xl font-bold mb-4">
      Digitizing
    </h3>

    <p className="text-zinc-400">
      Custom quote based on stitch count and complexity.
    </p>
  </div>
</motion.div>

      <motion.div
  whileHover={{ y: -10 }}
  className="
    bg-zinc-950
    border
    border-[#D4AF37]
    rounded-3xl
    overflow-hidden
    transition-all
    duration-500
    hover:shadow-[0_0_40px_rgba(212,175,55,0.2)]
  "
>
  <div className="relative h-56">
    <Image
      src="/images/pricing/patches.jpeg"
      alt="Patches"
      fill
      sizes="33vw"
      className="object-cover"
    />
  </div>

  <div className="p-10">
    <h3 className="text-2xl font-bold mb-4">
      Patches
    </h3>

    <p className="text-zinc-400">
      Quantity-based pricing with bulk discounts.
    </p>
  </div>
</motion.div>

      <motion.div
  whileHover={{ y: -10 }}
  className="
    bg-zinc-950
    border
    border-zinc-800
    rounded-3xl
    overflow-hidden
    transition-all
    duration-500
    hover:border-[#D4AF37]
  "
>
  <div className="relative h-56">
    <Image
      src="/images/pricing/manufacturing.png"
      alt="Manufacturing"
      fill
      sizes="33vw"
      className="object-cover"
    />
  </div>

  <div className="p-10">
    <h3 className="text-2xl font-bold mb-4">
      Manufacturing
    </h3>

    <p className="text-zinc-400">
      Project-based pricing for private label production.
    </p>
  </div>
</motion.div>

    </div>

  </div>

</section>
<section className="py-32 border-t border-zinc-900">

  <div className="max-w-5xl mx-auto text-center px-6">

    <h2 className="text-6xl font-bold mb-8 leading-tight">
      Ready To Start Your Project?
    </h2>

    <p className="text-zinc-400 text-lg mb-10">
      Get a custom quote for embroidery digitizing, patch manufacturing or apparel production.
    </p>

    <a
  href="/quote"
  className="
    inline-block
    bg-[#D4AF37]
    text-black
    px-10
    py-5
    rounded-full
    font-semibold
    transition-all
    duration-300
    hover:scale-105
    hover:shadow-[0_0_35px_rgba(212,175,55,0.4)]
  "
>
      Request Quote
    </a>

  </div>

</section>
    </main>
  );
}
