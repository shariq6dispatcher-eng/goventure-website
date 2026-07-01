import PageHero from "@/components/ui/common/PageHero";
import CategoryPreview from "@/components/ui/gallery/CategoryPreview";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.goventuresembroidery.shop";

  const res = await fetch(`${baseUrl}/api/portfolio`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load portfolio");
  }

  const projects = await res.json();

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
