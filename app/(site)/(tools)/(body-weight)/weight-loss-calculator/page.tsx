import type { Metadata } from "next";
import WeightLossPageClient from "@/app/components/tools/body-weight/weight-loss-calculator/weight-loss-page.client";

export const metadata: Metadata = {
  title: "Weight Loss Calculator - How Long to Lose Weight?",
  description:
    "Estimate time to target weight using calorie intake, activity, and adaptive energy-expenditure modeling.",
  alternates: {
    canonical: "https://bodyfatestimator.ai/weight-loss-calculator",
  },
};

export default function WeightLossPage() {
  return <WeightLossPageClient />;
}
