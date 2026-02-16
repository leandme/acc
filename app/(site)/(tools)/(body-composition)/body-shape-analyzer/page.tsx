import type { Metadata } from "next";
import BodyShapeAnalyzerPageClient from "@/app/components/tools/composition/body-shape-analyzer/body-shape-page.client";

export const metadata: Metadata = {
  title: "Body Shape Analyzer – What's Your Body Type?",
  description:
    "Upload a photo to analyze your body shape and get practical guidance based on your visual proportions.",
  alternates: {
    canonical: "https://bodyfatestimator.ai/body-shape-analyzer",
  },
};

export default function BodyShapeAnalyzerPage() {
  return <BodyShapeAnalyzerPageClient />;
}

