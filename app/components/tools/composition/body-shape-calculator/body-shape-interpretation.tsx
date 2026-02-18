"use client";

import React from "react";
import { BODY_SHAPE_ROWS, type BodyShapeKey } from "@/app/components/tools/composition/body-shape-calculator/body-shape-types";

export default function BodyShapeInterpretation({
  shape,
  topScore,
}: {
  shape: BodyShapeKey | null;
  topScore: number | null;
}) {
  return (
    <section className="w-full max-w-3xl">
      <div className="p-5">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">Body Shape Interpretation</h2>
          <p className="text-center text-lg text-gray-700 leading-relaxed max-w-2xl">
            The highlighted row shows your current best-fit category based on bust/chest, waist, and hip
            proportions.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">SHAPE</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">MEASUREMENT PATTERN</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">WHAT IT USUALLY MEANS</th>
              </tr>
            </thead>
            <tbody>
              {BODY_SHAPE_ROWS.map((row) => {
                const isActive = shape === row.key;
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
                      <span className="font-semibold text-gray-900">{row.label}</span>
                    </td>
                    <td className={[cellBase, activeCell].join(" ")}>
                      <p className="text-sm text-gray-700 leading-relaxed">{row.pattern}</p>
                      <p className="mt-2 text-sm text-gray-700 sm:hidden">{row.note}</p>
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

        {shape && topScore != null ? (
          <div className="mt-6">
            <p className="text-gray-700 text-lg text-center leading-relaxed">
              Current best-fit shape: <span className="font-semibold text-gray-900">{BODY_SHAPE_ROWS.find((row) => row.key === shape)?.label}</span>
              {" "}with <span className="font-semibold text-gray-900">{Math.round(topScore)}%</span> match strength.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
