import type { Metadata } from "next";
import NattyOrNotPageClient from "@/app/components/tools/composition/natty-or-not-calculator/natty-or-not-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Natty or Not Calculator",
  description:
    "Use FFMI, body fat percentage, and frame-size context to estimate whether a physique is likely natural or in a suspicious range.",
  canonical: "https://bodyfatestimator.ai/natty-or-not-calculator",
});

export default function NattyOrNotPage() {
  return <NattyOrNotPageClient />;
}
