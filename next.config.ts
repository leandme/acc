import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/upload",
        destination: "/estimate",
        permanent: true, // 308 permanent redirect (SEO-safe)
      },
    ];
  },
};

export default nextConfig;
