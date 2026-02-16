import type { Metadata } from "next";
import SkinfoldBodyFatPageClient from "@/app/components/tools/composition/skinfold-body-fat-calculator/skinfold-page.client";

export const metadata: Metadata = {
  title: "Skinfold Body Fat Calculator",
  description:
    "Estimate body fat from 3-site skinfold measurements using Jackson-Pollock equations and Siri conversion. Includes range interpretation and measurement guidance.",
  alternates: {
    canonical: "https://bodyfatestimator.ai/skinfold-body-fat-calculator",
  },
};

export default function SkinfoldBodyFatCalculatorPage() {
  return <SkinfoldBodyFatPageClient />;
}
