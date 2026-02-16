import type { Metadata } from "next";
import BrocaPageClient from "@/app/components/tools/body-weight/broca-index-calculator/broca-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Broca Index Calculator",
  description: "Calculate Broca reference weight from height and compare current weight against this historical benchmark.",
  canonical: "https://bodyfatestimator.ai/broca-index-calculator",
});

export default function BrocaIndexPage() {
  return <BrocaPageClient />;
}
