import type { MetadataRoute } from "next";

const BASE = "https://sampeerstudio.com"; // TODO: real domain

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
