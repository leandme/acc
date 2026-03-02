"use client";

import React from "react";

type Units = "metric" | "imperial";

type Props = {
  bodyFat: number | null;
  units: Units;
  weight: number | null;
  prefilledFromRefine?: boolean;
  onUnitsChange: (units: Units) => void;
  onWeightChange: (weight: number | null) => void;
  className?: string;
};

const KG_PER_LB = 0.45359237;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function toKg(value: number, units: Units) {
  return units === "metric" ? value : value * KG_PER_LB;
}

function fromKg(value: number, units: Units) {
  return units === "metric" ? value : value / KG_PER_LB;
}

function formatMass(kg: number, units: Units) {
  const value = fromKg(kg, units);
  const rounded = Number(value.toFixed(1));
  return `${rounded} ${units === "metric" ? "kg" : "lb"}`;
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default function EstimateCompositionSnapshot({
  bodyFat,
  units,
  weight,
  prefilledFromRefine = false,
  onUnitsChange,
  onWeightChange,
  className = "",
}: Props) {
  if (typeof bodyFat !== "number") return null;

  const hasWeight = typeof weight === "number" && Number.isFinite(weight) && weight > 0;
  const weightKg = hasWeight ? toKg(weight, units) : null;
  const fatMassKg = weightKg !== null ? weightKg * (bodyFat / 100) : null;
  const leanMassKg = weightKg !== null ? weightKg - fatMassKg! : null;
  const minWeight = units === "metric" ? 36 : 80;
  const maxWeight = units === "metric" ? 190 : 420;
  const defaultWeight = units === "metric" ? 75 : 165;
  const weightSliderValue = hasWeight ? clamp(weight!, minWeight, maxWeight) : defaultWeight;
  const weightLabel = `${Number(weightSliderValue.toFixed(1))} ${units === "metric" ? "kg" : "lb"}`;

  return (
    <section className={`w-full max-w-3xl ${className}`}>
      <div className="p-5">
        <h2 className="text-3xl lg:text-4xl font-semibold text-center">
          {hasWeight ? "Current Body Snapshot" : "Unlock Composition Details"}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          {hasWeight
            ? "A practical breakdown of your current composition from body-fat percentage and weight."
            : "Add your weight to unlock estimated fat mass and lean mass from your body-fat result."}
        </p>

        <div className="mt-8 rounded-2xl bg-white p-4 sm:p-5">
          <div className="flex items-center justify-center gap-3">
            <span
              className={`text-sm font-semibold ${
                units === "imperial" ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Imperial
            </span>

            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={units === "metric"}
              onChange={(e) => onUnitsChange(e.target.checked ? "metric" : "imperial")}
              aria-label="Toggle imperial/metric"
            />

            <span
              className={`text-sm font-semibold ${
                units === "metric" ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Metric
            </span>
          </div>

          <div className="mt-5 max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">
                Weight ({units === "metric" ? "kg" : "lb"})
              </span>
              <span className="text-2xl font-semibold text-gray-900 whitespace-nowrap">
                {weightLabel}
              </span>
            </div>

            <input
              type="range"
              className="range range-primary mt-3"
              min={minWeight}
              max={maxWeight}
              step={0.1}
              value={weightSliderValue}
              onChange={(e) => onWeightChange(Number(e.target.value))}
            />
          </div>

          {prefilledFromRefine && hasWeight ? (
            <div className="mt-3 text-center">
              <p className="inline-flex rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                Prefilled from refine estimate
              </p>
            </div>
          ) : null}
        </div>

        {hasWeight && fatMassKg !== null && leanMassKg !== null ? (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard label="Current Weight" value={formatMass(weightKg!, units)} />
            <StatCard label="Body Fat" value={`${bodyFat.toFixed(1)}%`} />
            <StatCard label="Fat Mass" value={formatMass(fatMassKg, units)} />
            <StatCard label="Lean Mass" value={formatMass(leanMassKg, units)} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
