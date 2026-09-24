import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/store", destination: "/programmes", permanent: true },
      { source: "/blog", destination: "/", permanent: true },
      { source: "/blog/:path*", destination: "/", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/course-prep", destination: "/personal-training", permanent: true },
      { source: "/tactical-performance", destination: "/personal-training", permanent: true },
      { source: "/coaching", destination: "/personal-training", permanent: true },
      { source: "/the-auric-system", destination: "/programmes", permanent: true },
      { source: "/strength-conditioning-tactical-roles", destination: "/personal-training", permanent: true },
    ];
  },
};

export default nextConfig;
