import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/body-fat-visualizer",
        destination: "/body-visualizer",
        permanent: true, // 301 redirect
      },
      {
        source: "/best-ai-body-fat-estimator",
        destination: "/guides/best-body-fat-estimator",
        permanent: true, // 301 redirect
      },
    ];
  },
};

export default nextConfig;
