import type { Metadata } from "next";
import OverweightPageClient from "@/app/components/tools/body-weight/overweight-calculator/overweight-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Overweight Calculator (BMI-Based) - Weight Above Healthy Range",
  description: "Use this overweight calculator to estimate how many kg your current weight sits above the upper healthy BMI boundary for your height.",
  canonical: "https://bodyfatestimator.ai/overweight-calculator",
});

export default function OverweightPage() {
  return <OverweightPageClient />;
}
