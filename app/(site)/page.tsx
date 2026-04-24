import { Metadata } from "next";
import FAQ from "../components/home/faq";
import CTA from "../components/common/cta";
import EstimatePageClient from "@/app/components/tools/composition/body-fat-estimator/estimate-page-client";
import { buildPageMetadata } from "@/app/libs/seo";

const title = "Body Fat Estimator AI – Calculate Body Fat % from Photo";
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
      <div className="mx-auto max-w-6xl px-6">
        <CTA
          title="See Your Body Shape in 3D"
          description="Use the Body Visualizer to explore how BMI, body fat %, height, and weight can change overall appearance."
          buttonText="Try Body Fat Visualizer →"
          href="/body-visualizer"
        />
      </div>
   </>
  );
}
