import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.goventuresembroidery.shop";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin-login",
          "/RSM",
          "/api",
          "/order-status",
          "/track",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
