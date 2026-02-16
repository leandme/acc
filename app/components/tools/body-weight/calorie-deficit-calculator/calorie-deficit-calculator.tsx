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
import { WEIGHT_LOSS_PACE_RANGES } from "@/app/components/tools/body-weight/shared/weight-loss-pace-ranges";

type EquationKey = "mifflin" | "harris-benedict";

type Props = {
  onChange?: (payload: {
    maintenanceCalories: number;
    targetCalories: number;
    dailyDeficit: number;
    weeklyLossPct: number;
    weeklyLossKg: number;
  }) => void;
};

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

export default function CalorieDeficitCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");
  const [equation, setEquation] = useState<EquationKey>("mifflin");
  const [activityKey, setActivityKey] = useState<ActivityLevelKey>("moderate");

  const [ageYears, setAgeYears] = useState<number>(35);
  const [heightCm, setHeightCm] = useState<number>(177.8); // 5'10"
  const [weightKg, setWeightKg] = useState<number>(95.3); // 210 lb
  const [weeklyLossPct, setWeeklyLossPct] = useState<number>(0.7);

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
  const maintenanceCalories = bmr * activity.factor;
  const weeklyLossKg = (weeklyLossPct / 100) * weightKg;
  const weeklyDeficit = weeklyLossKg * 7700;
  const dailyDeficit = weeklyDeficit / 7;
  const targetCalories = maintenanceCalories - dailyDeficit;

  const paceRows = useMemo(() => {
    const presets = [0.25, 0.5, 0.75, 1, 1.25, 1.5];
    return presets.map((pct) => {
      const rowWeeklyLossKg = (pct / 100) * weightKg;
      const rowDailyDeficit = (rowWeeklyLossKg * 7700) / 7;
      return {
        pct,
        targetCalories: maintenanceCalories - rowDailyDeficit,
        range: findRangeBucket(pct, WEIGHT_LOSS_PACE_RANGES),
      };
    });
  }, [weightKg, maintenanceCalories]);

  const closestPreset = useMemo(() => {
    return paceRows.reduce((best, row) => {
      if (!best) return row;
      return Math.abs(row.pct - weeklyLossPct) < Math.abs(best.pct - weeklyLossPct) ? row : best;
    }, paceRows[0]);
  }, [paceRows, weeklyLossPct]);

  const category = useMemo(
    () => findRangeBucket(weeklyLossPct, WEIGHT_LOSS_PACE_RANGES),
    [weeklyLossPct],
  );

  useEffect(() => {
    onChange?.({
      maintenanceCalories,
      targetCalories,
      dailyDeficit,
      weeklyLossPct,
      weeklyLossKg,
    });
  }, [onChange, maintenanceCalories, targetCalories, dailyDeficit, weeklyLossPct, weeklyLossKg]);

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
                  label="Current Weight"
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
                  label="Current Weight"
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
              label="Target Weekly Loss Pace"
              valueLabel={`${round(weeklyLossPct, 2)}% body weight / week`}
              value={weeklyLossPct}
              min={0.1}
              max={1.5}
              step={0.05}
              onChange={setWeeklyLossPct}
            />
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge value={targetCalories} label="Target kcal" rimColor={category.color} min={900} max={4200} digits={0} />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Maintenance</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(maintenanceCalories)} kcal</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Target Intake</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(targetCalories)} kcal</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Daily Deficit</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(dailyDeficit)} kcal</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Weekly Loss</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {round(weeklyLossKg, 2)} kg ({round(kgToLb(weeklyLossKg), 1)} lbs)
                  </div>
                </div>
              </div>

              <div className="mt-6 w-full overflow-hidden rounded-xl border bg-white">
                <table className="w-full text-left text-xs sm:text-sm border-separate border-spacing-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 font-semibold text-gray-700">Pace (%/week)</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 text-right">Target kcal/day</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paceRows.map((row) => {
                      const isActive = row.pct === closestPreset.pct;
                      return (
                        <tr key={row.pct} className={row.range.rowClass}>
                          <td className={["px-3 py-2 text-gray-900", isActive ? "border-l-4 border-gray-900 font-semibold" : ""].join(" ")}>
                            {round(row.pct, 2)}%
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
          value={weeklyLossPct}
          ranges={WEIGHT_LOSS_PACE_RANGES}
          min={0}
          max={2}
          ticks={[0, 0.25, 0.5, 0.75, 1, 1.5, 2]}
        />
      </div>
    </div>
  );
}
