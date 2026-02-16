import type { Metadata } from "next";
import LeanBodyMassCalculatorPageClient from "@/app/components/tools/composition/lean-body-mass-calculator/lean-body-mass-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Lean Body Mass Calculator",
  description: "Estimate lean body mass from height, weight, and sex using Boer, James, and Hume equations. Compare formula outputs and interpret lean-mass percentage ranges.",
  canonical: "https://bodyfatestimator.ai/lean-body-mass-calculator",
});

export default function LeanBodyMassCalculatorPage() {
  return <LeanBodyMassCalculatorPageClient />;
}
