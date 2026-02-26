import type { Metadata } from "next";
import EyeShapePageClient from "@/app/components/tools/face/eye-shape-detector/eye-shape-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Eye Shape Detector – Eye Colour, Canthal Tilt & Shape",
  description:
    "Upload a portrait to detect eye shape, eye color, and canthal tilt with AI, confidence scoring, and interpretation tables.",
  canonical: "https://bodyfatestimator.ai/eye-shape-detector",
});

export default function EyeShapeDetectorPage() {
  return <EyeShapePageClient />;
}
