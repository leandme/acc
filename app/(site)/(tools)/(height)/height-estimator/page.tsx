import type { Metadata } from "next";
import HeightEstimatorPageClient from "@/app/components/tools/height/height-estimator/height-estimator-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Height Estimator – Estimate Height from a Photo",
  description:
    "Estimate apparent adult height from a full-body photo with confidence rating, plausible range, and practical accuracy guidance.",
  canonical: "https://bodyfatestimator.ai/height-estimator",
});

export default function HeightEstimatorPage() {
  return <HeightEstimatorPageClient />;
}
