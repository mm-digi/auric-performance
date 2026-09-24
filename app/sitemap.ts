import type { MetadataRoute } from "next";

const base = "https://www.auricperformance.co.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/personal-training`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/online-programming`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/programmes`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/cookie-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms-and-conditions`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];
}
