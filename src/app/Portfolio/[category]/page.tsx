import CategoryGridClient from "@/components/ui/gallery/CategoryGridClient";
import { mongo } from "@/lib/mongodb";

interface PortfolioProject {
  _id: string;
  category: string;
  image?: string;
  title?: string;
  [key: string]: unknown;
}

async function getPortfolio(): Promise<PortfolioProject[]> {
  return (await mongo.find(
    "portfolio",
    {},
    { createdAt: -1 }
  )) as PortfolioProject[];
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const categoryName = category.replace(/-/g, " ");

  const allProjects = await getPortfolio();

  const projects = allProjects.filter(
    (p) =>
      p.image &&
      p.category?.toLowerCase().includes(categoryName.toLowerCase())
  );

  const safeProjects = projects.map((p) => ({
    _id: p._id,
    image: p.image as string,
    title: p.title,
  }));

  return (
    <main className="min-h-screen bg-black px-4 pb-20 pt-32 text-white sm:px-6 sm:pt-40">
      <div className="mx-auto max-w-7xl">
        <CategoryGridClient
          projects={safeProjects}
          categoryName={categoryName}
        />
      </div>
    </main>
  );
}
