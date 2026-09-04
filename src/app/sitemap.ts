import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://metadate.pages.dev",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
