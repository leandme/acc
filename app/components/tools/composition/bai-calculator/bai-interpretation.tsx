"use client";

import React, { useMemo, useState } from "react";
import { findBAIRange, getAgeBand, getBAIRanges, type Sex } from "./bai-ranges";

type Props = {
  sex?: Sex;
  age?: number;
  bai?: number | null;
  className?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function inRange(v: number, min: number, max: number) {
  return v >= min && v < max;
}

function formatRange(min: number, max: number) {
  if (max === Infinity) return `${min.toFixed(1)}+`;
  return `${min.toFixed(1)}-${max.toFixed(1)}`;
}

export default function BAIInterpretation({
  sex,
  age,
  bai = null,
  className = "",
}: Props) {
  const [localSex, setLocalSex] = useState<Sex>("male");
  const [localAge, setLocalAge] = useState<number>(30);

  const activeSex = sex ?? localSex;
  const activeAge = clamp(age ?? localAge, 20, 79);
  const showControls = sex == null || age == null;

  const rows = useMemo(() => getBAIRanges(activeSex, activeAge), [activeSex, activeAge]);
  const value = typeof bai === "number" ? clamp(bai, 0, 70) : null;

  const activeRow = useMemo(() => {
    if (value == null) return null;
    return findBAIRange(activeSex, activeAge, value);
  }, [activeSex, activeAge, value]);

  return (
    <section className={`w-full max-w-3xl ${className}`}>
      <div className="p-5">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span>BAI Interpretation Ranges</span>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-base font-semibold tracking-wide text-gray-700">
              {activeSex === "female" ? "WOMEN" : "MEN"}
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-base font-semibold tracking-wide text-gray-700">
              AGES {getAgeBand(activeAge)}
            </span>
          </h2>

          {showControls ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
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

              <select
                className="select select-sm select-bordered"
                value={activeAge}
                onChange={(e) => setLocalAge(Number(e.target.value))}
                aria-label="Select age"
              >
                {Array.from({ length: 60 }).map((_, i) => {
                  const ageValue = i + 20;
                  return (
                    <option key={ageValue} value={ageValue}>
                      Age {ageValue}
                    </option>
                  );
                })}
              </select>
            </div>
          ) : null}

          <p className="text-center text-lg text-gray-700 leading-relaxed max-w-2xl">
            These ranges are used to interpret BAI values as an estimated adiposity percentage by sex
            and age band. Use them as trend categories, not diagnosis.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
                  BAI RANGE
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
              Your BAI of <span className="font-semibold text-gray-900">{value.toFixed(1)}</span> is in the{" "}
              <span className="font-semibold text-gray-900">{activeRow.label}</span> range for{" "}
              {activeSex === "female" ? "women" : "men"}, ages {getAgeBand(activeAge)}.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
