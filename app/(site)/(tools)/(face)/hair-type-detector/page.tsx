import type { Metadata } from "next";
import HairTypePageClient from "@/app/components/tools/face/hair-type-detector/hair-type-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Hair Type Detector – AI Alternative to Hair Quiz or Test",
  description:
    "Upload a portrait to detect likely hair type (1A-4C) with AI confidence scoring, interpretation tables, and practical care-direction context.",
  canonical: "https://bodyfatestimator.ai/hair-type-detector",
});

export default function HairTypeDetectorPage() {
  return <HairTypePageClient />;
}
