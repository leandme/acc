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
import { MACRO_CALORIE_ADJUSTMENT_RANGES } from "@/app/components/tools/calories/macro-calculator/macro-ranges";

type MacroPresetKey =
  | "balanced"
  | "higher-protein"
  | "lower-carb"
  | "higher-carb"
  | "ketogenic";

type MacroPreset = {
  key: MacroPresetKey;
  label: string;
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
  rowClass: string;
};

type Props = {
  onChange?: (payload: {
    tdee: number;
    targetCalories: number;
    adjustmentPct: number;
    presetLabel: string;
    proteinG: number;
    carbsG: number;
    fatG: number;
  }) => void;
};

const MACRO_PRESETS: MacroPreset[] = [
  {
    key: "balanced",
    label: "Balanced",
    proteinPct: 30,
    carbsPct: 40,
    fatPct: 30,
    rowClass: "bg-green-50",
  },
  {
    key: "higher-protein",
    label: "Higher Protein",
    proteinPct: 35,
    carbsPct: 35,
    fatPct: 30,
    rowClass: "bg-blue-50",
  },
  {
    key: "lower-carb",
    label: "Lower Carb",
    proteinPct: 35,
    carbsPct: 25,
    fatPct: 40,
    rowClass: "bg-orange-50",
  },
  {
    key: "higher-carb",
    label: "Higher Carb",
    proteinPct: 25,
    carbsPct: 50,
    fatPct: 25,
    rowClass: "bg-yellow-50",
  },
  {
    key: "ketogenic",
    label: "Ketogenic",
    proteinPct: 30,
    carbsPct: 10,
    fatPct: 60,
    rowClass: "bg-red-50",
  },
];

function gramsFromPct(params: { totalCalories: number; pct: number; kcalPerGram: number }) {
  return (params.totalCalories * (params.pct / 100)) / params.kcalPerGram;
}

