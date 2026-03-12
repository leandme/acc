"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { trackEvent } from "@/app/libs/amplitude";
import type { ToolCategorySlug } from "@/app/(site)/(tools)/tools";

type Post = {
  slug: string;
  title: string;
  tag?: ToolCategorySlug;
  description: string;
  date: string;
  readTime: string;
  image: string;
};

export type GuideTab = {
  key: "all" | ToolCategorySlug;
  label: string;
};

const DEFAULT_GUIDE_TABS: GuideTab[] = [
  { key: "all", label: "All" },
  { key: "muscle", label: "Muscle" },
  { key: "height", label: "Height" },
  { key: "face", label: "Face" },
  { key: "fat", label: "Fat" },
  { key: "shape", label: "Shape" },
  { key: "weight", label: "Weight" },
  { key: "calories", label: "Calories" },
];

const LEGACY_GUIDE_TAG_MAP: Record<string, ToolCategorySlug> = {
  "body-analysis": "fat",
  "fat-loss": "weight",
};

export default function GuideGridWithTabs({
  posts,
  tabs,
}: {
  posts: readonly Post[];
  tabs?: readonly GuideTab[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const resolvedTabs = useMemo(
    () => (tabs?.length ? [...tabs] : DEFAULT_GUIDE_TABS),
    [tabs]
  );
  const tabKeys = useMemo(() => new Set(resolvedTabs.map((tab) => tab.key)), [resolvedTabs]);

  const activeTag = useMemo<GuideTab["key"]>(() => {
    const rawTag = searchParams.get("tag");
    if (!rawTag || rawTag === "all") return "all";
    const normalizedTag = LEGACY_GUIDE_TAG_MAP[rawTag] ?? rawTag;
    return tabKeys.has(normalizedTag as GuideTab["key"])
      ? (normalizedTag as GuideTab["key"])
      : "all";
  }, [searchParams, tabKeys]);

  const filtered = useMemo(() => {
    if (activeTag === "all") return posts;
    return posts.filter((post) => post.tag === activeTag);
  }, [posts, activeTag]);

  function setTag(tag: GuideTab["key"]) {
    const next = new URLSearchParams(searchParams.toString());
    if (tag === "all") next.delete("tag");
    else next.set("tag", tag);

    router.push(`${pathname}?${next.toString()}`, { scroll: false });
    trackEvent("guides_tab_click", { tag });
  }

  return (
    <section className="pt-4 mx-auto max-w-5xl px-6 pb-20">
      {/* Tabs row (remove.bg-ish) */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
        {resolvedTabs.map((tab) => {
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
              {/* underline */}
              <span
                className={`absolute left-0 -bottom-2 h-1 w-full rounded-full transition ${
                  isActive ? "bg-primary" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="mt-10 grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={`/guides/${post.slug}`}
            onClick={() => trackEvent("Go to Guide", { slug: post.slug, tag: post.tag ?? "" })}
            className="group rounded-2xl border bg-white transition hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
          >
            {/* Image */}
            <div className="w-full aspect-[2/1] bg-base-200 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-gray-500">{post.date}</span>
              </div>

              <h3 className="mt-4 text-xl lg:text-2xl font-semibold text-gray-900 group-hover:underline">
                {post.title}
              </h3>

              <p className="mt-4 text-md text-gray-600 leading-relaxed">
                {post.description}
              </p>

              <div className="mt-8 flex items-center justify-between">
                <span className="text-xs text-gray-500">{post.readTime}</span>
                <span className="text-md text-primary transition-transform duration-200 ease-out hover:scale-105 font-medium">
                  Read →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
