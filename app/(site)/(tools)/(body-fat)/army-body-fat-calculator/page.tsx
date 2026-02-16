import { Metadata } from "next";
import ArmyBodyFatCalculatorPageClient from "@/app/components/tools/composition/army-body-fat-calculator/army-body-fat-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Army Body Fat Calculator | U.S. Army One-Site Method",
  description: "Calculate estimated body fat with the U.S. Army one-site method using abdomen circumference and body weight, with Army age/sex standard checks and guidance.",
  canonical: "https://bodyfatestimator.ai/army-body-fat-calculator",
});

export default function ArmyBodyFatCalculatorPage() {
  return <ArmyBodyFatCalculatorPageClient />;
}
