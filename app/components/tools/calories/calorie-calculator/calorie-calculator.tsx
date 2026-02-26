"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Gauge,
  InterpretationBar,
  SliderRow,
  UnitToggle,
  findRangeBucket,
} from "@/app/components/tools/body-weight/shared/ui";
import {
  formatFeetInches,
  inToCm,
  kgToLb,
  lbToKg,
  round,
  type Sex,
  type Units,
} from "@/app/components/tools/body-weight/shared/math";
import {
  ACTIVITY_LEVELS,
  getActivityLevel,
  mifflinStJeorBmr,
  type ActivityLevelKey,
} from "@/app/components/tools/body-weight/shared/weight-projection";
import { CALORIE_GOAL_ADJUSTMENT_RANGES } from "./calorie-ranges";

type EquationKey = "mifflin" | "harris-benedict";

type Props = {
  onChange?: (payload: {
    bmr: number;
    tdee: number;
    targetCalories: number;
    adjustmentPct: number;
    activityFactor: number;
    activityLabel: string;
    goalLabel: string;
  }) => void;
};

type GoalPreset = {
  key: string;
  label: string;
  adjustmentPct: number;
};

const GOAL_PRESETS: GoalPreset[] = [
  { key: "aggressive-fat-loss", label: "Aggressive Fat Loss", adjustmentPct: -25 },
  { key: "fat-loss", label: "Fat Loss", adjustmentPct: -20 },
  { key: "moderate-fat-loss", label: "Moderate Fat Loss", adjustmentPct: -15 },
  { key: "mild-fat-loss", label: "Mild Fat Loss", adjustmentPct: -10 },
  { key: "maintenance", label: "Maintenance", adjustmentPct: 0 },
  { key: "lean-gain", label: "Lean Gain", adjustmentPct: 10 },
  { key: "gain", label: "Gain", adjustmentPct: 15 },
];

function revisedHarrisBenedictBmr(params: {
  sex: Sex;
  ageYears: number;
  heightCm: number;
  weightKg: number;
}) {
  const { sex, ageYears, heightCm, weightKg } = params;
  if (sex === "male") {
    return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * ageYears;
  }

  return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * ageYears;
}

function formatAdjustmentPct(value: number) {
  if (value === 0) return "0%";
  return `${value > 0 ? "+" : ""}${round(value, 1)}%`;
}

