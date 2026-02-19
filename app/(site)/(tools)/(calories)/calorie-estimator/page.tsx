import type { Metadata } from "next";
import CalorieEstimatorPageClient from "@/app/components/tools/calories/calorie-estimator/calorie-estimator-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Calorie Estimator – AI Calorie Counter from a Photo",
  description:
    "Upload a meal photo and estimate calories with confidence bands, item-level breakdown, and practical accuracy tips.",
  canonical: "https://bodyfatestimator.ai/calorie-estimator",
});

export default function CalorieEstimatorPage() {
  return <CalorieEstimatorPageClient />;
}

