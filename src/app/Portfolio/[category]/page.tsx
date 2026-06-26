import clientPromise from "@/lib/mongodb";
import CategoryGridClient from "@/components/ui/gallery/CategoryGridClient";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const client = await clientPromise;
  const db = client.db("goventure");

  const categoryName = category.replace(/-/g, " ");

  const projects = await db
    .collection("portfolio")
    .find({
      category: { $regex: new RegExp(categoryName, "i") },
    })
    .toArray();

  // convert Mongo _id to string (IMPORTANT for React keys)
  const safeProjects = projects.map((p: any) => ({
    _id: p._id.toString(),
    image: p.image,
    title: p.title,
  }));

  return (
    <div className="p-6 text-white pt-40">
      <h1 className="text-2xl mb-6 uppercase">
        {categoryName}
      </h1>

      {/* 🔥 THIS ENABLES LIGHTBOX + SWIPE */}
      <CategoryGridClient
  projects={safeProjects}
  categoryName={categoryName}
/>
    </div>
  );
}