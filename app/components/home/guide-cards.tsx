"use client";

import React from "react";
import Link from "next/link";
import { trackEvent } from "@/app/libs/amplitude";

export type GuideCardItem = {
  title: string;
  href: string;
  date?: string; // e.g. "Nov 25, 2025"
  description?: string;
};

type Props = {
  headline?: string; // e.g. "Guides" / "Blog"
  viewAllLabel?: string; // e.g. "See more articles →"
  viewAllHref?: string; // e.g. "/guides"
  items?: GuideCardItem[]; // if omitted, defaults are used
  className?: string;
};

const DEFAULT_ITEMS: GuideCardItem[] = [
  {
    date: "Jan 27, 2026",
    title: "How to Estimate Body Fat % at Home (Free)",
    href: "/guides/how-to-estimate-body-fat-percentage",
  },
  {
    date: "Jan 20, 2026",
    title: "Body Fat Calculator vs Estimator: What’s Better?",
    href: "/guides/body-fat-calculator-vs-estimator",
  },
  {
    date: "Jan 27, 2026",
    title: "How to Estimate Body Fat % from a Photo",
    href: "/guides/estimate-body-fat-percentage-from-photo",
  },
];

export default function GuideCards({
  headline = "Guides",
  viewAllLabel = "See more guides →",
  viewAllHref = "/guides",
  items = DEFAULT_ITEMS,
  className = "",
}: Props) {
  // Keep it to 3 across, even if more are passed accidentally
  const cards = items.slice(0, 3);

  return (
    <section className={`mx-auto mt-20 mb-20 lg:mt-40 max-w-6xl px-6 ${className}`}>
      {/* Header row */}
      <div className="flex items-center justify-between gap-6">
        <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900">
          {headline}
        </h2>

        <Link
          href={viewAllHref}
          className="text-lg font-semibold text-gray-700 hover:text-primary hover:underline transition"
        >
          {viewAllLabel}
        </Link>
      </div>

      {/* Cards */}
      <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-3">
        {cards.map((item) => (
          <Link
            key={item.href + item.title}
            href={item.href}
            className="group rounded-2xl border border-2 border-gray-200 bg-white p-8 shadow-sm transition
                       hover:shadow-md hover:-translate-y-[1px]
                       focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {item.date ? (
              <p className="text-base text-gray-500">{item.date}</p>
            ) : null}

            <h3 className="mt-5 mb-4 text-xl font-semibold text-gray-700 leading-snug">
              {item.title}
            </h3>

            {item.description ? (
              <p className="mt-3 text-base text-gray-600 leading-relaxed">
                {item.description}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
