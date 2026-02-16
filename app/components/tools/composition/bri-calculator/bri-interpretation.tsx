"use client";

import React, { useMemo } from "react";
import { findBRIRange, getBRIRanges } from "./bri-ranges";

type Props = {
  bri?: number | null;
  className?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function inRange(v: number, min: number, max: number) {
  return v >= min && v < max;
}

function formatRange(min: number, max: number) {
  if (max === Infinity) return `${min.toFixed(2)}+`;
  return `${min.toFixed(2)}-${max.toFixed(2)}`;
}

export default function BRIInterpretation({ bri = null, className = "" }: Props) {
  const rows = useMemo(() => getBRIRanges(), []);
  const value = typeof bri === "number" ? clamp(bri, 0, 30) : null;

  const activeRow = useMemo(() => {
    if (value == null) return null;
    return findBRIRange(value);
  }, [value]);

  return (
    <section className={`w-full max-w-3xl ${className}`}>
      <div className="p-5">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">BRI Interpretation Ranges</h2>

          <p className="text-center text-lg text-gray-700 leading-relaxed max-w-2xl">
            These are practical body-roundness ranges based on BRI. Use them as trend categories, not a
            diagnosis.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
                  BRI RANGE
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
                const isActive = value != null && inRange(value, row.min, row.max);
                const cellBase = "px-4 py-4 align-top";
                const activeCell = isActive
                  ? "border-y-4 border-gray-900"
                  : "border-y border-transparent";

                return (
                  <tr key={row.key} className={row.rowClass}>
                    <td
                      className={[
                        cellBase,
                        activeCell,
                        isActive ? "border-l-4 border-gray-900 rounded-l-xl" : "",
                      ].join(" ")}
                    >
                      <span className="font-semibold tabular-nums text-gray-900">
                        {formatRange(row.min, row.max)}
                      </span>
                    </td>

                    <td className={[cellBase, activeCell].join(" ")}>
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: row.color }} />
                        <span className="font-semibold text-gray-900">{row.label}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-700 sm:hidden">{row.note}</p>
                    </td>

                    <td
                      className={[
                        cellBase,
                        activeCell,
                        "hidden sm:table-cell",
                        isActive ? "border-r-4 border-gray-900 rounded-r-xl" : "",
                      ].join(" ")}
                    >
                      <p className="text-sm text-gray-700 leading-relaxed">{row.note}</p>
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
              Your BRI of <span className="font-semibold text-gray-900">{value.toFixed(2)}</span> is in the{" "}
              <span className="font-semibold text-gray-900">{activeRow.label}</span> range.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
