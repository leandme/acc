"use client";

import React, { useMemo } from "react";

type Gender = "male" | "female";

type Props = {
  estimate?: number | null;
  gender?: Gender;
  rationale?: string | null;   // ✅ add this
  country?: string;
  className?: string;
  title?: string;
};


function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/** -------------------------
 *  Meaning copy (matches 8-category cutoffs)
 *  ------------------------- */
function getMeaningSummary(gender: Gender, bf: number) {
  if (gender === "female") {
    if (bf <= 13)
      return "Extremely low. This is essential body fat for women — not a casual target. Health and hormonal function matter more than a number.";
    if (bf <= 20)
      return "Athletic and lean. Often reads as visibly fit with definition in favorable lighting, while still being healthy and sustainable for many.";
    if (bf <= 24)
      return "Lean. You’ll typically look clearly fit and tighter through the waist, with noticeable definition depending on lighting and muscle mass.";
    if (bf <= 28)
      return "Fit. Strong, healthy look with some softness depending on fat distribution and posture. Great zone for most people.";
    if (bf <= 33)
      return "Average. Very common and normal — definition is limited, but you can still look great in clothes and improve visibly with consistency.";
    if (bf <= 38)
      return "Above average. Softness becomes more noticeable, but the upside is that small changes can show up quickly in shape and waist.";
    if (bf <= 43)
      return "High body fat. Softness is more visible across the midsection/hips/thighs for many women, but steady progress is very achievable.";
    return "Very high body fat. Focus on sustainable habits and trend tracking — consistency will matter far more than any single estimate.";
  }

  // Male (default)
  if (bf <= 5)
    return "Extremely low. This is essential body fat for men — not a casual target. Most people shouldn’t aim here.";
  if (bf <= 10)
    return "Athletic and very lean. Often the “fitness model” zone — clear definition and sharp lines, with small % changes showing up fast.";
  if (bf <= 13)
    return "Lean. You’ll typically look visibly fit to most people, with good definition in decent lighting.";
  if (bf <= 17)
    return "Fit. Everyday lean — healthy and athletic, with some definition and a softer midsection when relaxed.";
  if (bf <= 22)
    return "Average. Extremely common. You can look solid in clothes, but definition is limited unless flexed or in ideal lighting.";
  if (bf <= 26)
    return "Above average. Waist softness becomes more noticeable in photos, but you can still look strong—especially with muscle mass.";
  if (bf <= 30)
    return "High body fat. Softness is more visible around the waist/lower abdomen, but consistent changes often show quickly.";
  return "Very high body fat. Focus on sustainable routines and trend tracking — consistency beats intensity here.";
}

/** -------------------------
 *  Ranges table (8 categories)
 *  ------------------------- */
type RangeRow = {
  key: string;
  label: string;
  min: number; // inclusive
  max: number; // inclusive (use Infinity for open-ended)
  colorClass: string;
  textClass: string;
  note: string;
};

