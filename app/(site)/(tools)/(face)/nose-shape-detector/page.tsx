import type { Metadata } from "next";
import NoseShapePageClient from "@/app/components/tools/face/nose-shape-detector/nose-shape-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Nose Shape Detector",
  description:
    "Upload a portrait to detect nose shape, bridge profile, and tip direction with AI, confidence scoring, and interpretation tables.",
  canonical: "https://bodyfatestimator.ai/nose-shape-detector",
});

export default function NoseShapeDetectorPage() {
  return <NoseShapePageClient />;
}
