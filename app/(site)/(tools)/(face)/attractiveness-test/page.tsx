import type { Metadata } from "next";
import AttractivenessTestPageClient from "@/app/components/tools/face/attractiveness-test/attractiveness-test-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Attractiveness Test – AI Face Rater & Analyzer",
  description:
    "Upload a portrait to get an AI attractiveness score, confidence rating, interpretation bar, and detailed result table.",
  canonical: "https://bodyfatestimator.ai/attractiveness-test",
});

export default function AttractivenessTestPage() {
  return <AttractivenessTestPageClient />;
}
