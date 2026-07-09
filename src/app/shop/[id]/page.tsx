"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white text-xl">
        Loading Product...
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white text-xl">
        Product Not Found
      </main>
    );
  }

  return (
    <main className="bg-black text-white">

      {/* HERO */}
      <section className="pt-36 pb-24">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* IMAGE */}
            <motion.div
  initial={{ opacity: 0, x: -40 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.7 }}
  className="
    rounded-3xl
    overflow-hidden
    border
    border-zinc-800
    bg-zinc-950
  "
>
  <Image
    src={product.image}
    alt={product.title}
    width={1200}
    height={1200}
    priority
    className="
      w-full
      h-auto
      object-cover
      transition-transform
      duration-700
      hover:scale-105
    "
  />
</motion.div>

            {/* DETAILS */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[#D4AF37] uppercase tracking-[4px] mb-4">
                {product.category}
              </p>

              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                {product.title}
              </h1>

              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              <div className="text-5xl font-bold text-[#D4AF37] mb-10">
                ${product.price}
              </div>

              <div className="flex flex-wrap gap-4">

                <a
                  href={`https://wa.me/923158971218?text=Hi,%20I%20want%20to%20order%20${encodeURIComponent(
                    product.title
                  )}`}
                  target="_blank"
                  className="
                    bg-[#D4AF37]
                    text-black
                    px-10
                    py-4
                    rounded-full
                    font-semibold
                    hover:scale-105
                    transition
                  "
                >
                  Order Via WhatsApp
                </a>

                <a
                  href="/order"
                  className="
                    border
                    border-[#D4AF37]
                    text-[#D4AF37]
                    px-10
                    py-4
                    rounded-full
                    font-semibold
                    hover:bg-[#D4AF37]
                    hover:text-black
                    transition
                  "
                >
                  Order Now!
                </a>

              </div>
            </motion.div>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="py-24 border-t border-zinc-900">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">

            <p className="text-[#D4AF37] uppercase tracking-[4px] mb-4">
              Included
            </p>

            <h2 className="text-5xl font-bold">
              What You Get
            </h2>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              "Premium Quality Production",
              "Fast Turnaround Time",
              "Worldwide Delivery",
              "Professional Support",
              "Bulk Order Discounts",
              "Custom Branding Options",
            ].map((item) => (
              <div
                key={item}
                className="
                  bg-zinc-950
                  border
                  border-zinc-800
                  rounded-3xl
                  p-8
                  text-center
                  transition-all
                  duration-300
                  hover:border-[#D4AF37]
                "
              >
                {item}
              </div>
            ))}

          </div>

        </div>

      </section>

      {/* SPECIFICATIONS */}
      <section className="py-24 bg-zinc-950">

        <div className="max-w-5xl mx-auto px-6">

          <div className="text-center mb-16">

            <p className="text-[#D4AF37] uppercase tracking-[4px] mb-4">
              Details
            </p>

            <h2 className="text-5xl font-bold">
              Product Specifications
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-8">

            <div className="border border-zinc-800 rounded-3xl p-8">
              <h3 className="font-bold mb-3">
                Category
              </h3>

              <p className="text-zinc-400">
                {product.category}
              </p>
            </div>

            <div className="border border-zinc-800 rounded-3xl p-8">
              <h3 className="font-bold mb-3">
                Starting Price
              </h3>

              <p className="text-zinc-400">
                ${product.price}
              </p>
            </div>

            <div className="border border-zinc-800 rounded-3xl p-8">
              <h3 className="font-bold mb-3">
                Production Time
              </h3>

              <p className="text-zinc-400">
                24–48 Hours
              </p>
            </div>

            <div className="border border-zinc-800 rounded-3xl p-8">
              <h3 className="font-bold mb-3">
                Shipping
              </h3>

              <p className="text-zinc-400">
                Worldwide Available
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="py-32">

        <div className="max-w-4xl mx-auto px-6 text-center">

          <p className="text-[#D4AF37] uppercase tracking-[4px] mb-4">
            Ready To Order?
          </p>

          <h2 className="text-5xl font-bold mb-8">
            Start Your Project Today
          </h2>

          <p className="text-zinc-400 text-lg mb-10">
            Submit your artwork and receive a professional quote from
            the GoVenture production team.
          </p>

          <a
            href="/order"
            className="
              inline-block
              bg-[#D4AF37]
              text-black
              px-10
              py-5
              rounded-full
              font-semibold
              hover:scale-105
              transition
            "
          >
            Order Now!
          </a>

        </div>

      </section>

    </main>
  );
}
