import type { MetadataRoute } from "next";
import { CASE_STUDIES } from "@/lib/content";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/automations`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // one entry per case study, generated from the registry
    ...Object.keys(CASE_STUDIES).map((slug) => ({
      url: `${SITE_URL}/work/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
