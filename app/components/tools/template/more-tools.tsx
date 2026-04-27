"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/app/libs/amplitude";
import type { ToolCategory } from "@/app/(site)/(tools)/tools";
import { getToolCategoryMeta } from "@/app/(site)/(tools)/tools";
import { getToolsByCategory } from "@/app/(site)/(tools)/tools";
import { getToolsByCategories } from "@/app/(site)/(tools)/tools";
import { TOOLS } from "@/app/(site)/(tools)/tools";
import { ToolMeta } from "@/app/(site)/(tools)/tools";
import { pickTools } from "@/app/(site)/(tools)/tools";

const LOW_LINK_TOOL_SLUGS = new Set<string>([
  "overweight-calculator",
  "broca-index-calculator",
  "ponderal-index-calculator",
  "adjusted-body-weight-calculator",
  "fasting-weight-loss-calculator",
  "intermittent-fasting-calculator",
  "steps-to-calories-calculator",
  "muscle-mass-calculator",
  "natty-or-not-calculator",
  "muscular-potential-calculator",
  "casey-butt-calculator",
  "bodybuilding-genetics-calculator",
  "lip-shape-detector",
  "height-calculator",
  "height-estimator",
  "mid-parental-height-calculator",
]);

function promoteLowLinkTool(
  list: ToolMeta[],
  maxItems: number
) {
  if (list.length <= maxItems) return list;

  const top = list.slice(0, maxItems);
  const topHasLowLink = top.some((t) => LOW_LINK_TOOL_SLUGS.has(t.slug));
  if (topHasLowLink) return top;

  const candidate = list
    .slice(maxItems)
    .find((t) => LOW_LINK_TOOL_SLUGS.has(t.slug));

  if (!candidate) return top;

  const promoted = [...top];
  promoted[promoted.length - 1] = candidate;
  return promoted;
}

type Props = {
  heading?: string;
  columns?: 2 | 3 | 4;
  maxItems?: number;

  /** Option A: pick by categories */
  categories?: ToolCategory[];

  /** Option B: pick explicit tools by slug */
  toolSlugs?: string[];

  /** Don’t show the tool you’re currently on */
  excludeSlug?: string;

  className?: string;
};

export function MoreTools({
  heading = "More Tools",
  columns = 2,
  maxItems = 4,
  categories,
  toolSlugs,
  excludeSlug,
  className = "",
}: Props) {
  const pathname = usePathname();
  const currentSlugFromPath = useMemo(() => {
    const firstSegment = pathname?.split("/").filter(Boolean)[0];
    if (!firstSegment) return null;
    return TOOLS[firstSegment]?.slug ?? null;
  }, [pathname]);

  const currentTool = currentSlugFromPath ? TOOLS[currentSlugFromPath] : null;
  const currentCategoryMeta = currentTool
    ? getToolCategoryMeta(currentTool.category)
    : null;

  const tools = useMemo(() => {
    let list: ToolMeta[] = [];

    if (currentTool) {
      // On tool pages, keep recommendations inside the same topical cluster.
      list = getToolsByCategory(currentTool.category);
    } else if (toolSlugs?.length) list = pickTools(toolSlugs);
    else if (categories?.length) list = getToolsByCategories(categories);

    // Remove duplicates by slug (in case you mix approaches later)
    const seen = new Set<string>();
    list = list.filter((t) => {
      if (seen.has(t.slug)) return false;
      seen.add(t.slug);
      return true;
    });

    // Exclude current page (auto on tool pages, manual fallback elsewhere).
    const excluded = currentTool?.slug ?? excludeSlug;
    if (excluded) list = list.filter((t) => t.slug !== excluded);

    return promoteLowLinkTool(list, maxItems);
  }, [currentTool, toolSlugs, categories, excludeSlug, maxItems]);

  const gridCols =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : "sm:grid-cols-2";

  if (!tools.length) return null;

  const headingLabel = currentCategoryMeta
    ? `More ${currentCategoryMeta.h1}`
    : heading;
  const headingHref = currentCategoryMeta
    ? `/tools/${currentCategoryMeta.slug}`
    : "/tools";

  const isRedundantSingleFatTool =
    headingLabel === "More Fat Tools" &&
    tools.length === 1 &&
    tools[0]?.slug === "estimate";
  if (isRedundantSingleFatTool) return null;

  return (
    <>
      <section className={`mt-14 border-t pt-10 ${className}`}>
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">
          <Link className="hover:underline" href={headingHref}>
            {headingLabel} →
          </Link>
        </h2>

        <div className={`mt-6 grid gap-6 ${gridCols}`}>
          {tools.map((t) => (
            <Link
              key={t.slug}
              href={`/${t.slug}`}
              onClick={() => {
                trackEvent("Go to Tool", {
                  tool: t.title.toLowerCase(),
                  source: "more tools",
                });
              }}
              className="group rounded-2xl border bg-white transition hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 group-hover:underline">
                  {t.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 leading-snug">
                        {t.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
