import type { Metadata } from "next";
import GoldenFaceRatioPageClient from "@/app/components/tools/face/golden-face-ratio-analyzer/golden-face-ratio-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Golden Face Ratio Analyzer",
  description:
    "Upload a portrait to analyze facial golden-ratio alignment with AI, then compare with a manual ratio calculator.",
  canonical: "https://bodyfatestimator.ai/golden-face-ratio-analyzer",
});

export default function GoldenFaceRatioAnalyzerPage() {
  return <GoldenFaceRatioPageClient />;
}
