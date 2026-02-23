import type { Metadata } from "next";
import MidParentalHeightPageClient from "@/app/components/tools/height/mid-parental-height-calculator/mid-parental-height-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Mid-Parental Height Calculator",
  description:
    "Estimate target adult height from father and mother heights using the standard mid-parental-height method and target range.",
  canonical: "https://bodyfatestimator.ai/mid-parental-height-calculator",
});

export default function MidParentalHeightCalculatorPage() {
  return <MidParentalHeightPageClient />;
}
