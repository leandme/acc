import type { Metadata } from "next";
import { notFound } from "next/navigation";
import H1 from "@/app/components/common/h1";
import ToolsGridWithTabs from "@/app/components/tools/tools-grid-with-tabs";
import ToolCategorySeoSection from "@/app/components/tools/category-seo-section";
import {
  getToolCategoryMetaBySlug,
  getToolCategoryTabs,
  getToolsByCategory,
  toolCategoryArray,
} from "../../tools";
import { buildPageMetadata } from "@/app/libs/seo";

type Params = {
  category: string;
};

export function generateStaticParams() {
  return toolCategoryArray().map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params | Promise<Params>;
}): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const category = getToolCategoryMetaBySlug(resolvedParams.category);
  if (!category) {
    return buildPageMetadata({
      title: "Tools",
      description: "Browse all tools on BodyFatEstimator.ai.",
      canonical: "https://bodyfatestimator.ai/tools",
      robots: { index: false, follow: false },
    });
  }

  return buildPageMetadata({
    title: category.h1,
    description: category.description,
    canonical: `https://bodyfatestimator.ai/tools/${category.slug}`,
    robots: { index: true, follow: true },
  });
}

export default async function ToolCategoryPage({
  params,
}: {
  params: Params | Promise<Params>;
}) {
  const resolvedParams = await Promise.resolve(params);
  const category = getToolCategoryMetaBySlug(resolvedParams.category);
  if (!category) notFound();

  const tabs = getToolCategoryTabs();
  const tools = getToolsByCategory(category.category).sort((a, b) => a.title.localeCompare(b.title));

  return (
    <main className="bg-base-100 pt-10">
      <section className="mx-auto max-w-5xl px-6">
        <H1>{category.h1}</H1>
      </section>

      <ToolsGridWithTabs
        tools={tools}
        tabs={tabs}
        activeTab={category.slug}
      />

      <ToolCategorySeoSection category={category} toolCount={tools.length} />
    </main>
  );
}
