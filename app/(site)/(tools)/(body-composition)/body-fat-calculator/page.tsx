import type { Metadata } from "next";
import BodyFatCalculatorPageClient from "@/app/components/tools/composition/body-fat-calculator/body-fat-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Navy Body Fat Calculator",
  description:
    "Estimate body fat percentage with the U.S. Navy circumference formula using waist, neck, height, and optional hip measurements.",
  canonical: "https://bodyfatestimator.ai/body-fat-calculator",
});

export default function BodyFatCalculatorPage() {
  return <BodyFatCalculatorPageClient />;
}
