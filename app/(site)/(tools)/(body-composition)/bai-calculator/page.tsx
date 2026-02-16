import type { Metadata } from "next";
import BAIPageClient from "@/app/components/tools/composition/bai-calculator/bai-page.client";

export const metadata: Metadata = {
  title: "BAI Calculator – Body Adiposity Index",
  description:
    "Estimate Body Adiposity Index (BAI) using hip circumference and height. Includes sex- and age-based interpretation ranges and tracking guidance.",
  alternates: {
    canonical: "https://bodyfatestimator.ai/bai-calculator",
  },
};

export default function BAICalculatorPage() {
  return <BAIPageClient />;
}
