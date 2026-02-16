import type { Metadata } from "next";
import BRIPageClient from "@/app/components/tools/composition/bri-calculator/bri-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "BRI Calculator – Body Roundness Index",
  description: "Calculate Body Roundness Index (BRI) from waist circumference and height. Interpret your result with practical roundness ranges and tracking guidance.",
  canonical: "https://bodyfatestimator.ai/bri-calculator",
});

export default function BRICalculatorPage() {
  return <BRIPageClient />;
}
