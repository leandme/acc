"use client";

import React, { useMemo, useState } from "react";

type Gender = "male" | "female";

type VisualPoint = {
  pct: number; // representative %
  label: string; // range label
  image: string; // path under /public
  alt: string;
  bullets: string[];
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function nearestPoint(points: VisualPoint[], pct: number) {
  let best = points[0];
  let bestDist = Math.abs(points[0].pct - pct);
  for (const p of points) {
    const d = Math.abs(p.pct - pct);
    if (d < bestDist) {
      best = p;
      bestDist = d;
    }
  }
  return best;
}

const MEN_POINTS: VisualPoint[] = [
  {
    pct: 8,
    label: "Very Lean (7–9%)",
    image: "/guides/body-fat-visualizer/men-8.jpg",
    alt: "Male body fat visual reference around 8 percent",
    bullets: ["Clear ab definition", "More vascularity", "Sharp waist taper"],
  },
  {
    pct: 12,
    label: "Lean (10–13%)",
    image: "/guides/body-fat-visualizer/men-12.jpg",
    alt: "Male body fat visual reference around 12 percent",
    bullets: ["Abs often visible in good light", "Some softness when relaxed", "Shoulders/arms defined"],
  },
  {
    pct: 16,
    label: "Fit (14–17%)",
    image: "/guides/body-fat-visualizer/men-16.jpg",
    alt: "Male body fat visual reference around 16 percent",
    bullets: ["Athletic look", "Less ab separation", "Some lower-ab softness"],
  },
  {
    pct: 20,
    label: "Average (18–22%)",
    image: "/guides/body-fat-visualizer/men-20.jpg",
    alt: "Male body fat visual reference around 20 percent",
    bullets: ["Limited ab definition", "Waist softer", "Muscle shape still present if trained"],
  },
  {
    pct: 26,
    label: "Above Average (23–26%)",
    image: "/guides/body-fat-visualizer/men-26.jpg",
    alt: "Male body fat visual reference around 26 percent",
    bullets: ["More midsection rounding in photos", "Less shoulder/arm separation", "Face/neck softness may appear"],
  },
  {
    pct: 32,
    label: "High (27–33%)",
    image: "/guides/body-fat-visualizer/men-32.jpg",
    alt: "Male body fat visual reference around 32 percent",
    bullets: ["Rounded abdomen is common", "Minimal definition", "Fat distribution varies a lot by person"],
  },
];

const WOMEN_POINTS: VisualPoint[] = [
  {
    pct: 18,
    label: "Athletic (16–19%)",
    image: "/guides/body-fat-visualizer/women-18.jpg",
    alt: "Female body fat visual reference around 18 percent",
    bullets: ["Lean waist", "Definition in arms/legs in good light", "Shape depends heavily on muscle mass"],
  },
  {
    pct: 22,
    label: "Fit (20–24%)",
    image: "/guides/body-fat-visualizer/women-22.jpg",
    alt: "Female body fat visual reference around 22 percent",
    bullets: ["Tight waist with some softness", "Curves present", "Abs may show lightly when flexed"],
  },
  {
    pct: 27,
    label: "Average (25–29%)",
    image: "/guides/body-fat-visualizer/women-27.jpg",
    alt: "Female body fat visual reference around 27 percent",
    bullets: ["Very common range", "Softer midsection", "Hips/thighs often store more fat"],
  },
  {
    pct: 32,
    label: "Above Average (30–34%)",
    image: "/guides/body-fat-visualizer/women-32.jpg",
    alt: "Female body fat visual reference around 32 percent",
    bullets: ["More softness overall", "Waist less defined", "Shape changes a lot with posture/lighting"],
  },
  {
    pct: 38,
    label: "High (35–40%)",
    image: "/guides/body-fat-visualizer/women-38.jpg",
    alt: "Female body fat visual reference around 38 percent",
    bullets: ["More visible softness across waist/hips/thighs", "Definition minimal", "Clothing fit changes noticeably"],
  },
  {
    pct: 44,
    label: "Very High (41%+)",
    image: "/guides/body-fat-visualizer/women-44.jpg",
    alt: "Female body fat visual reference around 44 percent",
    bullets: ["Higher overall softness", "Distribution varies widely", "Progress shows well with consistency"],
  },
];

export default function BodyFatVisualizerTool() {
  const [gender, setGender] = useState<Gender>("male");

  // Slider range per gender (keeps UX tidy)
  const sliderMin = gender === "male" ? 6 : 14;
  const sliderMax = gender === "male" ? 40 : 50;

  const [pct, setPct] = useState<number>(gender === "male" ? 16 : 27);

  // When gender changes, nudge pct into the new slider bounds
  React.useEffect(() => {
    setPct((prev) => clamp(prev, sliderMin, sliderMax));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender]);

  const points = useMemo(() => (gender === "male" ? MEN_POINTS : WOMEN_POINTS), [gender]);
  const active = useMemo(() => nearestPoint(points, pct), [points, pct]);

  return (
    <section className="w-full">
      <div className="rounded-3xl border bg-base-100 p-5 sm:p-7 shadow-sm">
        {/* Header row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-gray-600 text-base sm:text-lg">
              Drag the slider to see what different body fat ranges typically look like.
            </p>
          </div>

          <a
            href="/estimate"
            className="btn btn-primary text-white btn-lg self-start sm:self-auto"
          >
            Estimate from photo →
          </a>
        </div>

        {/* Gender tabs */}
        <div className="mt-6 flex items-center justify-center">
          <div className="inline-flex rounded-2xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setGender("male")}
              className={[
                "px-4 py-2 rounded-2xl text-sm font-semibold transition",
                gender === "male" ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900",
              ].join(" ")}
              aria-pressed={gender === "male"}
            >
              Men
            </button>
            <button
              type="button"
              onClick={() => setGender("female")}
              className={[
                "px-4 py-2 rounded-2xl text-sm font-semibold transition",
                gender === "female" ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900",
              ].join(" ")}
              aria-pressed={gender === "female"}
            >
              Women
            </button>
          </div>
        </div>

        {/* Main content grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Left: image + details */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border bg-gray-50">
              <img
                src={active.image}
                alt={active.alt}
                loading="lazy"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-500">Selected</span>
                <span className="text-xl font-semibold text-gray-900">
                  {pct}%
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                  {active.label}
                </span>
              </div>

              <p className="text-sm text-gray-500">
                Visual references vary with muscle mass, lighting, posture, and fat distribution.
              </p>
            </div>

            <ul className="list-disc pl-6 text-gray-700 space-y-2 text-base sm:text-lg">
              {active.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>

          {/* Right: slider */}
          <div className="rounded-2xl border bg-white p-5 sm:p-6">
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <p className="text-base font-semibold text-gray-900">Body fat %</p>
                <p className="text-sm text-gray-500">
                  {sliderMin}% – {sliderMax}%
                </p>
              </div>

              <input
                type="range"
                min={sliderMin}
                max={sliderMax}
                value={pct}
                onChange={(e) => setPct(Number(e.target.value))}
                className="w-full"
                aria-label="Body fat percentage slider"
              />

              <div className="flex justify-between text-xs text-gray-500">
                <span>{sliderMin}%</span>
                <span>{sliderMax}%</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-sm font-semibold text-gray-900">Quick tip</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Most people underestimate body fat in photos. Lighting and camera distance can
                change how lean someone looks more than you’d expect.
              </p>
            </div>

            <div className="mt-6">
              <a href="#learn-more" className="btn btn-outline w-full">
                Learn what affects appearance ↓
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
