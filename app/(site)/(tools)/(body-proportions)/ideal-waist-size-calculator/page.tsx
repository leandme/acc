import type { Metadata } from "next";
import IdealWaistSizePageClient from "@/app/components/tools/body-proportions/ideal-waist-size-calculator/ideal-waist-size-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Ideal Waist Size Calculator",
  description:
    "Estimate ideal and upper-target waist size from height and compare your current waist with practical ratio-based targets.",
  canonical: "https://bodyfatestimator.ai/ideal-waist-size-calculator",
});

export default function IdealWaistSizePage() {
  return <IdealWaistSizePageClient />;
}
