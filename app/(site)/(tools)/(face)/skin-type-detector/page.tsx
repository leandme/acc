import type { Metadata } from "next";
import SkinTypePageClient from "@/app/components/tools/face/skin-type-detector/skin-type-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Skin Type Detector",
  description:
    "Upload a portrait to detect likely skin type with AI, confidence scoring, interpretation tables, and routine guidance.",
  canonical: "https://bodyfatestimator.ai/skin-type-detector",
});

export default function SkinTypeDetectorPage() {
  return <SkinTypePageClient />;
}
