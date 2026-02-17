import type { Metadata } from "next";
import WaistToHipRatioPageClient from "@/app/components/tools/body-proportions/waist-to-hip-ratio-calculator/waist-to-hip-ratio-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Waist to Hip Ratio Calculator",
  description:
    "Calculate waist-to-hip ratio and compare against sex-specific risk thresholds for fat distribution context.",
  canonical: "https://bodyfatestimator.ai/waist-to-hip-ratio-calculator",
});

export default function WaistToHipRatioPage() {
  return <WaistToHipRatioPageClient />;
}

