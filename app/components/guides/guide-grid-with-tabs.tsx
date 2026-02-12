"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { trackEvent } from "@/app/libs/amplitude";

type Post = {
  slug: string;
  title: string;
  tag?: string; // "body-analysis" | "fat-loss" | "" | undefined
  description: string;
  date: string;
  readTime: string;
  image: string;
};

type Tab = {
  key: "all" | "body-analysis" | "fat-loss";
  label: string;
};

const TABS: Tab[] = [
  { key: "all", label: "All" },
  { key: "body-analysis", label: "Body Analysis" },
  { key: "fat-loss", label: "Fat Loss" },
];

export default function GuideGridWithTabs({ posts }: { posts: readonly Post[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTag = (searchParams.get("tag") ?? "all") as Tab["key"];

  const filtered = useMemo(() => {
    if (activeTag === "all") return posts;
    return posts.filter((p) => (p.tag ?? "").trim() === activeTag);
  }, [posts, activeTag]);

  function setTag(tag: Tab["key"]) {
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
        {TABS.map((t) => {
          const isActive = activeTag === t.key;

          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTag(t.key)}
              className={`relative text-lg transition ${
                isActive ? "text-primary" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t.label}
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