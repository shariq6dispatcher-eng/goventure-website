"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/ui/common/PageHero";
import ProductCard from "@/components/ui/shop/ProductCard";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="bg-black text-white">

      <PageHero
        title="Shop"
        subtitle="Order embroidery digitizing, patches and apparel directly online."
      />

      <section className="py-24">

        <div className="max-w-7xl mx-auto px-6">

          {loading ? (
            <div className="text-center text-zinc-400">
              Loading Products...
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  title={product.title}
                  category={product.category}
                  price={product.price}
                  image={product.image}
                />
              ))}

            </div>
          )}

        </div>

      </section>

    </main>
  );
}