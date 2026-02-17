"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { trackEvent } from "@/app/libs/amplitude";
import type { ToolCategory } from "@/app/(site)/(tools)/tools";
import { getToolsByCategories } from "@/app/(site)/(tools)/tools";
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
  const tools = useMemo(() => {
    let list: ToolMeta[] = [];

    if (toolSlugs?.length) list = pickTools(toolSlugs);
    else if (categories?.length) list = getToolsByCategories(categories);

    // Remove duplicates by slug (in case you mix approaches later)
    const seen = new Set<string>();
    list = list.filter((t) => {
      if (seen.has(t.slug)) return false;
      seen.add(t.slug);
      return true;
    });

    // Exclude current page
    if (excludeSlug) list = list.filter((t) => t.slug !== excludeSlug);

    return promoteLowLinkTool(list, maxItems);
  }, [toolSlugs, categories, excludeSlug, maxItems]);

  const gridCols =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : "sm:grid-cols-2";

  if (!tools.length) return null;

  return (
    <section className={`mt-14 border-t pt-10 ${className}`}>
      <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900"><a className="hover:underline" href="/tools">{heading} →</a></h2>

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
  );
}
