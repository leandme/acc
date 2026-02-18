import type { Metadata } from "next";
import BodyShapePageClient from "@/app/components/tools/composition/body-shape-calculator/body-shape-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Body Shape Calculator",
  description:
    "Estimate your body-shape category from bust/chest, waist, and hip proportions with a measurement-based calculator.",
  canonical: "https://bodyfatestimator.ai/body-shape-calculator",
});

export default function BodyShapePage() {
  return <BodyShapePageClient />;
}
