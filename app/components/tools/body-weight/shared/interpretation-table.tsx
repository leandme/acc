"use client";

import React from "react";
import { clamp, round } from "./math";
import { findRangeBucket, type RangeBucket } from "./ui";

function formatRangeValue(value: number, digits: number) {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(digits);
}

export function formatRange(min: number, max: number, digits = 1) {
  if (!Number.isFinite(max)) {
    return `${formatRangeValue(min, digits)}+`;
  }

  return `${formatRangeValue(min, digits)}-${formatRangeValue(max, digits)}`;
}

export default function InterpretationTable({
  title,
  subtitle,
  value,
  ranges,
  valueDigits = 1,
  rangeDigits = 1,
  unitsLabel,
}: {
  title: string;
  subtitle: string;
  value: number | null;
  ranges: RangeBucket[];
  valueDigits?: number;
  rangeDigits?: number;
  unitsLabel?: string;
}) {
  const minBound = ranges[0]?.min ?? 0;
  const maxBound = ranges[ranges.length - 1]?.max;

  const boundedValue =
    typeof value === "number"
      ? clamp(value, minBound, Number.isFinite(maxBound) ? maxBound : value)
      : null;

  const activeRow =
    typeof boundedValue === "number" ? findRangeBucket(boundedValue, ranges) : null;

  return (
    <section className="w-full max-w-3xl">
      <div className="p-5">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">{title}</h2>
          <p className="text-center text-lg text-gray-700 leading-relaxed max-w-2xl">{subtitle}</p>
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
              {ranges.map((row) => {
                const isActive = boundedValue != null && boundedValue >= row.min && boundedValue < row.max;
                const cellBase = "px-4 py-4 align-top";
                const activeCell = isActive ? "border-y-4 border-gray-900" : "border-y border-transparent";

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
                        {formatRange(row.min, row.max, rangeDigits)}
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

        {boundedValue != null && activeRow ? (
          <div className="mt-6">
            <p className="text-gray-700 text-lg text-center leading-relaxed">
              Your result of <span className="font-semibold text-gray-900">{round(boundedValue, valueDigits)}</span>
              {unitsLabel ? <span className="font-semibold text-gray-900"> {unitsLabel}</span> : null} falls in{" "}
              <span className="font-semibold text-gray-900">{activeRow.label}</span>.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
