import type { Metadata } from "next";
import ShoulderToWaistRatioPageClient from "@/app/components/tools/body-proportions/shoulder-to-waist-ratio-calculator/shoulder-to-waist-ratio-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Shoulder to Waist Ratio Calculator",
  description:
    "Calculate shoulder-to-waist ratio (SWR) from circumference measurements and compare your result with practical taper bands.",
  canonical: "https://bodyfatestimator.ai/shoulder-to-waist-ratio-calculator",
});

export default function ShoulderToWaistRatioPage() {
  return <ShoulderToWaistRatioPageClient />;
}
