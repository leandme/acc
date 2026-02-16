import type { Metadata } from "next";
import AdjustedBodyWeightPageClient from "@/app/components/tools/body-weight/adjusted-body-weight-calculator/adjusted-body-weight-page.client";

export const metadata: Metadata = {
  title: "Adjusted Body Weight Calculator",
  description:
    "Calculate ideal body weight, adjusted body weight, and percent-of-IBW using common clinical formulas.",
  alternates: {
    canonical: "https://bodyfatestimator.ai/adjusted-body-weight-calculator",
  },
};

export default function AdjustedBodyWeightPage() {
  return <AdjustedBodyWeightPageClient />;
}
