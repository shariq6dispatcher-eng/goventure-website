import PageHero from "@/components/ui/common/PageHero";
import CategoryPreview from "@/components/ui/gallery/CategoryPreview";

async function getPortfolio() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.goventuresembroidery.shop";

  const res = await fetch(`${baseUrl}/api/portfolio`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function PortfolioPage() {
  const projects = await getPortfolio();

  const categoriesMap = new Map<string, any>();

  for (const p of projects) {
    const key = p.category;

    if (
      !categoriesMap.has(key) ||
      new Date(p.createdAt) >
        new Date(categoriesMap.get(key).createdAt)
    ) {
      categoriesMap.set(key, p);
    }
  }

  const categories = Array.from(categoriesMap.values()).map((p: any) => ({
    category: p.category,
    image: p.image,
  }));

  return (
    <main className="bg-black text-white">
      <PageHero
        title="Our Portfolio"
        subtitle="Browse our categories"
      />

      <CategoryPreview categories={categories} />
    </main>
  );
}
