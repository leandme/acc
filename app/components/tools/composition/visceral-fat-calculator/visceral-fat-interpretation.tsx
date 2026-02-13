"use client";

import React, { useMemo } from "react";

type Props = {
  value?: number | null;
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

const ROWS: RangeRow[] = [
  {
    key: "low",
    label: "Low",
    min: 0,
    max: 80,
    colorClass: "bg-blue-50",
    dotColor: "#3b82f6",
    note: "Lower estimated visceral fat area.",
  },
  {
    key: "moderate",
    label: "Moderate",
    min: 80,
    max: 130,
    colorClass: "bg-green-50",
    dotColor: "#22c55e",
    note: "Moderate estimated visceral fat area.",
  },
  {
    key: "obesity",
    label: "Visceral Obesity",
    min: 130,
    max: 170,
    colorClass: "bg-yellow-50",
    dotColor: "#fde047",
    note: "At or above the commonly cited 130 cm2 visceral obesity threshold.",
  },
  {
    key: "high",
    label: "High",
    min: 170,
    max: 220,
    colorClass: "bg-orange-50",
    dotColor: "#f59e0b",
    note: "High estimated visceral fat area.",
  },
  {
    key: "very-high",
    label: "Very High",
    min: 220,
    max: Infinity,
    colorClass: "bg-red-50",
    dotColor: "#ef4444",
    note: "Very high estimated visceral fat area.",
  },
];

function inRange(v: number, row: RangeRow) {
  return v >= row.min && v < row.max;
}

function formatRange(min: number, max: number) {
  if (max === Infinity) return `${Math.round(min)}+ cm2`;
  return `${Math.round(min)}-${Math.round(max)} cm2`;
}

export default function VisceralFatInterpretation({ value = null, className = "" }: Props) {
  const v = typeof value === "number" ? clamp(value, 0, 1000) : null;

  const activeRow = useMemo(() => {
    if (v == null) return null;
    return ROWS.find((row) => inRange(v, row)) ?? null;
  }, [v]);

  return (
    <section className={`w-full max-w-3xl ${className}`}>
      <div className="p-5">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">Visceral Fat Area Ranges</h2>

          <p className="text-center text-lg text-gray-700 leading-relaxed max-w-2xl">
            These are practical interpretation bands for estimated visceral fat area (VAT, cm2). Use this
            as a trend and screening signal, not a diagnosis.
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
              {ROWS.map((row) => {
                const isActive = v != null && inRange(v, row);
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

        {v != null && activeRow ? (
          <div className="mt-6">
            <p className="text-gray-700 text-lg text-center leading-relaxed">
              Your estimated VAT of <span className="font-semibold text-gray-900">{Math.round(v)} cm2</span>{" "}
              falls in the <span className="font-semibold text-gray-900">{activeRow.label}</span> range.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
