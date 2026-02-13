"use client";

import React, { useMemo, useState } from "react";

type Gender = "male" | "female";

type Props = {
  gender?: Gender;
  rfm?: number | null;
  className?: string;
};

type RangeRow = {
  key: string;
  label: string;
  min: number;
  max: number;
  colorClass: string;
  dotColor: string;
  note: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const COLORS = {
  blue: { row: "bg-blue-50", dot: "#3b82f6" },
  green: { row: "bg-green-50", dot: "#22c55e" },
  yellow: { row: "bg-yellow-50", dot: "#fde047" },
  orange: { row: "bg-orange-50", dot: "#f59e0b" },
  red: { row: "bg-red-50", dot: "#ef4444" },
};

function getRFMRanges(gender: Gender): RangeRow[] {
  if (gender === "female") {
    return [
      {
        key: "essential",
        label: "Essential",
        min: 0,
        max: 14,
        colorClass: COLORS.blue.row,
        dotColor: COLORS.blue.dot,
        note: "Extremely lean range that is hard to sustain for most people.",
      },
      {
        key: "athletic",
        label: "Athletic",
        min: 14,
        max: 21,
        colorClass: COLORS.green.row,
        dotColor: COLORS.green.dot,
        note: "Lean, sport-oriented range with visible muscular definition.",
      },
      {
        key: "fitness",
        label: "Fitness",
        min: 21,
        max: 25,
        colorClass: COLORS.yellow.row,
        dotColor: COLORS.yellow.dot,
        note: "Generally fit range and common target for active women.",
      },
      {
        key: "average",
        label: "Average",
        min: 25,
        max: 32,
        colorClass: COLORS.orange.row,
        dotColor: COLORS.orange.dot,
        note: "Common range in general adult populations.",
      },
      {
        key: "high",
        label: "High",
        min: 32,
        max: Infinity,
        colorClass: COLORS.red.row,
        dotColor: COLORS.red.dot,
        note: "Higher body-fat range. Focus on long-term trend changes.",
      },
    ];
  }

  return [
    {
      key: "essential",
      label: "Essential",
      min: 0,
      max: 6,
      colorClass: COLORS.blue.row,
      dotColor: COLORS.blue.dot,
      note: "Extremely lean range that is hard to sustain for most people.",
    },
    {
      key: "athletic",
      label: "Athletic",
      min: 6,
      max: 14,
      colorClass: COLORS.green.row,
      dotColor: COLORS.green.dot,
      note: "Lean, performance-focused range with strong definition.",
    },
    {
      key: "fitness",
      label: "Fitness",
      min: 14,
      max: 18,
      colorClass: COLORS.yellow.row,
      dotColor: COLORS.yellow.dot,
      note: "Fit range often seen in regularly active men.",
    },
    {
      key: "average",
      label: "Average",
      min: 18,
      max: 25,
      colorClass: COLORS.orange.row,
      dotColor: COLORS.orange.dot,
      note: "Common range in general adult populations.",
    },
    {
      key: "high",
      label: "High",
      min: 25,
      max: Infinity,
      colorClass: COLORS.red.row,
      dotColor: COLORS.red.dot,
      note: "Higher body-fat range. Prioritize sustainable habits and trend tracking.",
    },
  ];
}

function inRange(v: number, row: RangeRow) {
  return v >= row.min && v < row.max;
}

function formatRange(min: number, max: number) {
  if (max === Infinity) return `${min}+%`;
  return `${min}-${max}%`;
}

export default function RFMInterpretation({
  gender,
  rfm = null,
  className = "",
}: Props) {
  const [localGender, setLocalGender] = useState<Gender>("male");
  const activeGender = gender ?? localGender;
  const showToggle = gender == null;

  const rows = useMemo(() => getRFMRanges(activeGender), [activeGender]);
  const value = typeof rfm === "number" ? clamp(rfm, 0, 70) : null;

  const activeRow = useMemo(() => {
    if (value == null) return null;
    return rows.find((row) => inRange(value, row)) ?? null;
  }, [value, rows]);

  return (
    <section className={`w-full max-w-3xl ${className}`}>
      <div className="p-5">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span>RFM Category Ranges</span>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-base font-semibold tracking-wide text-gray-700">
              {activeGender === "female" ? "WOMEN" : "MEN"}
            </span>
          </h2>

          {showToggle ? (
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
          ) : null}

          <p className="text-center text-lg text-gray-700 leading-relaxed max-w-2xl">
            RFM estimates body-fat percentage from height and waist circumference. Use this table to
            interpret your whole-number result by sex.
          </p>
        </div>

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
                const isActive = value != null && inRange(value, row);
                const cellBase = "px-4 py-4 align-top";
                const activeCell = isActive
                  ? "border-y-4 border-gray-900"
                  : "border-y border-transparent";

                return (
                  <tr key={row.key} className={row.colorClass}>
                    <td
                      className={[
                        cellBase,
                        activeCell,
                        isActive ? "border-l-4 border-gray-900 rounded-l-xl" : "",
                      ].join(" ")}
                    >
                      <div className="inline-flex items-center gap-2 text-gray-900">
                        <span className="font-semibold tabular-nums">{formatRange(row.min, row.max)}</span>
                      </div>
                    </td>

                    <td className={[cellBase, activeCell].join(" ")}>
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ background: row.dotColor }}
                        />
                        <div className="font-semibold text-gray-900">{row.label}</div>
                      </div>

                      <div className="mt-1 text-sm text-gray-700 sm:hidden">{row.note}</div>
                    </td>

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

        {value != null && activeRow ? (
          <div className="mt-6">
            <p className="text-gray-700 text-lg text-center leading-relaxed">
              Your RFM result of <span className="font-semibold text-gray-900">{value}%</span> falls in the{" "}
              <span className="font-semibold text-gray-900">{activeRow.label}</span> range.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
