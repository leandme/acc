import { Metadata } from "next";
import H1 from "@/app/components/common/h1";
import GuideGridWithTabs from "@/app/components/guides/guide-grid-with-tabs";
import { POSTS } from "./posts";
import { buildPageMetadata } from "@/app/libs/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "AI Calorie Counter Blog",
  description:
    "Tips, guides, and insights on AI calorie estimation, food-photo tracking accuracy, and practical nutrition habits.",
  canonical: "https://ai-calorie-counter.com/blog",
});

export default function BlogIndexPage() {
  return (
    <main className="bg-base-100 pt-10">
      <section className="mx-auto max-w-5xl px-6">
        <H1>AI Calorie Counter Blog</H1>
      </section>

      <GuideGridWithTabs posts={POSTS} />
    </main>
  );
}
