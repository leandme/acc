import type { Metadata } from "next";
import BodyFrameSizePageClient from "@/app/components/tools/composition/body-frame-size-calculator/frame-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Body Frame Size Calculator",
  description: "Estimate your body frame size from height and wrist circumference using sex-specific frame-ratio thresholds. Includes interpretation ranges and measurement guidance.",
  canonical: "https://bodyfatestimator.ai/body-frame-size-calculator",
});

export default function BodyFrameSizeCalculatorPage() {
  return <BodyFrameSizePageClient />;
}
