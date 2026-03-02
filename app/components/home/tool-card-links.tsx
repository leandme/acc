"use client";

import React from "react";
import Link from "next/link";
import { trackEvent } from "@/app/libs/amplitude";

export type LinkCardItem = {
  title: string;
  href: string;
  icon?: React.ReactNode;
  description?: string; // optional (keep short)
};

const DEFAULT_ITEMS: LinkCardItem[] = [
  {
    title: "Fat",
    href: "/tools/fat",
    description: "Body fat estimators, visualizers, and measurement-based calculators.",
  },
  {
    title: "Shape",
    href: "/tools/shape",
    description: "Body-shape, frame-size, and proportion calculators for structure context.",
  },
  {
    title: "Muscle",
    href: "/tools/muscle",
    description: "FFMI, muscular potential, and bodybuilding-focused planning tools.",
  },
  {
    title: "Weight",
    href: "/tools/weight",
    description: "BMI, ideal-weight, and progress-tracking tools for practical planning.",
  },
  {
    title: "Calories",
    href: "/tools/calories",
    description: "BMR, TDEE, calorie, deficit, macro, and energy-burn calculators.",
  },
  {
    title: "Height",
    href: "/tools/height",
    description: "Parent-based and photo-based height estimation tools.",
  },
  {
    title: "Face",
    href: "/tools/face",
    description: "AI-based facial analysis tools for shape, symmetry, and feature detection.",
  },
  {
    title: "All Tools",
    href: "/tools",
    description: "Browse all categories and every available tool.",
  },
];

type Props = {
  headline?: string;
  subhead?: React.ReactNode;
  items?: LinkCardItem[];
  columns?: 2 | 3 | 4;
  maxItems?: number;
  className?: string;
};

export default function ToolCardLinkGrid({
  headline = "Understand Your Body",
  subhead = (
    <>
      Estimate body fat, visualize ranges, and compare methods using practical tools built for real-world tracking—not lab-only measurements.
    </>
  ),
  items = DEFAULT_ITEMS,
  columns = 3,
  maxItems = 9,
  className = "",
}: Props) {
  const gridCols =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 2
      ? "sm:grid-cols-2"
      : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className={`mx-auto mt-20 lg:mt-40 max-w-6xl px-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
          {headline}
        </h2>

        {subhead ? (
          <div className="mt-5 mx-auto max-w-3xl text-lg text-gray-700 leading-relaxed">
            {subhead}
          </div>
        ) : null}
      </div>

      <div className={`mt-10 grid gap-5 ${gridCols}`}>
        {items.slice(0, maxItems).map((item) => (
          <Link
            key={item.href + item.title}
            href={item.href}
            onClick={() => {
              if (item.href !== "/tools") {
                trackEvent("Go to Tool", {
                  tool: item.title.toLowerCase(),
                  source: "tool card links",
                });
              }
            }}
            className="group rounded-2xl border border-2 bg-white p-6 shadow-sm transition
                       hover:shadow-md hover:-translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {item.icon ? (
                  <div className="text-gray-700">{item.icon}</div>
                ) : null}

                <div className="text-left">
                  <p className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </p>

                  {item.description ? (
                    <p className="mt-1 text-sm text-gray-600 leading-snug">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-1 flex items-center gap-1 text-gray-400 group-hover:text-gray-900 transition" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
