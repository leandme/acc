// app/(site)/(tools)/(body-composition)/ffmi-calculator/page.tsx
import type { Metadata } from "next";
import FFMICalculatorPageClient from "@/app/components/tools/composition/ffmi-calculator/ffmi-page.client";

export const metadata: Metadata = {
  title: "FFMI Calculator – Fat Free Mass Index",
  description:
    "FFMI Calculator is an easy way to calculate fat free mass index using height, weight, and body fat percentage. For fitness enthusiasts.",
  alternates: {
    canonical: "https://bodyfatestimator.ai/ffmi-calculator",
  },
};

export default function FFMICalculatorPage() {
  return <FFMICalculatorPageClient />;
}
