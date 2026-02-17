import type { Metadata } from "next";
import MacroPageClient from "@/app/components/tools/calories/macro-calculator/macro-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Macro Calculator",
  description:
    "Estimate daily macro targets from maintenance calories, calorie adjustment, and macro split presets.",
  canonical: "https://bodyfatestimator.ai/macro-calculator",
});

export default function MacroPage() {
  return <MacroPageClient />;
}

