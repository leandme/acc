"use client";

import React from "react";
import Link from "next/link";
import { trackEvent } from "@/app/libs/amplitude";

type Post = {
  slug: string;
  title: string;
  tag?: string;
  description: string;
  date: string;
  readTime: string;
  image: string;
};

export default function GuideGridWithTabs({
  posts,
}: {
  posts: readonly Post[];
}) {
  return (
    <section className="pt-4 mx-auto max-w-5xl px-6 pb-20">
      {/* Grid */}
      <div className="mt-10 grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            onClick={() => trackEvent("Go to Blog", { slug: post.slug, tag: post.tag ?? "" })}
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
