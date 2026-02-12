import { Metadata } from "next";
import BodyFatCalculatorPageClient from "@/app/components/tools/composition/body-fat-calculator/body-fat-page.client";

export const metadata: Metadata = {
  title: "Body Fat Calculator | Body Fat % from Tape Measurements",
  description:
    "Calculate body fat percentage with the U.S. Navy method using height and circumference measurements. Includes category scoring, interpretation bar, and detailed guidance.",
  alternates: {
    canonical: "https://bodyfatestimator.ai/body-fat-calculator",
  },
};

export default function BodyFatCalculatorPage() {
  return <BodyFatCalculatorPageClient />;
}
