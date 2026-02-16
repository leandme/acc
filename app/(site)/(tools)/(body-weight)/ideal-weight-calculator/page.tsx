import type { Metadata } from "next";
import IdealWeightPageClient from "@/app/components/tools/body-weight/ideal-weight-calculator/ideal-weight-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Ideal Weight Calculator - What is my Healthy Weight?",
  description: "Estimate healthy-weight range from BMI and compare with Devine ideal body weight reference.",
  canonical: "https://bodyfatestimator.ai/ideal-weight-calculator",
});

export default function IdealWeightPage() {
  return <IdealWeightPageClient />;
}
