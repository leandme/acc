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
  estimateDaysToTarget,
  getActivityLevel,
  mifflinStJeorBmr,
  simulateWeightProjection,
  type ActivityLevelKey,
} from "@/app/components/tools/body-weight/shared/weight-projection";
import { WEIGHT_LOSS_PACE_RANGES } from "@/app/components/tools/body-weight/shared/weight-loss-pace-ranges";

type Props = {
  onChange?: (payload: {
    daysToTarget: number | null;
    weeklyLossPct: number;
    projected12WeekLossKg: number;
    averageDailyDeficitKcal: number;
  }) => void;
};

function formatTargetTimeline(daysToTarget: number | null) {
  if (daysToTarget == null) return "Target not reachable at this intake";
  if (daysToTarget === 0) return "Already at or below target";

  const weeks = daysToTarget / 7;

  if (weeks < 1) {
    return `${daysToTarget} days`;
  }

  if (weeks < 8) {
    return `${round(weeks, 1)} weeks`;
  }

  const months = daysToTarget / 30.44;
  return `${round(months, 1)} months`;
}

export default function WeightLossCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");
  const [activityKey, setActivityKey] = useState<ActivityLevelKey>("moderate");

  const [ageYears, setAgeYears] = useState<number>(35);
  const [heightCm, setHeightCm] = useState<number>(177.8); // 5'10"
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(102.1); // 225 lb
  const [targetWeightKg, setTargetWeightKg] = useState<number>(86.2); // 190 lb
  const [dailyCalories, setDailyCalories] = useState<number>(2200);

  useEffect(() => {
    if (targetWeightKg > currentWeightKg) {
      setTargetWeightKg(currentWeightKg);
    }
  }, [targetWeightKg, currentWeightKg]);

  const activity = useMemo(() => getActivityLevel(activityKey), [activityKey]);

  const heightIn = useMemo(() => Math.round(heightCm / 2.54), [heightCm]);
  const currentWeightLb = useMemo(() => Math.round(kgToLb(currentWeightKg)), [currentWeightKg]);
  const targetWeightLb = useMemo(() => Math.round(kgToLb(targetWeightKg)), [targetWeightKg]);

  const maintenanceCalories = useMemo(() => {
    const bmr = mifflinStJeorBmr({
      sex,
      ageYears,
      heightCm,
      weightKg: currentWeightKg,
    });

    return bmr * activity.factor;
  }, [sex, ageYears, heightCm, currentWeightKg, activity.factor]);

  const daysToTarget = useMemo(() => {
    return estimateDaysToTarget({
      sex,
      ageYears,
      heightCm,
      startWeightKg: currentWeightKg,
      targetWeightKg,
      activityFactor: activity.factor,
      intakeKcalPerDay: dailyCalories,
    });
  }, [sex, ageYears, heightCm, currentWeightKg, targetWeightKg, activity.factor, dailyCalories]);

  const projection12Weeks = useMemo(() => {
    return simulateWeightProjection({
      sex,
      ageYears,
      heightCm,
      startWeightKg: currentWeightKg,
      activityFactor: activity.factor,
      days: 84,
      intakeForDay: () => dailyCalories,
    });
  }, [sex, ageYears, heightCm, currentWeightKg, activity.factor, dailyCalories]);

  const weeklyLossPct = useMemo(() => {
    if (currentWeightKg <= 0) return 0;
    return (projection12Weeks.totalLossKg / currentWeightKg / 12) * 100;
  }, [projection12Weeks.totalLossKg, currentWeightKg]);

  const category = useMemo(() => findRangeBucket(weeklyLossPct, WEIGHT_LOSS_PACE_RANGES), [weeklyLossPct]);

  const targetDate = useMemo(() => {
    if (daysToTarget == null || daysToTarget <= 0) return null;
    return new Date(Date.now() + daysToTarget * 24 * 60 * 60 * 1000);
  }, [daysToTarget]);

  useEffect(() => {
    onChange?.({
      daysToTarget,
      weeklyLossPct,
      projected12WeekLossKg: projection12Weeks.totalLossKg,
      averageDailyDeficitKcal: projection12Weeks.averageDailyDeficitKcal,
    });
  }, [
    onChange,
    daysToTarget,
    weeklyLossPct,
    projection12Weeks.totalLossKg,
    projection12Weeks.averageDailyDeficitKcal,
  ]);

  const timelineLabel = formatTargetTimeline(daysToTarget);

  const projected12WeekLossDisplay =
    units === "metric"
      ? `${round(projection12Weeks.totalLossKg, 1)} kg`
      : `${round(kgToLb(projection12Weeks.totalLossKg), 1)} lbs`;

  const targetWeightDisplay =
    units === "metric" ? `${round(targetWeightKg, 1)} kg` : `${round(kgToLb(targetWeightKg), 1)} lbs`;

  const targetMaxImperial = Math.max(70, currentWeightLb);
  const targetMaxMetric = Math.max(32, round(currentWeightKg, 1));

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="rounded-3xl bg-white/80 backdrop-blur border shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="p-8 bg-white min-w-0">
            <div className="flex items-center justify-between">
              <UnitToggle units={units} onChange={setUnits} />
            </div>

            <div className="mt-5 flex items-center justify-between">
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

            <div className="mt-5 flex items-center justify-between">
              <div className="font-semibold text-gray-900">Activity Level</div>
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
                  valueLabel={`${currentWeightLb} lbs`}
                  value={currentWeightLb}
                  min={90}
                  max={500}
                  step={1}
                  onChange={(lb) => setCurrentWeightKg(lbToKg(lb))}
                />

                <SliderRow
                  label="Target Weight"
                  valueLabel={`${targetWeightLb} lbs`}
                  value={targetWeightLb}
                  min={70}
                  max={targetMaxImperial}
                  step={1}
                  onChange={(lb) => setTargetWeightKg(lbToKg(lb))}
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
                  valueLabel={`${round(currentWeightKg, 1)} kg`}
                  value={round(currentWeightKg, 1)}
                  min={41}
                  max={227}
                  step={0.1}
                  onChange={setCurrentWeightKg}
                />

                <SliderRow
                  label="Target Weight"
                  valueLabel={`${round(targetWeightKg, 1)} kg`}
                  value={round(targetWeightKg, 1)}
                  min={32}
                  max={targetMaxMetric}
                  step={0.1}
                  onChange={setTargetWeightKg}
                />
              </>
            )}

            <SliderRow
              label="Average Daily Calories"
              valueLabel={`${Math.round(dailyCalories)} kcal`}
              value={dailyCalories}
              min={900}
              max={4500}
              step={25}
              onChange={setDailyCalories}
              helper={`Estimated maintenance near current weight: ${Math.round(maintenanceCalories)} kcal/day`}
            />
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge value={weeklyLossPct} label="%/week" rimColor={category.color} min={-1} max={2.5} digits={2} />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Time to Target</div>
                  <div className="text-lg font-semibold text-gray-900">{timelineLabel}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Target Weight</div>
                  <div className="text-lg font-semibold text-gray-900">{targetWeightDisplay}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Projected 12-Week Change</div>
                  <div className="text-lg font-semibold text-gray-900">{projected12WeekLossDisplay}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Avg Daily Deficit</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.round(projection12Weeks.averageDailyDeficitKcal)} kcal
                  </div>
                </div>
              </div>

              {targetDate ? (
                <p className="mt-4 text-xs text-gray-600">
                  Estimated target date: {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(targetDate)}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <InterpretationBar
          value={weeklyLossPct}
          ranges={WEIGHT_LOSS_PACE_RANGES}
          min={-1}
          max={2.5}
          ticks={[-1, 0, 0.5, 1, 1.5, 2, 2.5]}
        />
      </div>
    </div>
  );
}