function getRanges(gender: Gender): RangeRow[] {
  if (gender === "female") {
    return [
      {
        key: "essential",
        label: "Essential",
        min: 10,
        max: 13,
        colorClass: "bg-blue-50",
        textClass: "text-blue-800",
        note: "Minimum needed for basic hormonal and physiological function.",
      },
      {
        key: "athletic",
        label: "Athletic",
        min: 14,
        max: 20,
        colorClass: "bg-green-50",
        textClass: "text-green-800",
        note: "Lean and performance-focused; definition often shows in good lighting.",
      },
      {
        key: "lean",
        label: "Lean",
        min: 21,
        max: 24,
        colorClass: "bg-green-50",
        textClass: "text-green-800",
        note: "Clearly fit look; waist is typically tighter with noticeable shape.",
      },
      {
        key: "fit",
        label: "Fit",
        min: 25,
        max: 28,
        colorClass: "bg-green-50",
        textClass: "text-green-800",
        note: "Strong/healthy range with some softness depending on distribution.",
      },
      {
        key: "average",
        label: "Average",
        min: 29,
        max: 33,
        colorClass: "bg-yellow-50",
        textClass: "text-yellow-800",
        note: "Very common; definition is limited but progress shows with consistency.",
      },
      {
        key: "above-average",
        label: "Above Average",
        min: 34,
        max: 38,
        colorClass: "bg-yellow-50",
        textClass: "text-yellow-800",
        note: "Softness becomes more noticeable; small improvements can show quickly.",
      },
      {
        key: "high",
        label: "High",
        min: 39,
        max: 43,
        colorClass: "bg-orange-50",
        textClass: "text-orange-800",
        note: "More visible softness across common storage areas; steady habits work.",
      },
      {
        key: "very-high",
        label: "Very High",
        min: 44,
        max: Infinity,
        colorClass: "bg-red-50",
        textClass: "text-red-800",
        note: "Focus on sustainable routines and trend tracking over single readings.",
      },
    ];
  }

  // Male (default)
  return [
    {
      key: "essential",
      label: "Essential",
      min: 2,
      max: 5,
      colorClass: "bg-blue-50",
      textClass: "text-blue-800",
      note: "Minimum needed for basic physiological function. Not a casual target.",
    },
    {
      key: "athletic",
      label: "Athletic",
      min: 6,
      max: 10,
      colorClass: "bg-green-50",
      textClass: "text-green-800",
      note: "Very lean with clear definition for most people.",
    },
    {
      key: "lean",
      label: "Lean",
      min: 11,
      max: 13,
      colorClass: "bg-green-50",
      textClass: "text-green-800",
      note: "Visibly fit look; definition often shows in decent lighting.",
    },
    {
      key: "fit",
      label: "Fit",
      min: 14,
      max: 17,
      colorClass: "bg-green-50",
      textClass: "text-green-800",
      note: "Everyday lean; healthy and athletic with some definition.",
    },
    {
      key: "average",
      label: "Average",
      min: 18,
      max: 22,
      colorClass: "bg-yellow-50",
      textClass: "text-yellow-800",
      note: "Extremely common; definition is limited unless flexed/ideal lighting.",
    },
    {
      key: "above-average",
      label: "Above Average",
      min: 23,
      max: 26,
      colorClass: "bg-yellow-50",
      textClass: "text-yellow-800",
      note: "Some waist softness is typical; photos can exaggerate angle/lighting.",
    },
    {
      key: "high",
      label: "High",
      min: 27,
      max: 30,
      colorClass: "bg-orange-50",
      textClass: "text-orange-800",
      note: "More visible softness around waist/lower abdomen for many men.",
    },
    {
      key: "very-high",
      label: "Very High",
      min: 31,
      max: Infinity,
      colorClass: "bg-red-50",
      textClass: "text-red-800",
      note: "Higher overall softness. Focus on consistency and trend tracking.",
    },
  ];
}

function inRange(bf: number, row: RangeRow) {
  return bf >= row.min && bf <= row.max;
}

function formatRange(min: number, max: number) {
  if (max === Infinity) return `${min}%+`;
  return `${min}–${max}%`;
}

/** -------------------------
 *  Rough percentile: "leaner than X%"
 *  (still approximate)
 *  ------------------------- */
function estimateLeanerThanPercent(gender: Gender, bf: number) {
  const anchors =
    gender === "female"
      ? [
          { bf: 13, p: 97 },
          { bf: 20, p: 85 },
          { bf: 24, p: 75 },
          { bf: 28, p: 65 },
          { bf: 33, p: 50 },
          { bf: 38, p: 35 },
          { bf: 43, p: 20 },
          { bf: 50, p: 10 },
        ]
      : [
          { bf: 5, p: 99 },
          { bf: 10, p: 95 },
          { bf: 13, p: 85 },
          { bf: 17, p: 70 },
          { bf: 22, p: 50 },
          { bf: 26, p: 35 },
          { bf: 30, p: 20 },
          { bf: 38, p: 10 },
        ];

  if (bf <= anchors[0].bf) return anchors[0].p;
  if (bf >= anchors[anchors.length - 1].bf) return anchors[anchors.length - 1].p;

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (bf >= a.bf && bf <= b.bf) {
      const t = (bf - a.bf) / (b.bf - a.bf);
      const p = a.p + t * (b.p - a.p);
      return Math.round(p);
    }
  }
  return 50;
}

