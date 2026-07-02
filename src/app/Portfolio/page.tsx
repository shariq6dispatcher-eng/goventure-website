import PageHero from "@/components/ui/common/PageHero";
import CategoryPreview from "@/components/ui/gallery/CategoryPreview";
import clientPromise from "@/lib/mongodb";

async function getPortfolio() {
  const client = await clientPromise;
  const db = client.db("goventure");

  return await db
    .collection("portfolio")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}
export default async function PortfolioPage() {
  const projects = await getPortfolio();

  const categoriesMap = new Map<string, any>();

  for (const p of projects) {
  if (!p.image) continue;

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
