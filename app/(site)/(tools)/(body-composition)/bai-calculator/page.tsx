import type { Metadata } from "next";
import BAIPageClient from "@/app/components/tools/composition/bai-calculator/bai-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "BAI Calculator – Body Adiposity Index",
  description: "Estimate Body Adiposity Index (BAI) using hip circumference and height. Includes sex- and age-based interpretation ranges and tracking guidance.",
  canonical: "https://bodyfatestimator.ai/bai-calculator",
});

export default function BAICalculatorPage() {
  return <BAIPageClient />;
}
