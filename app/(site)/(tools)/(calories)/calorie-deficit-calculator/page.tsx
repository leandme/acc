import type { Metadata } from "next";
import CalorieDeficitPageClient from "@/app/components/tools/calories/calorie-deficit-calculator/calorie-deficit-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Calorie Deficit Calculator – For Weight Loss Goals",
  description:
    "Calculate calorie-deficit targets from maintenance intake and projected weekly body-weight loss pace.",
  canonical: "https://bodyfatestimator.ai/calorie-deficit-calculator",
});

export default function CalorieDeficitPage() {
  return <CalorieDeficitPageClient />;
}
