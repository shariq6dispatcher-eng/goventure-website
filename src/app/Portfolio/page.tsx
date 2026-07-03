import PageHero from "@/components/ui/common/PageHero";
import CategoryPreview from "@/components/ui/gallery/CategoryPreview";
import { mongo } from "@/lib/mongodb";
 
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
 
  const categoriesMap = new Map<string, PortfolioProject>();
 
  for (const p of projects) {
    if (!p.image) continue;
 
    const key: string = p.category;
    const existing = categoriesMap.get(key);
 
    if (
      !existing ||
      new Date(p.createdAt) > new Date(existing.createdAt)
    ) {
      categoriesMap.set(key, p);
    }
  }
 
  const categories = Array.from(categoriesMap.values()).map((p) => ({
    category: p.category,
    image: p.image,
  }));
 
  return (
    <main className="bg-black text-white">
      <PageHero title="Our Portfolio" subtitle="Browse our categories" />
      <CategoryPreview categories={categories} />
    </main>
  );
}
