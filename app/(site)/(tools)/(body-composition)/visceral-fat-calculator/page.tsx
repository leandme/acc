import type { Metadata } from "next";
import VisceralFatCalculatorPageClient from "@/app/components/tools/composition/visceral-fat-calculator/visceral-fat-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Visceral Fat Calculator - Anthropometric VAT Estimator",
  description: "Estimate visceral fat area (VAT, cm2) from age, sex, waist, proximal thigh, height, and weight using anthropometric equations.",
  canonical: "https://bodyfatestimator.ai/visceral-fat-calculator",
});

export default function VisceralFatCalculatorPage() {
  return <VisceralFatCalculatorPageClient />;
}
