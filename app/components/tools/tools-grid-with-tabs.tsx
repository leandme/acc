"use client";

import Link from "next/link";
import { trackEvent } from "@/app/libs/amplitude";
import type { ToolCategoryTab, ToolMeta } from "@/app/(site)/(tools)/tools";
import { EzoicAdSlot } from "@/app/components/helpers/ezoic-ad-slot";

function slugToHref(slug: string) {
  return `/${slug}`;
}

export default function ToolsGridWithTabs({
  tools,
  tabs,
  activeTab,
}: {
  tools: ToolMeta[];
  tabs: ToolCategoryTab[];
  activeTab: ToolCategoryTab["key"];
}) {
  return (
    <section className="pt-4 mx-auto max-w-5xl px-6 pb-20">
      <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`rounded-btn px-4 py-2 text-lg transition ${
                isActive
                  ? "bg-[#64c65d] text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-base-200"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <EzoicAdSlot id={113} className="mt-8" />

      <div className="mt-10 grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={slugToHref(tool.slug)}
            onClick={() =>
              trackEvent("Go to Tool", {
                tool: tool.title.toLowerCase(),
                source: "tools grid",
              })
            }
            className="group rounded-2xl border border-2 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-[1px]"
          >
            <p className="text-xl lg:text-2xl font-semibold text-primary underline group-hover:underline">
              {tool.title}
            </p>
            {tool.description ? (
              <p className="mt-3 text-md text-gray-700 leading-relaxed">{tool.description}</p>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
