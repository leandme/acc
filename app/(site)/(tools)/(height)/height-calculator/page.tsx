import type { Metadata } from "next";
import HeightPageClient from "@/app/components/tools/height/height-calculator/height-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Height Calculator – Prediction, Potential & Probability",
  description:
    "Estimate adult-height prediction, family target range, and probability of reaching a selected height using parent-based models.",
  canonical: "https://bodyfatestimator.ai/height-calculator",
});

export default function HeightCalculatorPage() {
  return <HeightPageClient />;
}
