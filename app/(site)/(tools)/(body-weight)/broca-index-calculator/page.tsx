import type { Metadata } from "next";
import BrocaPageClient from "@/app/components/tools/body-weight/broca-index-calculator/broca-page.client";

export const metadata: Metadata = {
  title: "Broca Index Calculator",
  description:
    "Calculate Broca reference weight from height and compare current weight against this historical benchmark.",
  alternates: {
    canonical: "https://bodyfatestimator.ai/broca-index-calculator",
  },
};

export default function BrocaIndexPage() {
  return <BrocaPageClient />;
}
