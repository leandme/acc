"use client";

import React, { useMemo, useState } from "react";
import { findFrameRange, getFrameRanges, type Sex } from "./frame-ranges";

type Props = {
  sex?: Sex;
  ratio?: number | null;
  className?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function inRange(v: number, min: number, max: number) {
  return v >= min && v < max;
}

function formatRange(min: number, max: number) {
  if (max === Infinity) return `>${min.toFixed(1)}`;
  return `${min.toFixed(1)}-${max.toFixed(1)}`;
}

export default function FrameInterpretation({ sex, ratio = null, className = "" }: Props) {
  const [localSex, setLocalSex] = useState<Sex>("male");
  const activeSex = sex ?? localSex;
  const showToggle = sex == null;

  const rows = useMemo(() => getFrameRanges(activeSex), [activeSex]);
  const value = typeof ratio === "number" ? clamp(ratio, 0, 20) : null;

  const activeRow = useMemo(() => {
    if (value == null) return null;
    return findFrameRange(activeSex, value);
  }, [activeSex, value]);

  return (
    <section className={`w-full max-w-3xl ${className}`}>
      <div className="p-5">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span>Body Frame Size Ranges</span>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-base font-semibold tracking-wide text-gray-700">
              {activeSex === "female" ? "WOMEN" : "MEN"}
            </span>
          </h2>

          {showToggle ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-600">Gender</span>
              <div className="join">
                <button
                  type="button"
                  className={`btn btn-sm join-item ${
                    activeSex === "male" ? "btn-primary text-white" : "btn-ghost"
                  }`}
                  onClick={() => setLocalSex("male")}
                >
                  Men
                </button>
                <button
                  type="button"
                  className={`btn btn-sm join-item ${
                    activeSex === "female" ? "btn-primary text-white" : "btn-ghost"
                  }`}
                  onClick={() => setLocalSex("female")}
                >
                  Women
                </button>
              </div>
            </div>
          ) : null}

          <p className="text-center text-lg text-gray-700 leading-relaxed max-w-2xl">
            Body frame size here is based on the height-to-wrist ratio. Higher ratios generally indicate a
            smaller frame, while lower ratios indicate a larger frame.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
                  RATIO (HEIGHT / WRIST)
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
                  FRAME SIZE
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">
                  PRACTICAL USE
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
                      <p className="mt-1 text-sm text-gray-700 sm:hidden">{row.adjustment}</p>
                    </td>

                    <td
                      className={[
                        cellBase,
                        activeCell,
                        "hidden sm:table-cell",
                        isActive ? "border-r-4 border-gray-900 rounded-r-xl" : "",
                      ].join(" ")}
                    >
                      <p className="text-sm text-gray-700 leading-relaxed">{row.adjustment}</p>
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
              Your ratio of <span className="font-semibold text-gray-900">{value.toFixed(2)}</span> falls in the{" "}
              <span className="font-semibold text-gray-900">{activeRow.label}</span> category.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
