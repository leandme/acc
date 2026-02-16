"use client";

import React from "react";
import Link from "next/link";
import { trackEvent } from "@/app/libs/amplitude";

export type LinkCardItem = {
  title: string;
  href: string;
  icon?: React.ReactNode;
  description?: string; // optional (keep short)
  eventName?: string; // optional amplitude event
};

const DEFAULT_ITEMS: LinkCardItem[] = [
  {
    title: "Body Visualizer",
    href: "/body-visualizer",
    description: "Visualize BMI, body fat %, height, and weight.",
    eventName: "Go To Body Visualizer",
  },
  {
    title: "FFMI Calculator",
    href: "/ffmi-calculator",
    description: "How much lean mass you carry",
    eventName: "Go to FFMI Calculator",
  },
  {
    title: "Lean Body Mass Calculator",
    href: "/lean-body-mass-calculator",
    description: "Estimate lean mass with Boer, James, and Hume formulas.",
    eventName: "Go to Lean Body Mass Calculator",
  },
  {
    title: "Muscle Mass Calculator",
    href: "/muscle-mass-calculator",
    description: "Estimate skeletal muscle mass from anthropometric inputs.",
    eventName: "Go to Muscle Mass Calculator",
  },
  {
    title: "BRI Calculator",
    href: "/bri-calculator",
    description: "Estimate body roundness from waist and height.",
    eventName: "Go to BRI Calculator",
  },
  {
    title: "BAI Calculator",
    href: "/bai-calculator",
    description: "Estimate body adiposity from hip circumference and height.",
    eventName: "Go to BAI Calculator",
  },
  {
    title: "Body Frame Size Calculator",
    href: "/body-frame-size-calculator",
    description: "Classify frame size from height and wrist measurements.",
    eventName: "Go to Body Frame Size Calculator",
  },
  {
    title: "BMI Calculator",
    href: "/bmi-calculator",
    description: "Calculate BMI and check standard adult categories.",
    eventName: "Go to BMI Calculator",
  },
  {
    title: "Weight Loss Calculator",
    href: "/weight-loss-calculator",
    description: "Estimate timeline to target weight using calorie intake.",
    eventName: "Go to Weight Loss Calculator",
  },
  {
    title: "Intermittent Fasting Calculator",
    href: "/intermittent-fasting-calculator",
    description: "Compare fasting protocols and projected weekly pace.",
    eventName: "Go to Intermittent Fasting Calculator",
  },
  {
    title: "TDEE Calculator",
    href: "/tdee-calculator",
    description: "Estimate maintenance calories from BMR and activity level.",
    eventName: "Go to TDEE Calculator",
  },
  {
    title: "BMR Calculator",
    href: "/bmr-calculator",
    description: "Estimate resting calorie burn with standard equations.",
    eventName: "Go to BMR Calculator",
  },
  {
    title: "Calorie Deficit Calculator",
    href: "/calorie-deficit-calculator",
    description: "Set daily calorie targets from your chosen weekly loss pace.",
    eventName: "Go to Calorie Deficit Calculator",
  },
  {
    title: "Ideal Weight Calculator",
    href: "/ideal-weight-calculator",
    description: "Compare healthy BMI range and ideal-weight references.",
    eventName: "Go to Ideal Weight Calculator",
  },
  {
    title: "Army Body Fat Calculator",
    href: "/army-body-fat-calculator",
    description: "Estimate body fat % using the US Army tape method.",
    eventName: "Go to Army Body Fat Calculator",
  },
  {
    title: "Skinfold Body Fat Calculator",
    href: "/skinfold-body-fat-calculator",
    description: "Estimate body fat % from skinfold caliper sites.",
    eventName: "Go to Skinfold Body Fat Calculator",
  },
  {
    title: "All Tools",
    href: "/tools",
    description: "Everything tool you need is free.",
  },
];

type Props = {
  headline?: string;
  subhead?: React.ReactNode;
  items?: LinkCardItem[];
  columns?: 2 | 3 | 4;
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
        {items.map((item) => (
          <Link
            key={item.href + item.title}
            href={item.href}
            onClick={() => {
              if (item.eventName)
                trackEvent(item.eventName, { href: item.href });
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
