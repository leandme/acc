import type { Metadata } from "next";
import VisceralFatCalculatorPageClient from "@/app/components/tools/composition/visceral-fat-calculator/visceral-fat-page.client";

export const metadata: Metadata = {
  title: "Visceral Fat Calculator - Anthropometric VAT Estimator",
  description:
    "Estimate visceral fat area (VAT, cm2) from age, sex, waist, proximal thigh, height, and weight using anthropometric equations.",
  alternates: {
    canonical: "https://bodyfatestimator.ai/visceral-fat-calculator",
  },
};

export default function VisceralFatCalculatorPage() {
  return <VisceralFatCalculatorPageClient />;
}
