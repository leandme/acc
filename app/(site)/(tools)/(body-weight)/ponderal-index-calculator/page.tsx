import type { Metadata } from "next";
import PonderalPageClient from "@/app/components/tools/body-weight/ponderal-index-calculator/ponderal-page.client";

export const metadata: Metadata = {
  title: "Ponderal Index Calculator",
  description:
    "Calculate ponderal index (Rohrer index) from height and weight, with BMI-equivalent interpretation.",
  alternates: {
    canonical: "https://bodyfatestimator.ai/ponderal-index-calculator",
  },
};

export default function PonderalIndexPage() {
  return <PonderalPageClient />;
}
