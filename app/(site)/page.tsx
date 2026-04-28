import { Metadata } from "next";
import CalorieCounterPageClient from "@/app/components/tools/calories/calorie-counter/calorie-counter-page.client";
import { buildPageMetadata } from "@/app/libs/seo";
import FAQ from "@/app/components/home/faq";
import GuideCards from "@/app/components/home/guide-cards";

const title = "Skoy – AI Calorie Counter App";
const description = "AI-Calorie-Counter.com is a free AI-powered calorie tracker & counter. Simply snap a photo to track calorie data!";

export const metadata: Metadata = buildPageMetadata({
  title: title,
  description: description,
  canonical: "https://ai-calorie-counter.com/",
});

export default function Home() {
  return (
    <>
      <CalorieCounterPageClient basePath="/" />
      <FAQ />
      <GuideCards />
    </>
  );
}
