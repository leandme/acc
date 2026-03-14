import type { Metadata } from "next";
import JawlineCheckPageClient from "@/app/components/tools/face/jawline-check/jawline-check-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Jawline Check – Jawline Calculator & Detector",
  description:
    "Upload a side-profile photo to estimate jawline angle and classify jawline type with AI. Get confidence scoring, landmark overlay, and interpretation table.",
  canonical: "https://bodyfatestimator.ai/jawline-check",
});

export default function JawlineCheckPage() {
  return <JawlineCheckPageClient />;
}
