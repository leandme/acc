import type { Metadata } from "next";
import CaloriesBurnedPageClient from "@/app/components/tools/calories/calories-burned-calculator/calories-burned-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Calories Burned Calculator",
  description:
    "Estimate calories burned across walking, running, cycling, HIIT, lifting, and other activities with MET-based math.",
  canonical: "https://bodyfatestimator.ai/calories-burned-calculator",
});

export default function CaloriesBurnedPage() {
  return <CaloriesBurnedPageClient />;
}
