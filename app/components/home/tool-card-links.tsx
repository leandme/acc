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
    title: "Body Shape Analyzer",
    href: "/body-shape-analyzer",
    description: "Upload a photo and analyze your visual body type.",
  },
  {
    title: "Body Shape Calculator",
    href: "/body-shape-calculator",
    description: "Estimate body-shape category from bust, waist, and hip measurements.",
  },
  {
    title: "Body Visualizer",
    href: "/body-visualizer",
    description: "Visualize BMI, body fat %, height, and weight.",
  },
  {
    title: "Body Fat Calculator",
    href: "/body-fat-calculator",
    description: "Estimate body fat % from measurements and formulas.",
  },
  {
    title: "FFMI Calculator",
    href: "/ffmi-calculator",
    description: "How much lean mass you carry",
  },
  {
    title: "Lean Body Mass Calculator",
    href: "/lean-body-mass-calculator",
    description: "Estimate lean mass with Boer, James, and Hume formulas.",
  },
  {
    title: "Muscle Mass Calculator",
    href: "/muscle-mass-calculator",
    description: "Estimate skeletal muscle mass from anthropometric inputs.",
  },
  {
    title: "BRI Calculator",
    href: "/bri-calculator",
    description: "Estimate body roundness from waist and height.",
  },
  {
    title: "BAI Calculator",
    href: "/bai-calculator",
    description: "Estimate body adiposity from hip circumference and height.",
  },
  {
    title: "Body Frame Size Calculator",
    href: "/body-frame-size-calculator",
    description: "Classify frame size from height and wrist measurements.",
  },
  {
    title: "Waist to Hip Ratio Calculator",
    href: "/waist-to-hip-ratio-calculator",
    description: "Assess abdominal fat distribution with a waist-to-hip ratio check.",
  },
  {
    title: "Waist to Height Ratio Calculator",
    href: "/waist-to-height-ratio-calculator",
    description: "Screen central-fat risk by comparing waist circumference to height.",
  },
  {
    title: "BMI Calculator",
    href: "/bmi-calculator",
    description: "Calculate BMI and check standard adult categories.",
  },
  {
    title: "Weight Loss Calculator",
    href: "/weight-loss-calculator",
    description: "Estimate timeline to target weight using calorie intake.",
  },
  {
    title: "Intermittent Fasting Calculator",
    href: "/intermittent-fasting-calculator",
    description: "Compare fasting protocols and projected weekly pace.",
  },
  {
    title: "TDEE Calculator",
    href: "/tdee-calculator",
    description: "Estimate maintenance calories from BMR and activity level.",
  },
  {
    title: "BMR Calculator",
    href: "/bmr-calculator",
    description: "Estimate resting calorie burn with standard equations.",
  },
  {
    title: "Calorie Deficit Calculator",
    href: "/calorie-deficit-calculator",
    description: "Set daily calorie targets from your chosen weekly loss pace.",
  },
  {
    title: "Macro Calculator",
    href: "/macro-calculator",
    description: "Set protein, carbs, and fat targets from your calorie goal.",
  },
  {
    title: "Steps to Calories Calculator",
    href: "/steps-to-calories-calculator",
    description: "Estimate calories burned from walking steps and pace.",
  },
  {
    title: "Calories Burned Calculator",
    href: "/calories-burned-calculator",
    description: "Estimate calories burned across many workout and cardio activities.",
  },
  {
    title: "Calorie Estimator",
    href: "/calorie-estimator",
    description: "Estimate meal calories from a photo with confidence ranges.",
  },
  {
    title: "Ideal Weight Calculator",
    href: "/ideal-weight-calculator",
    description: "Compare healthy BMI range and ideal-weight references.",
  },
  {
    title: "Army Body Fat Calculator",
    href: "/army-body-fat-calculator",
    description: "Estimate body fat % using the US Army tape method.",
  },
  {
    title: "Skinfold Body Fat Calculator",
    href: "/skinfold-body-fat-calculator",
    description: "Estimate body fat % from skinfold caliper sites.",
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
