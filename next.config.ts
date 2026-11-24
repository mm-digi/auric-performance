import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/280-club/admin", destination: "/admin", permanent: true },
      { source: "/280-club/sign-in", destination: "/admin/sign-in", permanent: true },
      { source: "/store", destination: "/programmes", permanent: true },
      { source: "/blog", destination: "/", permanent: true },
      { source: "/blog/:path*", destination: "/", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/course-prep", destination: "/programmes", permanent: true },
      { source: "/tactical-performance", destination: "/programmes", permanent: true },
      { source: "/coaching", destination: "/programmes", permanent: true },
      { source: "/the-auric-system", destination: "/programmes", permanent: true },
      { source: "/strength-conditioning-tactical-roles", destination: "/programmes", permanent: true },
    ];
  },
};

export default nextConfig;
