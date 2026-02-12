import type { Metadata } from "next";
import EstimatePageClient from "@/app/components/tools/composition/body-fat-estimator/estimate-page-client";

export const metadata: Metadata = {
  title: "Estimate Body Fat %",
  description:
    "Estimate your body fat percentage from a photo. Upload an image to get a fast, free estimate and refine it for higher accuracy.",
  alternates: {
    canonical: "https://bodyfatestimator.ai/estimate",
  },
};

export default function Page() {
  return <EstimatePageClient />;
}
