import type { Metadata } from "next";
import EstimatePageClient from "@/app/components/tools/composition/body-fat-estimator/estimate-page-client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Estimate Body Fat %",
  description: "Estimate your body fat percentage from a photo. Upload an image to get a fast, free estimate and refine it for higher accuracy.",
  canonical: "https://bodyfatestimator.ai/",
  robots: {
    index: false,
    follow: true,
  },
});

export default function Page() {
  return <EstimatePageClient />;
}
