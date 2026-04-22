import type { NextConfig } from "next";

const REMOVED_TOOL_SLUGS = [
  "skinfold-body-fat-calculator",
  "calorie-calculator",
  "tdee-calculator",
  "bmr-calculator",
  "army-body-fat-calculator",
  "body-fat-calculator",
  "lean-body-mass-calculator",
  "body-frame-size-calculator",
  "natty-or-not-calculator",
  "muscular-potential-calculator",
  "casey-butt-calculator",
  "bodybuilding-genetics-calculator",
  "rfm-calculator",
  "bri-calculator",
  "visceral-fat-calculator",
  "body-shape-calculator",
  "shoulder-to-waist-ratio-calculator",
  "mid-parental-height-calculator",
  "overweight-calculator",
  "adjusted-body-weight-calculator",
  "ponderal-index-calculator",
  "broca-index-calculator",
  "waist-to-hip-ratio-calculator",
  "waist-to-height-ratio-calculator",
  "bai-calculator",
  "muscle-mass-calculator",
  "ideal-waist-size-calculator",
  "steps-to-calories-calculator",
  "calories-burned-calculator",
  "bmi-calculator",
  "weight-loss-calculator",
  "weight-loss-percentage-calculator",
  "fasting-weight-loss-calculator",
  "intermittent-fasting-calculator",
  "ideal-weight-calculator",
  "ape-index-calculator",
  "calorie-deficit-calculator",
  "macro-calculator",
  "calorie-counter",
  "age-guesser",
  "height-calculator",
  "ffmi-calculator",
  "attractiveness-test",
  "face-symmetry-test",
  "eyebrow-type-detector",
  "hair-color-detector",
  "hair-type-detector",
  "lip-shape-detector",
  "nose-shape-detector",
  "skin-analyzer",
  "golden-face-ratio-analyzer",
  "face-shape-detector",
  "eye-shape-detector",
  "height-estimator",
  "body-shape-analyzer",
] as const;

const REMOVED_CATEGORY_SLUGS = ["muscle", "height", "face", "weight", "calories"] as const;

const REMOVED_TOOL_REDIRECTS = REMOVED_TOOL_SLUGS.map((slug) => ({
  source: `/${slug}`,
  destination: "/",
  permanent: true,
}));

const REMOVED_CATEGORY_REDIRECTS = REMOVED_CATEGORY_SLUGS.map((slug) => ({
  source: `/tools/${slug}`,
  destination: "/",
  permanent: true,
}));

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/ads.txt",
        destination:
          "https://adstxt.journeymv.com/sites/9e90e868-f929-4cda-97a0-ad92cf3a981d/ads.txt",
        permanent: true, // 301 redirect
      },
      {
        source: "/tools/body-fat",
        destination: "/tools/fat",
        permanent: true, // 301 redirect
      },
      {
        source: "/tools",
        destination: "/estimate",
        permanent: true, // 301 redirect
      },
      {
        source: "/tools/body-composition",
        destination: "/tools/shape",
        permanent: true, // 301 redirect
      },
      {
        source: "/tools/composition",
        destination: "/tools/shape",
        permanent: true, // 301 redirect
      },
      {
        source: "/tools/body-proportions",
        destination: "/tools/shape",
        permanent: true, // 301 redirect
      },
      {
        source: "/tools/body-weight",
        destination: "/",
        permanent: true, // 301 redirect
      },
      {
        source: "/tools/metabolism",
        destination: "/",
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
      {
        source: "/calorie-estimator",
        destination: "/",
        permanent: true, // 301 redirect
      },
      {
        source: "/calorie-scanner",
        destination: "/",
        permanent: true, // 301 redirect
      },
      ...REMOVED_CATEGORY_REDIRECTS,
      ...REMOVED_TOOL_REDIRECTS,
    ];
  },
};

export default nextConfig;
