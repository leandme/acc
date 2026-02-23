import type { Metadata } from "next";
import CaseyButtPageClient from "@/app/components/tools/composition/casey-butt-calculator/casey-butt-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Casey Butt Calculator",
  description:
    "Estimate frame-based bodybuilding potential using a Casey Butt style anthropometric model with wrist, ankle, and height.",
  canonical: "https://bodyfatestimator.ai/casey-butt-calculator",
});

export default function CaseyButtCalculatorPage() {
  return <CaseyButtPageClient />;
}
