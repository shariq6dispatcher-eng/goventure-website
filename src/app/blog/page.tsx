import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/ui/common/PageHero";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, guides, and insights on embroidery digitizing, custom patches, and apparel manufacturing from GoVenture.",
  alternates: {
    canonical: "https://www.goventuresembroidery.shop/blog",
  },
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
}

const posts: BlogPost[] = [
  {
    slug: "embroidery-digitizing-basics",
    title: "Embroidery Digitizing 101: What Every Brand Should Know",
    excerpt:
      "A simple breakdown of what digitizing actually is, why it matters for stitch quality, and how to prepare your artwork before sending it to a manufacturer.",
    image: "/images/services/patches.png",
    category: "Digitizing",
    readTime: "5 min read",
  },
  {
    slug: "custom-patches-vs-embroidered-logos",
    title: "Custom Patches vs. Direct Embroidery: Which Is Right for You?",
    excerpt:
      "Patches and direct embroidery both have their place. Here's how to decide which method fits your product, budget, and turnaround time.",
    image: "/images/patches.png",
    category: "Patches",
    readTime: "4 min read",
  },
  {
    slug: "choosing-a-manufacturing-partner",
    title: "How to Choose the Right Apparel Manufacturing Partner",
    excerpt:
      "From minimum order quantities to sample turnaround, here's what to look for before committing to a private label or bulk production run.",
    image: "/images/manufacturing/m1.jpg",
    category: "Manufacturing",
    readTime: "6 min read",
  },
  {
    slug: "jersey-production-guide",
    title: "A Practical Guide to Custom Jersey Production",
    excerpt:
      "Fabric weights, sublimation vs. embroidery branding, and sizing considerations for teams and sportswear brands ordering custom jerseys.",
    image: "/images/services/jerseys.png",
    category: "Sportswear",
    readTime: "5 min read",
  },
];

export default function BlogPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <PageHero
        title="Blog"
        subtitle="Guides and insights on embroidery digitizing, custom patches, and apparel manufacturing — written from the production floor."
      />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden hover:border-[#D4AF37] transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]"
            >
              <div className="relative h-64">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="50vw"
                  className="object-cover group-hover:scale-105 transition duration-700"
                />
              </div>

              <div className="p-8">
                <div className="flex items-center gap-3 text-sm text-zinc-500 mb-4">
                  <span className="text-[#D4AF37] font-semibold">
                    {post.category}
                  </span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                <h2 className="text-2xl font-bold mb-4 group-hover:text-[#D4AF37] transition">
                  {post.title}
                </h2>

                <p className="text-zinc-400 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
