import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/280-club/booking/"],
    },
    sitemap: "https://www.auricperformance.co.uk/sitemap.xml",
    host: "https://www.auricperformance.co.uk",
  };
}
