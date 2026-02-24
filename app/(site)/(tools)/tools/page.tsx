import { Metadata } from "next";
import H1 from "@/app/components/common/h1";
import {
  TOOLS,
  getToolCategoryMetaBySlug,
  getToolCategoryTabs,
} from "../tools";
import ToolsGridWithTabs from "@/app/components/tools/tools-grid-with-tabs";
import { buildPageMetadata } from "@/app/libs/seo";
import { redirect } from "next/navigation";

export const metadata: Metadata = buildPageMetadata({
  title: "Tools",
  description: "Browse all tools on BodyFatEstimator.ai — calculators, estimators, and visualizers.",
  canonical: "https://bodyfatestimator.ai/tools",
  robots: { index: true, follow: true },
});

type SearchParamsInput = {
  tag?: string | string[];
};

export default async function ToolsIndexPage({
  searchParams,
}: {
  searchParams?: SearchParamsInput | Promise<SearchParamsInput>;
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const legacyTag = Array.isArray(resolvedSearchParams?.tag)
    ? resolvedSearchParams.tag[0]
    : resolvedSearchParams?.tag;
  if (legacyTag === "all") redirect("/tools");
  if (legacyTag) {
    const legacyCategory = getToolCategoryMetaBySlug(legacyTag);
    if (legacyCategory) redirect(`/tools/${legacyCategory.slug}`);
  }

  const tabs = getToolCategoryTabs();
  const allTools = Object.values(TOOLS).sort((a, b) => a.title.localeCompare(b.title));

  return (
    <main className="bg-base-100 pt-10">
      <section className="mx-auto max-w-5xl px-6">
        <H1>Tools</H1>
      </section>

      <ToolsGridWithTabs tools={allTools} tabs={tabs} activeTab="all" />
    </main>
  );
}
