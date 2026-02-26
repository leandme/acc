import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/ads.txt",
        destination: "https://srv.adstxtmanager.com/19390/bodyfatestimator.ai",
        permanent: true, // 301 redirect
      },
      {
        source: "/blog/calculate-body-fat-percentage-at-home",
        destination: "/guides/how-to-estimate-body-fat-percentage",
        permanent: true, // 301 redirect
      },
      {
        source: "/guides/best-body-fat-estimation-method",
        destination: "/guides/best-way-to-measure-body-fat-at-home",
        permanent: true, // 301 redirect
      },
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
      {
        source: "/blog",
        destination: "/guides",
        permanent: true, // 301 redirect
      },
      {
        source: "/upload",
        destination: "/estimate",
        permanent: true, // 301 redirect
      },
      {
        source: "/faqs",
        destination: "/#faqs",
        permanent: true, // 301 redirect
      },
      {
        source: "/pricing",
        destination: "/estimate",
        permanent: true, // 301 redirect
      },
      {
        source: "/support",
        destination: "/contact",
        permanent: true, // 301 redirect
      },
      {
        source: "/refund",
        destination: "/terms",
        permanent: true, // 301 redirect
      },
      {
        source: "/html-sitemap",
        destination: "/sitemap-html",
        permanent: true, // 301 redirect
      },
    ];
  },
};

export default nextConfig;
