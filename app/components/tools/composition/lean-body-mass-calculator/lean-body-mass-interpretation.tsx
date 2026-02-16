"use client";

import React, { useMemo, useState } from "react";
import {
  findLeanMassRange,
  getLeanMassRanges,
  type Gender,
} from "./lbm-ranges";

type Props = {
  gender?: Gender;
  leanMassPct?: number | null;
  className?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function inRange(value: number, min: number, max: number) {
  return value >= min && value < max;
}

function formatRange(min: number, max: number) {
  if (max === Infinity) return `${min.toFixed(0)}+%`;
  return `${min.toFixed(0)}-${max.toFixed(0)}%`;
}

export default function LeanBodyMassInterpretation({
  gender,
  leanMassPct = null,
  className = "",
}: Props) {
  const [localGender, setLocalGender] = useState<Gender>("male");

  const activeGender = gender ?? localGender;
  const showToggle = gender == null;

  const rows = useMemo(() => getLeanMassRanges(activeGender), [activeGender]);
  const value = typeof leanMassPct === "number" ? clamp(leanMassPct, 0, 100) : null;

  const activeRow = useMemo(() => {
    if (value == null) return null;
    return findLeanMassRange(activeGender, value);
  }, [activeGender, value]);

  return (
    <section className={`w-full max-w-3xl ${className}`}>
      <div className="p-5">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span>Lean Body Mass Percentage Ranges</span>
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
            These bands interpret lean body mass as a percentage of total body weight. Use the result as a
            directional fitness metric, not a diagnosis.
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
                      <div className="inline-flex items-center gap-2 text-gray-900">
                        <span className="font-semibold tabular-nums">{formatRange(row.min, row.max)}</span>
                      </div>
                    </td>

                    <td className={[cellBase, activeCell].join(" ")}>
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: row.color }} />
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
              Your estimated lean body mass percentage of{" "}
              <span className="font-semibold text-gray-900">{value.toFixed(1)}%</span> falls in the{" "}
              <span className="font-semibold text-gray-900">{activeRow.label}</span> range.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
