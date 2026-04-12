import type { Metadata } from "next";
import CalorieCounterPageClient from "@/app/components/tools/calories/calorie-counter/calorie-counter-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Calorie Counter Powered by AI",
  description:
    "AI food scanner and calorie counter from a photo. Get fast calorie and macros estimates for any meal.",
  canonical: "https://bodyfatestimator.ai/calorie-counter",
});

export default function CalorieCounterPage() {
  return <CalorieCounterPageClient />;
}
