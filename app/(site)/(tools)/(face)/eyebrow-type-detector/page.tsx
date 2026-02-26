import type { Metadata } from "next";
import EyebrowTypePageClient from "@/app/components/tools/face/eyebrow-type-detector/eyebrow-type-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Eyebrow Type Detector",
  description:
    "Upload a portrait to detect eyebrow type with AI, confidence scoring, symmetry context, and grooming-oriented interpretation.",
  canonical: "https://bodyfatestimator.ai/eyebrow-type-detector",
});

export default function EyebrowTypeDetectorPage() {
  return <EyebrowTypePageClient />;
}
