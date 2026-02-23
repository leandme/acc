import type { Metadata } from "next";
import BodybuildingGeneticsPageClient from "@/app/components/tools/composition/bodybuilding-genetics-calculator/bodybuilding-genetics-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Bodybuilding Genetics Calculator",
  description:
    "Estimate a modelled bodybuilding genetics score using frame structure, projected FFMI potential, and current execution context.",
  canonical: "https://bodyfatestimator.ai/bodybuilding-genetics-calculator",
});

export default function BodybuildingGeneticsCalculatorPage() {
  return <BodybuildingGeneticsPageClient />;
}
