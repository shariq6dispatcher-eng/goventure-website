import PageHero from "@/components/ui/common/PageHero";
import clientPromise from "@/lib/mongodb";
import CategoryPreview from "@/components/ui/gallery/CategoryPreview";

export default async function PortfolioPage() {
  const client = await clientPromise;
  const db = client.db("goventure");

  const projects = await db.collection("portfolio").find({}).toArray();

  // group by category and get latest image
  const categoriesMap = new Map<string, any>();

  for (const p of projects) {
    const key = p.category;

    if (
      !categoriesMap.has(key) ||
      new Date(p.createdAt) > new Date(categoriesMap.get(key).createdAt)
    ) {
      categoriesMap.set(key, p);
    }
  }

  const categories = Array.from(categoriesMap.values()).map((p: any) => ({
    category: p.category,
    image: p.image,
  }));

  return (
    <main className="bg-black text-white ">
      <PageHero
        title="Our Portfolio"
        subtitle="Browse our categories"
      />
      <CategoryPreview categories={categories} />
    </main>
  );
}