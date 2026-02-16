import type { Metadata } from "next";
import BRIPageClient from "@/app/components/tools/composition/bri-calculator/bri-page.client";

export const metadata: Metadata = {
  title: "BRI Calculator – Body Roundness Index",
  description:
    "Calculate Body Roundness Index (BRI) from waist circumference and height. Interpret your result with practical roundness ranges and tracking guidance.",
  alternates: {
    canonical: "https://bodyfatestimator.ai/bri-calculator",
  },
};

export default function BRICalculatorPage() {
  return <BRIPageClient />;
}
