"use client";

import React, { useEffect, useRef, useState } from "react";

type Units = "metric" | "imperial";
type Gender = "male" | "female";
type DeficitKey = "low" | "medium" | "high";

type Props = {
  bodyFat: number | null;
  gender?: Gender;
  units: Units;
  weight: number | null;
  prefilledFromRefine?: boolean;
  onUnitsChange: (units: Units) => void;
  onWeightChange: (weight: number | null) => void;
  className?: string;
};

const KG_PER_LB = 0.45359237;
const CALORIES_PER_LB_FAT = 3500;

const DEFICIT_OPTIONS: Array<{
  key: DeficitKey;
  label: string;
  kcal: number;
}> = [
  { key: "low", label: "Low", kcal: 300 },
  { key: "medium", label: "Medium", kcal: 500 },
  { key: "high", label: "High", kcal: 750 },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function toKg(value: number, units: Units) {
  return units === "metric" ? value : value * KG_PER_LB;
}

function fromKg(value: number, units: Units) {
  return units === "metric" ? value : value / KG_PER_LB;
}

function getWeightConfig(units: Units) {
  return units === "metric"
    ? { min: 40, max: 190, step: 0.1, defaultWeight: 75, deltaGoal: 7 }
    : { min: 90, max: 420, step: 0.5, defaultWeight: 165, deltaGoal: 15 };
}

function defaultGoalWeight(currentWeight: number, units: Units) {
  const config = getWeightConfig(units);
  return clamp(
    Number((currentWeight - config.deltaGoal).toFixed(1)),
    config.min,
    currentWeight
  );
}

function formatWeight(value: number, units: Units) {
  const decimals = units === "metric" ? 1 : value % 1 === 0 ? 0 : 1;
  return `${value.toFixed(decimals)} ${units === "metric" ? "kg" : "lb"}`;
}

function formatInteger(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
}

function getDeficitPillClasses(optionKey: DeficitKey, isSelected: boolean) {
  if (optionKey === "low") {
    return isSelected
      ? "border-green-700 bg-green-600 text-white"
      : "border-green-200 bg-green-50 text-green-800 hover:bg-green-100";
  }
  if (optionKey === "medium") {
    return isSelected
      ? "border-yellow-700 bg-yellow-500 text-white"
      : "border-yellow-200 bg-yellow-50 text-yellow-800 hover:bg-yellow-100";
  }
  return isSelected
    ? "border-red-700 bg-red-600 text-white"
    : "border-red-200 bg-red-50 text-red-800 hover:bg-red-100";
}

export default function EstimateCompositionSnapshot({
  bodyFat,
  gender = "male",
  units,
  weight,
  prefilledFromRefine = false,
  onUnitsChange,
  onWeightChange,
  className = "",
}: Props) {
  if (typeof bodyFat !== "number") return null;

  const config = getWeightConfig(units);
  const hasWeight = typeof weight === "number" && Number.isFinite(weight) && weight > 0;
  const currentWeight = hasWeight
    ? clamp(weight!, config.min, config.max)
    : config.defaultWeight;

  const [goalWeight, setGoalWeight] = useState<number>(() =>
    defaultGoalWeight(config.defaultWeight, units)
  );
  const [goalTouched, setGoalTouched] = useState(false);
  const [deficitKey, setDeficitKey] = useState<DeficitKey>("medium");
  const previousUnitsRef = useRef<Units>(units);

  useEffect(() => {
    if (!goalTouched) {
      setGoalWeight(defaultGoalWeight(currentWeight, units));
    }
  }, [currentWeight, units, goalTouched]);

  useEffect(() => {
    if (previousUnitsRef.current === units) return;

    if (goalTouched) {
      setGoalWeight((prevGoal) => {
        const nextConfig = getWeightConfig(units);
        const goalKg = toKg(prevGoal, previousUnitsRef.current);
        const convertedGoal = fromKg(goalKg, units);
        return clamp(
          Number(convertedGoal.toFixed(1)),
          nextConfig.min,
          nextConfig.max
        );
      });
    }

    previousUnitsRef.current = units;
  }, [units, goalTouched]);

  const clampedGoalWeight = clamp(goalWeight, config.min, currentWeight);

  useEffect(() => {
    if (goalWeight !== clampedGoalWeight) {
      setGoalWeight(clampedGoalWeight);
    }
  }, [goalWeight, clampedGoalWeight]);

  const selectedDeficit = DEFICIT_OPTIONS.find((item) => item.key === deficitKey) ?? DEFICIT_OPTIONS[1];
  const weightToLose = Math.max(currentWeight - clampedGoalWeight, 0);
  const weightToLoseLb = units === "metric" ? weightToLose / KG_PER_LB : weightToLose;
  const totalCaloriesRequired = Math.max(0, Math.round(weightToLoseLb * CALORIES_PER_LB_FAT));
  const daysToGoal =
    weightToLoseLb > 0
      ? Math.ceil(totalCaloriesRequired / selectedDeficit.kcal)
      : 0;
  const weeksToGoal = daysToGoal / 7;
  const roundedWeeksToGoal = Math.round(weeksToGoal);

  const currentWeightKg = toKg(currentWeight, units);
  const goalWeightKg = toKg(clampedGoalWeight, units);
  const leanMassKg = currentWeightKg * (1 - bodyFat / 100);
  const projectedGoalBodyFatRaw = ((goalWeightKg - leanMassKg) / goalWeightKg) * 100;
  const projectedGoalBodyFat = clamp(projectedGoalBodyFatRaw, 2, 60);
  const goalBelowLeanMass = goalWeightKg <= leanMassKg;

  return (
    <section className={`w-full max-w-3xl ${className}`}>
      <div className="p-5">
        <h2 className="text-3xl lg:text-4xl font-semibold text-center">
          How to Reach Your Goal Weight
        </h2>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span
            className={`text-sm font-semibold ${
              units === "imperial" ? "text-gray-900" : "text-gray-500"
            }`}
          >
            Imperial
          </span>

          <input
            type="checkbox"
            className="toggle toggle-lg toggle-primary"
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

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Current Weight</span>
                <span className="text-2xl font-semibold text-gray-900 whitespace-nowrap">
                  {formatWeight(currentWeight, units)}
                </span>
              </div>

              <input
                type="range"
                className="range range-primary mt-1"
                min={config.min}
                max={config.max}
                step={config.step}
                value={currentWeight}
                onChange={(e) => onWeightChange(Number(e.target.value))}
              />

              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Goal Weight</span>
                <span className="text-2xl font-semibold text-gray-900 whitespace-nowrap">
                  {formatWeight(clampedGoalWeight, units)}
                </span>
              </div>

              <input
                type="range"
                className="range range-primary mt-1"
                min={config.min}
                max={currentWeight}
                step={config.step}
                value={clampedGoalWeight}
                onChange={(e) => {
                  setGoalTouched(true);
                  setGoalWeight(Number(e.target.value));
                }}
              />

              <div className="mt-1">
                <p className="text-lg font-semibold text-gray-900">Daily Calorie Deficit</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {DEFICIT_OPTIONS.map((option) => {
                    const isSelected = option.key === deficitKey;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setDeficitKey(option.key)}
                        className={[
                          "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                          getDeficitPillClasses(option.key, isSelected),
                        ].join(" ")}
                      >
                        {option.label} ({option.kcal} kcal)
                      </button>
                    );
                  })}
                </div>
              </div>

              {prefilledFromRefine && hasWeight ? (
                <div className="text-center">
                  <p className="inline-flex rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                    Prefilled from refine estimate
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-blue-700">Days to Goal</p>
                <p className="mt-2 text-3xl font-semibold text-blue-900">{daysToGoal}</p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">Body Fat at Goal</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-900">
                  {goalBelowLeanMass ? "<2%" : `${projectedGoalBodyFat.toFixed(1)}%`}
                </p>
              </div>

              <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-purple-700">Total Calories Required</p>
                <p className="mt-2 text-3xl font-semibold text-purple-900">
                  {formatInteger(totalCaloriesRequired)} kcal
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-lg text-gray-700">
          At this daily deficit, you'll reach your goal in{" "}
          <span className="font-semibold text-gray-900">{roundedWeeksToGoal} weeks</span>.
        </p>

        {goalBelowLeanMass ? (
          <p className="mt-2 text-sm text-center text-amber-700">
            Your goal weight drops below estimated lean mass at your current body-fat estimate. Consider a higher goal weight.
          </p>
        ) : null}
      </div>
    </section>
  );
}
