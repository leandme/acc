import type { Metadata } from "next";
import BodyShapeAnalyzerPageClient from "@/app/components/tools/composition/body-shape-analyzer/body-shape-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Body Shape Analyzer – What's Your Body Type?",
  description: "Upload a photo to analyze your body shape and get practical guidance based on your visual proportions.",
  canonical: "https://bodyfatestimator.ai/body-shape-analyzer",
});

export default function BodyShapeAnalyzerPage() {
  return <BodyShapeAnalyzerPageClient />;
}

