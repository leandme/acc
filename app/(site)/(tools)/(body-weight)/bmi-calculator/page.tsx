import type { Metadata } from "next";
import BMIPageClient from "@/app/components/tools/body-weight/bmi-calculator/bmi-page.client";

export const metadata: Metadata = {
  title: "BMI calculator",
  description:
    "Use this BMI calculator to compute body mass index, check adult category ranges, and estimate healthy-BMI weight range.",
  alternates: {
    canonical: "https://bodyfatestimator.ai/bmi-calculator",
  },
};

export default function BMIPage() {
  return <BMIPageClient />;
}
