import { Metadata } from "next";
import FAQ from "../components/home/faq";
import GuideCards from "../components/home/guide-cards";
import EstimatePageClient from "@/app/components/tools/composition/body-fat-estimator/estimate-page-client";
import { buildPageMetadata } from "@/app/libs/seo";

const title = "Body Fat Estimator – Estimate Body Fat % from a Photo";
const description = "Upload a photo to estimate your body fat percentage visually. A simple, repeatable way to track body fat changes over time.";

export const metadata: Metadata = buildPageMetadata({
  title: title,
  description: description,
  canonical: "https://bodyfatestimator.ai/",
});

export default function Home() {
  return (
   <>
      <EstimatePageClient basePath="/" />
      <FAQ />
      <GuideCards />
   </>
  );
}
