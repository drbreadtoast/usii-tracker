import type { MetadataRoute } from "next";
import { getManifest } from "@/lib/content";
import { ALL_CATEGORIES } from "@/lib/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://theossreport.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const manifest = await getManifest();
  const lastModified = new Date(manifest.lastUpdated);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/sources`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const sectionRoutes: MetadataRoute.Sitemap = ALL_CATEGORIES
    .filter((c) => c !== "headlines")
    .map((c) => ({
      url: `${SITE_URL}/${c}`,
      lastModified: new Date(
        manifest.sections[c]?.lastUpdated ?? manifest.lastUpdated,
      ),
      changeFrequency: "hourly",
      priority: 0.8,
    }));

  return [...staticRoutes, ...sectionRoutes];
}
