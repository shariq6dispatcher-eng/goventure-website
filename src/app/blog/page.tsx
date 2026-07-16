import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, guides, and insights on embroidery digitizing, custom patches, and apparel manufacturing from GoVenture.",
  alternates: {
    canonical: "https://www.goventuresembroidery.shop/blog",
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-black text-white p-20">
      <h1 className="text-6xl font-bold">Blog</h1>
    </main>
  );
}
