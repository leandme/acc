import type { Metadata } from "next";
import WeightLossPercentagePageClient from "@/app/components/tools/body-weight/weight-loss-percentage-calculator/weight-loss-percentage-page.client";

export const metadata: Metadata = {
  title: "Weight Loss Percentage Calculator",
  description:
    "Calculate weight loss percentage from your starting and current body weight. See category interpretation and trend-focused context.",
  alternates: {
    canonical: "https://bodyfatestimator.ai/weight-loss-percentage-calculator",
  },
};

export default function WeightLossPercentagePage() {
  return <WeightLossPercentagePageClient />;
}
