import type { Metadata } from "next";
import FaceShapePageClient from "@/app/components/tools/face/face-shape-detector/face-shape-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Face Shape Detector – Free AI Face Analyzer",
  description:
    "Upload a portrait to detect your face shape with AI. Get category result, confidence score, interpretation table, and practical styling guidance.",
  canonical: "https://bodyfatestimator.ai/face-shape-detector",
});

export default function FaceShapeDetectorPage() {
  return <FaceShapePageClient />;
}
