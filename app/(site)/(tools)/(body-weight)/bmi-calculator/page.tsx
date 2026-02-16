import type { Metadata } from "next";
import BMIPageClient from "@/app/components/tools/body-weight/bmi-calculator/bmi-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "BMI Calculator - Body Mass Index and Healthy Weight Range",
  description: "Use this BMI calculator to compute body mass index, check adult category ranges, and estimate your healthy-BMI weight range.",
  canonical: "https://bodyfatestimator.ai/bmi-calculator",
});

export default function BMIPage() {
  return <BMIPageClient />;
}
