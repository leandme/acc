import type { Metadata } from "next";
import FastingWeightLossPageClient from "@/app/components/tools/body-weight/fasting-weight-loss-calculator/fasting-weight-loss-page.client";

export const metadata: Metadata = {
  title: "Fasting Weight Loss Calculator",
  description:
    "Estimate projected weight change from fasting and non-fasting calorie patterns with adaptive energy-balance modeling.",
  alternates: {
    canonical: "https://bodyfatestimator.ai/fasting-weight-loss-calculator",
  },
};

export default function FastingWeightLossPage() {
  return <FastingWeightLossPageClient />;
}
