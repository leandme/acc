import type { Metadata } from "next";
import OverweightPageClient from "@/app/components/tools/body-weight/overweight-calculator/overweight-page.client";

export const metadata: Metadata = {
  title: "Overweight Calculator",
  description:
    "Use this overweight calculator to check BMI category and estimate weight above the healthy BMI range.",
  alternates: {
    canonical: "https://bodyfatestimator.ai/overweight-calculator",
  },
};

export default function OverweightPage() {
  return <OverweightPageClient />;
}
