"use client";

import React, { useMemo, useState } from "react";

type Gender = "male" | "female";

type Props = {
  gender?: Gender;                 // ✅ controlled (from calculator), optional
  ffmi?: number | null;            // ✅ optional: highlight row for this FFMI
  className?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

type RangeRow = {
  key: string;
  label: string;
  min: number; // inclusive
  max: number; // exclusive (use Infinity for open-ended)
  colorClass: string;
  dotColor: string;
  note: string;
};

// ✅ Same color “vibe” as your bar (red → orange → yellow → green → teal → blue → purple)
const COLORS = {
  red: { row: "bg-red-50", dot: "#ef4444" },
  orange: { row: "bg-orange-50", dot: "#f97316" },
  yellow: { row: "bg-yellow-50", dot: "#fde047" },
  green: { row: "bg-green-50", dot: "#22c55e" },
  teal: { row: "bg-emerald-50", dot: "#10b981" },
  blue: { row: "bg-blue-50", dot: "#3b82f6" },
  purple: { row: "bg-violet-50", dot: "#7c3aed" },
};

/**
 * FFMI ranges vary a bit by source and population.
 * These are practical “interpretation buckets” aligned to your existing labels/colors
 * and meant for fitness tracking (not diagnosis).
 *
 * Note: We treat ranges as [min, max) to avoid overlap.
 */
function getFFMIRanges(gender: Gender): RangeRow[] {
  if (gender === "female") {
    return [
      {
        key: "below",
        label: "Below Average",
        min: 0,
        max: 17,
        colorClass: COLORS.red.row,
        dotColor: COLORS.red.dot,
        note: "Lower lean mass for height. Common for beginners or very lean frames.",
      },
      {
        key: "avg",
        label: "Average",
        min: 17,
        max: 19,
        colorClass: COLORS.orange.row,
        dotColor: COLORS.orange.dot,
        note: "Typical muscularity for height. Solid baseline for most women.",
      },
      {
        key: "above",
        label: "Above Average",
        min: 19,
        max: 21,
        colorClass: COLORS.yellow.row,
        dotColor: COLORS.yellow.dot,
        note: "Noticeably more lean mass. Training usually shows in shape/curves.",
      },
      {
        key: "excellent",
        label: "Excellent",
        min: 21,
        max: 23,
        colorClass: COLORS.green.row,
        dotColor: COLORS.green.dot,
        note: "Strong muscular development for height. Often looks athletic/defined.",
      },
      {
        key: "superior",
        label: "Superior",
        min: 23,
        max: 24.5,
        colorClass: COLORS.teal.row,
        dotColor: COLORS.teal.dot,
        note: "Very high muscularity. Typically requires years of training/genetics.",
      },
      {
        key: "suspicious",
        label: "Suspicious",
        min: 24.5,
        max: 26,
        colorClass: COLORS.blue.row,
        dotColor: COLORS.blue.dot,
        note: "Unusually high. Could be measurement error, or exceptional outlier.",
      },
      {
        key: "unlikely",
        label: "Unlikely",
        min: 26,
        max: Infinity,
        colorClass: COLORS.purple.row,
        dotColor: COLORS.purple.dot,
        note: "Extremely rare naturally. Re-check inputs (height, bf%, weight).",
      },
    ];
  }

  // Male (default)
  return [
    {
      key: "below",
      label: "Below Average",
      min: 0,
      max: 19,
      colorClass: COLORS.red.row,
      dotColor: COLORS.red.dot,
      note: "Lower lean mass for height. Very common early in training.",
    },
    {
      key: "avg",
      label: "Average",
      min: 19,
      max: 21,
      colorClass: COLORS.orange.row,
      dotColor: COLORS.orange.dot,
      note: "Typical muscularity for height. A normal, healthy baseline.",
    },
    {
      key: "above",
      label: "Above Average",
      min: 21,
      max: 23,
      colorClass: COLORS.yellow.row,
      dotColor: COLORS.yellow.dot,
      note: "Noticeably more lean mass. Usually looks “trained” even in clothes.",
    },
    {
      key: "excellent",
      label: "Excellent",
      min: 23,
      max: 25,
      colorClass: COLORS.green.row,
      dotColor: COLORS.green.dot,
      note: "Strong muscular development for height. Often looks athletic/defined.",
    },
    {
      key: "superior",
      label: "Superior",
      min: 25,
      max: 26.5,
      colorClass: COLORS.teal.row,
      dotColor: COLORS.teal.dot,
      note: "Very high muscularity. Typically requires years of serious training.",
    },
    {
      key: "suspicious",
      label: "Suspicious",
      min: 26.5,
      max: 28,
      colorClass: COLORS.blue.row,
      dotColor: COLORS.blue.dot,
      note: "Unusually high. Could be measurement error or genetic outlier.",
    },
    {
      key: "unlikely",
      label: "Unlikely",
      min: 28,
      max: Infinity,
      colorClass: COLORS.purple.row,
      dotColor: COLORS.purple.dot,
      note: "Extremely rare naturally. Re-check inputs (height, bf%, weight).",
    },
  ];
}

function inRange(v: number, row: RangeRow) {
  return v >= row.min && v < row.max;
}

function formatRange(min: number, max: number) {
  if (max === Infinity) return `${min}+`;
  // show 1 decimal only when needed
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
  return `${fmt(min)}–${fmt(max)}`;
}

export default function FFMIInterpretation({
  gender,
  ffmi = null,
  className = "",
}: Props) {
  // ✅ if gender passed, act controlled; otherwise show toggle
  const [localGender, setLocalGender] = useState<Gender>("male");
  const activeGender = gender ?? localGender;
  const showToggle = gender == null;

  const rows = useMemo(() => getFFMIRanges(activeGender), [activeGender]);

  const v = typeof ffmi === "number" ? clamp(ffmi, 0, 60) : null;

  const activeRow = useMemo(() => {
    if (v == null) return null;
    return rows.find((r) => inRange(v, r)) ?? null;
  }, [v, rows]);

  return (
    <section className={`w-full max-w-3xl ${className}`}>
      <div className="p-5">
        {/* Headline */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span>
              FFMI  Interpretation
            </span>

            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-base font-semibold tracking-wide text-gray-700">
              {activeGender === "female" ? "WOMEN" : "MEN"}
            </span>
          </h2>

          {showToggle && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-600">Gender</span>
              <div className="join">
                <button
                  type="button"
                  className={`btn btn-sm join-item ${
                    activeGender === "male" ? "btn-primary text-white" : "btn-ghost"
                  }`}
                  onClick={() => setLocalGender("male")}
                >
                  Men
                </button>
                <button
                  type="button"
                  className={`btn btn-sm join-item ${
                    activeGender === "female" ? "btn-primary text-white" : "btn-ghost"
                  }`}
                  onClick={() => setLocalGender("female")}
                >
                  Women
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-lg text-gray-700 leading-relaxed max-w-2xl">
            These ranges are a practical way to interpret <span className="italic">normalized FFMI</span>{" "}
            (lean mass relative to height). Use it to measure your change over time.
          </p>
        </div>

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
                  WHAT IT USUALLY MEANS
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => {
                const isActive = v != null && inRange(v, row);

                const cellBase = "px-4 py-4 align-top";
                const activeCell = isActive
                  ? "border-y-4 border-gray-900"
                  : "border-y border-transparent";

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
                      <div className="inline-flex items-center gap-2 text-gray-900">
                        <span className="font-semibold tabular-nums">
                          {formatRange(row.min, row.max)}
                        </span>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className={[cellBase, activeCell].join(" ")}>
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ background: row.dotColor }}
                        />
                        <div className="font-semibold text-gray-900">{row.label}</div>
                      </div>

                      <div className="mt-1 text-sm text-gray-700 sm:hidden">
                        {row.note}
                      </div>
                    </td>

                    {/* NOTE (desktop) */}
                    <td
                      className={[
                        cellBase,
                        activeCell,
                        "hidden sm:table-cell",
                        isActive ? "border-r-4 border-gray-900 rounded-r-xl" : "",
                      ].join(" ")}
                    >
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {row.note}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Optional highlight explanation */}
        {v != null && activeRow && (
          <div className="mt-6">
            <p className="text-gray-700 text-lg text-center leading-relaxed">
              Your FFMI of{" "}
              <span className="font-semibold text-gray-900">{v.toFixed(1)}</span>{" "}
              falls into{" "}
              <span className="font-semibold text-gray-900">{activeRow.label}</span>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
