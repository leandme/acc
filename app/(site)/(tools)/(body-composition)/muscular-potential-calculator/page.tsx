import type { Metadata } from "next";
import MuscularPotentialPageClient from "@/app/components/tools/composition/muscular-potential-calculator/muscular-potential-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Muscular Potential Calculator",
  description:
    "Estimate modelled natural lean-mass potential using height, frame size, body fat, and FFMI-based ceilings.",
  canonical: "https://bodyfatestimator.ai/muscular-potential-calculator",
});

export default function MuscularPotentialPage() {
  return <MuscularPotentialPageClient />;
}
