import type { Metadata } from "next";
import TDEEPageClient from "@/app/components/tools/body-weight/tdee-calculator/tdee-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "TDEE Calculator – Find Out Your Daily Expenditure",
  description:
    "Estimate your total daily energy expenditure (TDEE) from age, sex, height, weight, equation choice, and activity level.",
  canonical: "https://bodyfatestimator.ai/tdee-calculator",
});

export default function TDEEPage() {
  return <TDEEPageClient />;
}
