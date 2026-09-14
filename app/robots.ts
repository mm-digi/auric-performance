import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://auricperformance.co.uk/sitemap.xml",
    host: "https://auricperformance.co.uk",
  };
}
