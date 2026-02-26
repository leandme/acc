import type { Metadata } from "next";
import ApeIndexPageClient from "@/app/components/tools/body-proportions/ape-index-calculator/ape-index-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Ape Index Calculator – Wingspan to Height Ratio",
  description:
    "Calculate ape index from wingspan and height using both ratio and difference methods, with interpretation ranges.",
  canonical: "https://bodyfatestimator.ai/ape-index-calculator",
});

export default function ApeIndexPage() {
  return <ApeIndexPageClient />;
}
