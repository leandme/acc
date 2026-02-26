import type { Metadata } from "next";
import HairColorPageClient from "@/app/components/tools/face/hair-color-detector/hair-color-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Hair Color Detector",
  description:
    "Upload a portrait to detect likely hair color, undertone, depth, and confidence with AI interpretation tables.",
  canonical: "https://bodyfatestimator.ai/hair-color-detector",
});

export default function HairColorDetectorPage() {
  return <HairColorPageClient />;
}
