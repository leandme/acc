import { Metadata } from "next";
import { Suspense } from "react";
import H1 from "@/app/components/common/h1";
import { TOOLS } from "../tools";
import ToolsGridWithTabs from "@/app/components/tools/tools-grid-with-tabs";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Browse all tools on BodyFatEstimator.ai — calculators, estimators, and visualizers.",
  alternates: {
    canonical: "https://bodyfatestimator.ai/tools",
  },
  robots: { index: true, follow: true },
};

export default function ToolsIndexPage() {
  const allTools = Object.values(TOOLS).sort((a, b) => a.title.localeCompare(b.title));

  return (
    <main className="bg-base-100 pt-10">
      <section className="mx-auto max-w-5xl px-6">
        <H1>Tools</H1>
      </section>

      <Suspense fallback={<section className="pt-4 mx-auto max-w-5xl px-6 pb-20" />}>
        <ToolsGridWithTabs tools={allTools} />
      </Suspense>
    </main>
  );
}
