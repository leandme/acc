import type { Metadata } from "next";
import MuscleMassPageClient from "@/app/components/tools/composition/muscle-mass-calculator/muscle-mass-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Muscle Mass Calculator - Estimate Skeletal Muscle %",
  description:
    "Estimate skeletal muscle mass in kilograms and percentage using anthropometric measurements, skinfolds, and validated research equations.",
  canonical: "https://bodyfatestimator.ai/muscle-mass-calculator",
});

export default function MuscleMassCalculatorPage() {
  return <MuscleMassPageClient />;
}
