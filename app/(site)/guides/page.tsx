
import { Metadata } from "next";
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
      </section>

      <GuideGridWithTabs posts={POSTS} />
    </main>
  );
}
