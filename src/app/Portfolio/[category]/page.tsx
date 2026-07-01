import CategoryGridClient from "@/components/ui/gallery/CategoryGridClient";

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
