import type { Metadata } from "next";
import PageHero from "@/components/ui/common/PageHero";
import CategoryPreview from "@/components/ui/gallery/CategoryPreview";
import { mongo } from "@/lib/mongodb";

export const metadata: Metadata = {
  title: "Embroidery & Patch Portfolio",
  description:
    "Browse our portfolio of custom embroidery digitizing, patches, jerseys, and apparel manufacturing projects delivered to clients worldwide.",
  alternates: {
    canonical: "https://www.goventuresembroidery.shop/Portfolio",
  },
};

interface PortfolioProject {
  category: string;
  image?: string;
  createdAt: string | Date;
  [key: string]: unknown;
}

async function getPortfolio(): Promise<PortfolioProject[]> {
  const results = await mongo.find("portfolio", {}, { createdAt: -1 });
  return results as PortfolioProject[];
}

export default async function PortfolioPage() {
  const projects = await getPortfolio();

  const categoriesMap = new Map<
    string,
    { image: string; createdAt: string | Date; count: number }
  >();

  for (const p of projects) {
    if (!p.image) continue;

    const key: string = p.category;
    const existing = categoriesMap.get(key);

    if (!existing) {
      categoriesMap.set(key, {
        image: p.image,
        createdAt: p.createdAt,
        count: 1,
      });
      continue;
    }

    existing.count += 1;
    if (new Date(p.createdAt) > new Date(existing.createdAt)) {
      existing.image = p.image;
      existing.createdAt = p.createdAt;
    }
  }

  const categories = Array.from(categoriesMap.entries()).map(
    ([category, data]) => ({
      category,
      image: data.image,
      count: data.count,
    })
  );

  return (
    <main className="bg-black text-white min-h-screen">
      <PageHero title="Our Portfolio" subtitle="Browse our categories" />
      <CategoryPreview categories={categories} />
    </main>
  );
}
