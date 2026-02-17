import type { Metadata } from "next";
import IntermittentFastingPageClient from "@/app/components/tools/calories/intermittent-fasting-calculator/intermittent-fasting-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Intermittent Fasting Calculator – Find Out Your Daily Expenditure",
  description:
    "Estimate daily expenditure, fasting-adjusted intake, and projected weekly weight-change pace for common intermittent fasting protocols.",
  canonical: "https://bodyfatestimator.ai/intermittent-fasting-calculator",
});

export default function IntermittentFastingCalculatorPage() {
  return <IntermittentFastingPageClient />;
}
