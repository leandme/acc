import type { Metadata } from "next";
import StepsToCaloriesPageClient from "@/app/components/tools/body-weight/steps-to-calories-calculator/steps-to-calories-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Steps to Calorie Calculator",
  description:
    "Estimate calories burned from steps using body weight, walking cadence, and stride-length distance estimation.",
  canonical: "https://bodyfatestimator.ai/steps-to-calories-calculator",
});

export default function StepsToCaloriesPage() {
  return <StepsToCaloriesPageClient />;
}