/** -------------------------
 *  Component
 *  ------------------------- */
export default function EstimateWhereYouSit({
  estimate = null,
  gender = "male",
  rationale = null,            // ✅ add this
  country,
  className = "",
  title,
}: Props) {

  const bf = typeof estimate === "number" ? clamp(estimate, 2, 60) : null;

  const summary = useMemo(() => {
    if (bf === null) return null;
    return getMeaningSummary(gender, bf);
  }, [bf, gender]);

  const rows = useMemo(() => getRanges(gender), [gender]);

  const activeRow = useMemo(() => {
    if (bf === null) return null;
    return rows.find((r) => inRange(bf, r)) ?? null;
  }, [bf, rows]);

  return (
    <section className={`w-full max-w-3xl ${className}`}>
      <div className="p-5">
        {/* Headline: What X% body fat means */}
        <h2 className="text-3xl lg:text-4xl font-semibold text-center flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <span>
            {title ?? (
              <>
                What{" "}
                <span className="underline decoration-blue-500 decoration-4 underline-offset-4">
                  {bf ?? "—"}
                </span>
                % Body Fat Means
              </>
            )}
          </span>

          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-base font-semibold tracking-wide text-gray-700">
            {gender === "female" ? "WOMEN" : "MEN"}
          </span>
        </h2>

        {/* Table */}
        <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
          <table className="w-full text-left border-separate border-spacing-0">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
                  RANGE
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
                  CATEGORY
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">
                  HOW IT LOOKS
                </th>
              </tr>
            </thead>


            <tbody>
  {rows.map((row) => {
    const isActive = bf !== null && inRange(bf, row);

    const cellBase = "px-4 py-4 align-top";
    const activeCell = isActive ? "border-y-4 border-gray-900" : "border-y border-transparent";

    return (
      <tr key={row.key} className={row.colorClass}>
        {/* RANGE */}
        <td
          className={[
            cellBase,
            activeCell,
            isActive ? "border-l-4 border-gray-900 rounded-l-xl" : "",
          ].join(" ")}
        >
          <div className={`inline-flex items-center gap-2 ${row.textClass}`}>
            <span className="font-semibold">{formatRange(row.min, row.max)}</span>
          </div>
        </td>

        {/* CATEGORY */}
        <td className={[cellBase, activeCell].join(" ")}>
          <div className="font-semibold text-gray-900">{row.label}</div>
          <div className="mt-1 text-sm text-gray-700 sm:hidden">{row.note}</div>
        </td>

        {/* NOTE (desktop only) */}
        <td
          className={[
            cellBase,
            activeCell,
            "hidden sm:table-cell",
            isActive ? "border-r-4 border-gray-900 rounded-r-xl" : "",
          ].join(" ")}
        >
          <div className="text-sm text-gray-700 leading-relaxed">{row.note}</div>
        </td>
      </tr>
    );
  })}
</tbody>

          </table>
        </div>

        {/* Explanation under table */}
        {bf !== null && activeRow ? (
          <div className="mt-6 space-y-3">
            <p className="text-gray-700 text-lg text-center leading-relaxed">
              Your estimate of{" "}
              <span className="font-semibold text-gray-900">{bf}%</span>{" "}
              falls into{" "}
              <span className="font-semibold text-gray-900">{activeRow.label}</span>.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
