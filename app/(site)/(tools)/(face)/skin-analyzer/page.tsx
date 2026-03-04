import type { Metadata } from "next";
import SkinAnalyzerPageClient from "@/app/components/tools/face/skin-analyzer/skin-analyzer-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Skin Analyzer – AI Skin Type Analysis",
  description:
    "Upload a portrait to analyze skin type, tone, undertone, hydration cues, confidence score, and practical skincare direction with AI.",
  canonical: "https://bodyfatestimator.ai/skin-analyzer",
});

export default function SkinAnalyzerPage() {
  return <SkinAnalyzerPageClient />;
}
