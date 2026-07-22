import type { MetadataRoute } from "next";
import { CASE_STUDIES } from "@/lib/content";

const BASE = "https://sampeerstudio.com"; // TODO: real domain

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE}/automations`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // one entry per case study, generated from the registry
    ...Object.keys(CASE_STUDIES).map((slug) => ({
      url: `${BASE}/work/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
