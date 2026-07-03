"use client";

import PageHero from "@/components/ui/common/PageHero";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="bg-black text-white">
      <PageHero
        title="About GoVenture"
        subtitle="Premium embroidery digitizing, custom patch manufacturing and apparel production trusted by brands worldwide."
      />

      {/* STORY SECTION */}

      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] rounded-3xl overflow-hidden border border-zinc-800"
          >
            <Image
              src="\images\pricing\patches.jpeg"
              alt="GoVenture Story"
              fill
              sizes="50vw"
              className="object-cover hover:scale-105 transition duration-700"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#D4AF37] uppercase tracking-[4px] mb-4">
              Our Story
            </p>

            <h2 className="text-5xl font-bold mb-8">
              Built On Precision, Quality & Trust
            </h2>

            <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
              <p>
                GoVenture Embroidery & Manufacturing was founded with a
                commitment to delivering world-class embroidery digitizing and
                manufacturing services.
              </p>

              <p>
                From custom patches and digitizing to complete apparel
                manufacturing, we help brands transform ideas into premium
                products.
              </p>

              <p>
                Today, clients around the globe trust GoVenture for quality,
                consistency, craftsmanship and fast turnaround times.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MISSION & VISION */}

      <section className="py-24 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10">
           <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} whileHover={{ y: -10 }} className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden hover:border-[#D4AF37] transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]">
              <div className="relative h-64">
                <Image
                  src="/images/about/mission.jpeg"
                  alt="Mission"
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </div>

              <div className="p-10">
                <h3 className="text-3xl font-bold text-[#D4AF37] mb-6">
                  Mission
                </h3>

                <p className="text-zinc-400 leading-relaxed">
                  To provide premium embroidery digitizing, custom patches and
                  apparel manufacturing services that empower brands worldwide.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} whileHover={{ y: -10 }} className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden hover:border-[#D4AF37] transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]">
              <div className="relative h-64">
                <Image
                  src="/images/about/vision.jpg"
                  alt="Vision"
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </div>

              <div className="p-10">
                <h3 className="text-3xl font-bold text-[#D4AF37] mb-6">
                  Vision
                </h3>

                <p className="text-zinc-400 leading-relaxed">
                  To become one of the most trusted embroidery and manufacturing
                  partners for businesses and apparel brands worldwide.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROCESS */}

      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-[#D4AF37] uppercase tracking-[4px] text-sm mb-4">
              Process
            </p>

            <h2 className="text-5xl font-bold">
              How We Work
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              "Submit Design",
              "Planning",
              "Production",
              "Delivery",
            ].map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.4 }}
                className="
                  bg-zinc-950
                  border
                  border-zinc-800
                  rounded-3xl
                  p-8
                  text-center
                  hover:border-[#D4AF37]
                  transition-all
                "
              >
                <div className="text-[#D4AF37] text-5xl font-bold mb-6">
                  0{index + 1}
                </div>

                <h3 className="text-xl font-semibold">
                  {step}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}

      <section className="py-32 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-[#D4AF37] uppercase tracking-[4px] text-sm mb-4">
              Production
            </p>

            <h2 className="text-5xl font-bold">
              Manufacturing Excellence
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              "/images/about/about-factory.jpg",
              "/images/about/about-quality.jpg",
              "/images/about/about-story.jpg",
            ].map((img, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="relative h-[350px] rounded-3xl overflow-hidden"
              >
                <Image
                  src={img}
                  alt="Manufacturing"
                  fill
                  sizes="33vw"
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}

      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold">
              Why Choose GoVenture
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "24-48 Hour Turnaround",
              "Premium Quality",
              "Worldwide Delivery",
              "10+ Years Experience",
            ].map((item) => (
              <motion.div
                key={item}
                whileHover={{ y: -10 }}
                className="
                  bg-zinc-950
                  border
                  border-zinc-800
                  rounded-3xl
                  p-8
                  text-center
                  hover:border-[#D4AF37]
                  transition-all
                "
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="py-32 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#D4AF37] uppercase tracking-[4px] mb-4">
            Ready To Start?
          </p>

          <h2 className="text-5xl font-bold mb-8">
            Let's Build Something Exceptional
          </h2>

          <p className="text-zinc-400 text-lg mb-10">
            From embroidery digitizing to complete apparel manufacturing,
            GoVenture is ready to bring your ideas to life.
          </p>

          <button
            className="
              bg-[#D4AF37]
              text-black
              px-10
              py-4
              rounded-full
              font-semibold
              transition-all
              duration-300
              hover:scale-105
              hover:shadow-[0_0_35px_rgba(212,175,55,0.4)]
            "
          >
            Request A Quote
          </button>
        </div>
      </section>
    </main>
  );
}
