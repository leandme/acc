import { Metadata } from "next";
import Examples from "../components/home/examples";
import FAQ from "../components/home/faq";
import Comparison from "../components/home/comparison";
import ToolExplainer from "../components/home/tool-explainer";
import Hero from "../components/home/hero";
import Reviews from "../components/home/reviews";
import ToolCardLinkGrid from "../components/home/tool-card-links";
import SEOExplainer from "../components/home/seo-explainer";
import GuideCards from "../components/home/guide-cards";
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
      <Hero />
      <Examples />
      <Comparison />
      <ToolExplainer />
      <ToolCardLinkGrid columns={3} />
      <SEOExplainer />
      <Reviews />
      <FAQ />
      <GuideCards />
   </>
  );
}
