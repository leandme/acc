import type { Metadata } from "next";
import LipShapePageClient from "@/app/components/tools/face/lip-shape-detector/lip-shape-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Lip Shape Detector – Discover Your Lip Shape with AI",
  description:
    "Upload a portrait to detect lip shape, upper-lower balance, cupid's bow definition, and confidence with AI interpretation tables.",
  canonical: "https://bodyfatestimator.ai/lip-shape-detector",
});

export default function LipShapeDetectorPage() {
  return <LipShapePageClient />;
}
