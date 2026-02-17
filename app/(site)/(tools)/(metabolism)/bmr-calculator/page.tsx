import type { Metadata } from "next";
import BMRPageClient from "@/app/components/tools/metabolism/bmr-calculator/bmr-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "BMR Calculator – Basal Metabolic Rate (Metabolism)",
  description:
    "Estimate basal metabolic rate (BMR) using Mifflin-St Jeor and revised Harris-Benedict equations.",
  canonical: "https://bodyfatestimator.ai/bmr-calculator",
});

export default function BMRPage() {
  return <BMRPageClient />;
}
