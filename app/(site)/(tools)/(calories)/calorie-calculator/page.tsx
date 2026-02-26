import type { Metadata } from "next";
import CalorieCalculatorPageClient from "@/app/components/tools/calories/calorie-calculator/calorie-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Calorie Calculator – How Many Calories Do You Need?",
  description:
    "Estimate daily calories for maintenance, fat loss, or lean gain from age, sex, height, weight, equation, and activity level.",
  canonical: "https://bodyfatestimator.ai/calorie-calculator",
});

export default function CalorieCalculatorPage() {
  return <CalorieCalculatorPageClient />;
}
