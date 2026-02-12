"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { trackEvent } from "@/app/libs/amplitude";
import type { ToolMeta } from "@/app/(site)/(tools)/tools";

type TabKey = "all" | "body-fat" | "body-composition";

type Tab = {
  key: TabKey;
  label: string;
};

const TABS: Tab[] = [
  { key: "all", label: "All" },
  { key: "body-fat", label: "Body Fat" },
  { key: "body-composition", label: "Body Composition" },
];

function keyToCategory(key: TabKey): ToolMeta["category"] | null {
  if (key === "body-fat") return "Body Fat";
  if (key === "body-composition") return "Body Composition";
  return null;
}

function slugToHref(slug: string) {
  return `/${slug}`;
}

export default function ToolsGridWithTabs({ tools }: { tools: ToolMeta[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTag = (searchParams.get("tag") ?? "all") as TabKey;

  const filtered = useMemo(() => {
    const activeCategory = keyToCategory(activeTag);
    if (!activeCategory) return tools;
    return tools.filter((tool) => tool.category === activeCategory);
  }, [tools, activeTag]);

  function setTag(tag: TabKey) {
    const next = new URLSearchParams(searchParams.toString());
    if (tag === "all") next.delete("tag");
    else next.set("tag", tag);

    router.push(`${pathname}?${next.toString()}`, { scroll: false });
    trackEvent("tools_tab_click", { tag });
  }

  return (
    <section className="pt-4 mx-auto max-w-5xl px-6 pb-20">
      <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
        {TABS.map((tab) => {
          const isActive = activeTag === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setTag(tab.key)}
              className={`relative text-lg transition ${
                isActive ? "text-primary" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
              <span
                className={`absolute left-0 -bottom-2 h-1 w-full rounded-full transition ${
                  isActive ? "bg-primary" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {filtered.map((tool) => (
          <Link
            key={tool.slug}
            href={slugToHref(tool.slug)}
            onClick={() => trackEvent("Go to Tool", { slug: tool.slug, category: tool.category })}
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
