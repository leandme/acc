import type { Metadata } from "next";
import FastingWeightLossPageClient from "@/app/components/tools/calories/fasting-weight-loss-calculator/fasting-weight-loss-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Fasting Weight Loss Calculator",
  description: "Estimate projected weight change from fasting and non-fasting calorie patterns with adaptive energy-balance modeling.",
  canonical: "https://bodyfatestimator.ai/fasting-weight-loss-calculator",
});

export default function FastingWeightLossPage() {
  return <FastingWeightLossPageClient />;
}