export default function CalorieCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");
  const [equation, setEquation] = useState<EquationKey>("mifflin");
  const [activityKey, setActivityKey] = useState<ActivityLevelKey>("moderate");

  const [ageYears, setAgeYears] = useState<number>(35);
  const [heightCm, setHeightCm] = useState<number>(177.8); // 5'10"
  const [weightKg, setWeightKg] = useState<number>(81.6); // 180 lb
  const [adjustmentPct, setAdjustmentPct] = useState<number>(-15);

  const heightIn = useMemo(() => Math.round(heightCm / 2.54), [heightCm]);
  const weightLb = useMemo(() => Math.round(kgToLb(weightKg)), [weightKg]);
  const activity = useMemo(() => getActivityLevel(activityKey), [activityKey]);

  const mifflinBmr = useMemo(
    () =>
      mifflinStJeorBmr({
        sex,
        ageYears,
        heightCm,
        weightKg,
      }),
    [sex, ageYears, heightCm, weightKg],
  );

  const harrisBmr = useMemo(
    () =>
      revisedHarrisBenedictBmr({
        sex,
        ageYears,
        heightCm,
        weightKg,
      }),
    [sex, ageYears, heightCm, weightKg],
  );

  const bmr = equation === "mifflin" ? mifflinBmr : harrisBmr;
  const tdee = bmr * activity.factor;
  const targetCalories = tdee * (1 + adjustmentPct / 100);
  const maintenanceDelta = targetCalories - tdee;

  const category = useMemo(
    () => findRangeBucket(adjustmentPct, CALORIE_GOAL_ADJUSTMENT_RANGES),
    [adjustmentPct],
  );

  const goalRows = useMemo(
    () =>
      GOAL_PRESETS.map((preset) => ({
        ...preset,
        targetCalories: tdee * (1 + preset.adjustmentPct / 100),
        range: findRangeBucket(preset.adjustmentPct, CALORIE_GOAL_ADJUSTMENT_RANGES),
      })),
    [tdee],
  );

  const closestPreset = useMemo(
    () =>
      goalRows.reduce((best, row) => {
        if (!best) return row;
        return Math.abs(row.adjustmentPct - adjustmentPct) <
          Math.abs(best.adjustmentPct - adjustmentPct)
          ? row
          : best;
      }, goalRows[0]),
    [goalRows, adjustmentPct],
  );

  useEffect(() => {
    onChange?.({
      bmr,
      tdee,
      targetCalories,
      adjustmentPct,
      activityFactor: activity.factor,
      activityLabel: activity.label,
      goalLabel: closestPreset.label,
    });
  }, [
    onChange,
    bmr,
    tdee,
    targetCalories,
    adjustmentPct,
    activity.factor,
    activity.label,
    closestPreset.label,
  ]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="rounded-3xl bg-white/80 backdrop-blur border shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="p-8 bg-white min-w-0">
            <div className="flex items-center justify-between">
              <UnitToggle units={units} onChange={setUnits} />
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="font-semibold text-gray-900">Sex</div>
              <select
                className="select select-bordered"
                value={sex}
                onChange={(e) => setSex(e.target.value as Sex)}
                aria-label="Select sex"
              >
                <option value="male">Men</option>
                <option value="female">Women</option>
              </select>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="font-semibold text-gray-900">Equation</div>
              <select
                className="select select-bordered"
                value={equation}
                onChange={(e) => setEquation(e.target.value as EquationKey)}
                aria-label="Select equation"
              >
                <option value="mifflin">Mifflin-St Jeor</option>
                <option value="harris-benedict">Revised Harris-Benedict</option>
              </select>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="font-semibold text-gray-900">Activity</div>
              <select
                className="select select-bordered"
                value={activityKey}
                onChange={(e) => setActivityKey(e.target.value as ActivityLevelKey)}
                aria-label="Select activity level"
              >
                {ACTIVITY_LEVELS.map((level) => (
                  <option key={level.key} value={level.key}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <SliderRow
              label="Age"
              valueLabel={`${ageYears} years`}
              value={ageYears}
              min={18}
              max={80}
              step={1}
              onChange={setAgeYears}
            />

            {units === "imperial" ? (
              <>
                <SliderRow
                  label="Height"
                  valueLabel={formatFeetInches(heightIn)}
                  value={heightIn}
                  min={55}
                  max={84}
                  step={1}
                  onChange={(inches) => setHeightCm(inToCm(inches))}
                />
                <SliderRow
                  label="Weight"
                  valueLabel={`${weightLb} lbs`}
                  value={weightLb}
                  min={70}
                  max={450}
                  step={1}
                  onChange={(lb) => setWeightKg(lbToKg(lb))}
                />
              </>
            ) : (
              <>
                <SliderRow
                  label="Height"
                  valueLabel={`${Math.round(heightCm)} cm`}
                  value={Math.round(heightCm)}
                  min={140}
                  max={214}
                  step={1}
                  onChange={setHeightCm}
                />
                <SliderRow
                  label="Weight"
                  valueLabel={`${round(weightKg, 1)} kg`}
                  value={round(weightKg, 1)}
                  min={32}
                  max={205}
                  step={0.1}
                  onChange={setWeightKg}
                />
              </>
            )}

            <SliderRow
              label="Target Adjustment"
              valueLabel={`${formatAdjustmentPct(adjustmentPct)} vs maintenance`}
              value={adjustmentPct}
              min={-30}
              max={20}
              step={1}
              onChange={setAdjustmentPct}
            />

            <div className="mt-6 rounded-xl bg-base-200/50 p-4 text-sm text-gray-700">
              Estimated maintenance at your current setup is{" "}
              <span className="font-semibold text-gray-900">{Math.round(tdee)} kcal/day</span>.
            </div>
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge
                value={targetCalories}
                label="Target kcal"
                rimColor={category.color}
                min={900}
                max={4800}
                digits={0}
              />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">BMR</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(bmr)} kcal</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Maintenance</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(tdee)} kcal</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Adjustment</div>
                  <div className="text-lg font-semibold text-gray-900">{formatAdjustmentPct(adjustmentPct)}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Delta</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {maintenanceDelta >= 0 ? "+" : ""}
                    {Math.round(maintenanceDelta)} kcal
                  </div>
                </div>
              </div>

              <div className="mt-6 w-full overflow-hidden rounded-xl border bg-white">
                <table className="w-full text-left text-xs sm:text-sm border-separate border-spacing-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 font-semibold text-gray-700">Goal</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 text-right">Target kcal/day</th>
                    </tr>
                  </thead>
                  <tbody>
                    {goalRows.map((row) => {
                      const isActive = row.key === closestPreset.key;
                      return (
                        <tr key={row.key} className={row.range.rowClass}>
                          <td
                            className={[
                              "px-3 py-2 text-gray-900",
                              isActive ? "border-l-4 border-gray-900 font-semibold" : "",
                            ].join(" ")}
                          >
                            {row.label}
                            <span className="ml-2 text-xs text-gray-600">({formatAdjustmentPct(row.adjustmentPct)})</span>
                          </td>
                          <td
                            className={[
                              "px-3 py-2 text-right tabular-nums",
                              isActive ? "font-semibold border-r-4 border-gray-900 bg-white" : "text-gray-700",
                            ].join(" ")}
                          >
                            {Math.round(row.targetCalories)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <InterpretationBar
          value={adjustmentPct}
          ranges={CALORIE_GOAL_ADJUSTMENT_RANGES}
          min={-30}
          max={25}
          ticks={[-30, -20, -10, 0, 10, 20, 25]}
        />
      </div>
    </div>
  );
}