export default function MacroCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");
  const [activityKey, setActivityKey] = useState<ActivityLevelKey>("moderate");
  const [ageYears, setAgeYears] = useState<number>(32);
  const [heightCm, setHeightCm] = useState<number>(177.8); // 5'10"
  const [weightKg, setWeightKg] = useState<number>(86.2); // 190 lbs
  const [adjustmentPct, setAdjustmentPct] = useState<number>(-10);
  const [presetKey, setPresetKey] = useState<MacroPresetKey>("balanced");

  const activity = useMemo(() => getActivityLevel(activityKey), [activityKey]);
  const preset = useMemo(
    () => MACRO_PRESETS.find((item) => item.key === presetKey) ?? MACRO_PRESETS[0],
    [presetKey],
  );

  const heightIn = useMemo(() => Math.round(heightCm / 2.54), [heightCm]);
  const weightLb = useMemo(() => Math.round(kgToLb(weightKg)), [weightKg]);

  const bmr = useMemo(
    () =>
      mifflinStJeorBmr({
        sex,
        ageYears,
        heightCm,
        weightKg,
      }),
    [sex, ageYears, heightCm, weightKg],
  );

  const tdee = bmr * activity.factor;
  const targetCalories = Math.max(900, tdee * (1 + adjustmentPct / 100));
  const calorieDelta = targetCalories - tdee;

  const proteinG = gramsFromPct({
    totalCalories: targetCalories,
    pct: preset.proteinPct,
    kcalPerGram: 4,
  });
  const carbsG = gramsFromPct({
    totalCalories: targetCalories,
    pct: preset.carbsPct,
    kcalPerGram: 4,
  });
  const fatG = gramsFromPct({
    totalCalories: targetCalories,
    pct: preset.fatPct,
    kcalPerGram: 9,
  });

  const category = useMemo(
    () => findRangeBucket(adjustmentPct, MACRO_CALORIE_ADJUSTMENT_RANGES),
    [adjustmentPct],
  );

  const presetRows = useMemo(() => {
    return MACRO_PRESETS.map((row) => ({
      ...row,
      proteinG: gramsFromPct({ totalCalories: targetCalories, pct: row.proteinPct, kcalPerGram: 4 }),
      carbsG: gramsFromPct({ totalCalories: targetCalories, pct: row.carbsPct, kcalPerGram: 4 }),
      fatG: gramsFromPct({ totalCalories: targetCalories, pct: row.fatPct, kcalPerGram: 9 }),
    }));
  }, [targetCalories]);

  useEffect(() => {
    onChange?.({
      tdee,
      targetCalories,
      adjustmentPct,
      presetLabel: preset.label,
      proteinG,
      carbsG,
      fatG,
    });
  }, [onChange, tdee, targetCalories, adjustmentPct, preset.label, proteinG, carbsG, fatG]);

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
                onChange={(event) => setSex(event.target.value as Sex)}
                aria-label="Select sex"
              >
                <option value="male">Men</option>
                <option value="female">Women</option>
              </select>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="font-semibold text-gray-900">Activity</div>
              <select
                className="select select-bordered"
                value={activityKey}
                onChange={(event) => setActivityKey(event.target.value as ActivityLevelKey)}
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
                  min={80}
                  max={450}
                  step={1}
                  onChange={(lbs) => setWeightKg(lbToKg(lbs))}
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
                  min={36}
                  max={205}
                  step={0.1}
                  onChange={setWeightKg}
                />
              </>
            )}

            <SliderRow
              label="Calorie Adjustment"
              valueLabel={`${adjustmentPct > 0 ? "+" : ""}${Math.round(adjustmentPct)}% vs maintenance`}
              value={adjustmentPct}
              min={-30}
              max={25}
              step={1}
              onChange={setAdjustmentPct}
              helper="Negative values create a deficit. Positive values create a surplus."
            />

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="font-semibold text-gray-900">Macro Preset</div>
              <select
                className="select select-bordered"
                value={presetKey}
                onChange={(event) => setPresetKey(event.target.value as MacroPresetKey)}
                aria-label="Select macro split preset"
              >
                {MACRO_PRESETS.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge value={targetCalories} label="Target kcal" rimColor={category.color} min={900} max={4500} digits={0} />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Maintenance</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(tdee)} kcal</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Target Intake</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(targetCalories)} kcal</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Protein</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(proteinG)} g</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Carbs</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(carbsG)} g</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3 col-span-2">
                  <div className="text-xs text-gray-600">Fat / Daily Delta</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.round(fatG)} g / {calorieDelta > 0 ? "+" : ""}
                    {Math.round(calorieDelta)} kcal
                  </div>
                </div>
              </div>

              <div className="mt-6 w-full overflow-hidden rounded-xl border bg-white">
                <table className="w-full text-left text-xs sm:text-sm border-separate border-spacing-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 font-semibold text-gray-700">Preset</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 text-right">P/C/F %</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 text-right">P/C/F g</th>
                    </tr>
                  </thead>
                  <tbody>
                    {presetRows.map((row) => {
                      const isActive = row.key === preset.key;
                      return (
                        <tr key={row.key} className={row.rowClass}>
                          <td className={["px-3 py-2 text-gray-900", isActive ? "border-l-4 border-gray-900 font-semibold" : ""].join(" ")}>
                            {row.label}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums text-gray-700">
                            {row.proteinPct}/{row.carbsPct}/{row.fatPct}
                          </td>
                          <td
                            className={[
                              "px-3 py-2 text-right tabular-nums",
                              isActive ? "font-semibold border-r-4 border-gray-900 bg-white text-gray-900" : "text-gray-700",
                            ].join(" ")}
                          >
                            {Math.round(row.proteinG)}/{Math.round(row.carbsG)}/{Math.round(row.fatG)}
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
          ranges={MACRO_CALORIE_ADJUSTMENT_RANGES}
          min={-30}
          max={30}
          ticks={[-30, -20, -10, 0, 10, 20, 30]}
        />
      </div>
    </div>
  );
}

