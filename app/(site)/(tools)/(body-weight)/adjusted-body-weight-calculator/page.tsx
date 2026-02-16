import type { Metadata } from "next";
import AdjustedBodyWeightPageClient from "@/app/components/tools/body-weight/adjusted-body-weight-calculator/adjusted-body-weight-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Adjusted Body Weight Calculator",
  description: "Calculate ideal body weight, adjusted body weight, and percent-of-IBW using common clinical formulas.",
  canonical: "https://bodyfatestimator.ai/adjusted-body-weight-calculator",
});

export default function AdjustedBodyWeightPage() {
  return <AdjustedBodyWeightPageClient />;
}
