import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.goventuresembroidery.shop";

  const routes = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/Services", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/Portfolio", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/shop", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/Contact", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/order", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
