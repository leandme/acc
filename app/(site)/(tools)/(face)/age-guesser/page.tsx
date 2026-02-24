import type { Metadata } from "next";
import AgeGuesserPageClient from "@/app/components/tools/face/age-guesser/age-guesser-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Age Guesser – How Old Do I Look?",
  description:
    "Upload a face photo and estimate apparent age with AI. Get an age range, confidence score, and interpretation table.",
  canonical: "https://bodyfatestimator.ai/age-guesser",
});

export default function AgeGuesserPage() {
  return <AgeGuesserPageClient />;
}
