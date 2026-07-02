import CategoryGridClient from "@/components/ui/gallery/CategoryGridClient";
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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const categoryName = category.replace(/-/g, " ");

  const allProjects = await getPortfolio();

  const projects = allProjects.filter((p: any) =>
    p.category?.toLowerCase().includes(categoryName.toLowerCase())
  );

  const safeProjects = projects.map((p: any) => ({
    _id: p._id,
    image: p.image,
    title: p.title,
  }));

  return (
    <div className="p-6 text-white pt-40">
      <h1 className="text-2xl mb-6 uppercase">
        {categoryName}
      </h1>

      <CategoryGridClient
        projects={safeProjects}
        categoryName={categoryName}
      />
    </div>
  );
}
