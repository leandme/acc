import type { Metadata } from "next";
import WaistToHeightRatioPageClient from "@/app/components/tools/body-proportions/waist-to-height-ratio-calculator/waist-to-height-ratio-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Waist to Height Ratio Calculator",
  description:
    "Calculate waist-to-height ratio and compare against central-fat risk screening thresholds.",
  canonical: "https://bodyfatestimator.ai/waist-to-height-ratio-calculator",
});

export default function WaistToHeightRatioPage() {
  return <WaistToHeightRatioPageClient />;
}
