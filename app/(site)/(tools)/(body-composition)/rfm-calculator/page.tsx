import type { Metadata } from "next";
import RFMCalculatorPageClient from "@/app/components/tools/composition/rfm-calculator/rfm-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "RFM Calculator – Relative Fat Mass",
  description: "Calculate Relative Fat Mass (RFM) using height, waist, and sex. Get a whole-number body fat estimate with category ranges.",
  canonical: "https://bodyfatestimator.ai/rfm-calculator",
});

export default function RFMCalculatorPage() {
  return <RFMCalculatorPageClient />;
}
