
import { Metadata } from "next";
import Link from "next/link";
import H1 from "@/app/components/common/h1";
import { POSTS } from "./posts";
import GuideGridWithTabs from "@/app/components/guides/guide-grid-with-tabs";
import { buildPageMetadata } from "@/app/libs/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Body Composition Guides",
  description: "Body composition guides, photo tips, accuracy improvements, and tracking strategies for all things related to body composition.",
  canonical: "https://bodyfatestimator.ai/guides",
});

export default function GuidesIndexPage() {
  return (
    <main className="bg-base-100 pt-10">
      <section className="mx-auto max-w-5xl px-6">
        <H1>Body Composition Guides</H1>
        <p className="mt-4 text-gray-700 text-lg">
          Start with the highest-use tools, then use the guides for deeper context.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Link href="/body-visualizer" className="rounded-xl border bg-white px-4 py-3 text-center font-semibold text-gray-800 hover:border-primary hover:text-primary transition">
            Body Visualizer
          </Link>
          <Link href="/body-shape-analyzer" className="rounded-xl border bg-white px-4 py-3 text-center font-semibold text-gray-800 hover:border-primary hover:text-primary transition">
            Body Shape Analyzer
          </Link>
          <Link href="/body-fat-calculator" className="rounded-xl border bg-white px-4 py-3 text-center font-semibold text-gray-800 hover:border-primary hover:text-primary transition">
            Body Fat Calculator
          </Link>
          <Link href="/ffmi-calculator" className="rounded-xl border bg-white px-4 py-3 text-center font-semibold text-gray-800 hover:border-primary hover:text-primary transition">
            FFMI Calculator
          </Link>
          <Link href="/calorie-estimator" className="rounded-xl border bg-white px-4 py-3 text-center font-semibold text-gray-800 hover:border-primary hover:text-primary transition">
            Calorie Estimator
          </Link>
        </div>
      </section>

      <GuideGridWithTabs posts={POSTS} />
    </main>
  );
}
