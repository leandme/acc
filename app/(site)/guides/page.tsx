
import { Metadata } from "next";
import H1 from "@/app/components/common/h1";
import { POSTS } from "./posts";
import GuideGridWithTabs, { type GuideTab } from "@/app/components/guides/guide-grid-with-tabs";
import { buildPageMetadata } from "@/app/libs/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Body Composition Guides",
  description: "Body composition guides, photo tips, accuracy improvements, and tracking strategies for all things related to body composition.",
  canonical: "https://bodyfatestimator.ai/guides",
});

const GUIDE_TABS: GuideTab[] = [
  { key: "all", label: "All" },
  { key: "muscle", label: "Muscle" },
  { key: "height", label: "Height" },
  { key: "face", label: "Face" },
  { key: "fat", label: "Fat" },
  { key: "shape", label: "Shape" },
  { key: "weight", label: "Weight" },
  { key: "calories", label: "Calories" },
];

export default function GuidesIndexPage() {
  return (
    <main className="bg-base-100 pt-10">
      <section className="mx-auto max-w-5xl px-6">
        <H1>Body Composition Guides</H1>
      </section>

      <GuideGridWithTabs posts={POSTS} tabs={GUIDE_TABS} />
    </main>
  );
}
