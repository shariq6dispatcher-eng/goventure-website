import CategoryGridClient from "@/components/ui/gallery/CategoryGridClient";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const categoryName = category.replace(/-/g, " ");

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.goventuresembroidery.shop";

  const res = await fetch(
    `${baseUrl}/api/portfolio?category=${encodeURIComponent(categoryName)}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load portfolio");
  }

  const projects = await res.json();

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
