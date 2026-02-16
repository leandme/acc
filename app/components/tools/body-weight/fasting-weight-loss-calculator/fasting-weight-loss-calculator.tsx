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
  simulateWeightProjection,
  type ActivityLevelKey,
} from "@/app/components/tools/body-weight/shared/weight-projection";
import { FASTING_WEEKLY_LOSS_RANGES } from "./fasting-weight-loss-ranges";

type Props = {
  onChange?: (payload: {
    endWeightKg: number;
    totalLossKg: number;
    weeklyLossPct: number;
    averageDailyDeficitKcal: number;
    averageDailyIntakeKcal: number;
  }) => void;
};

export default function FastingWeightLossCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");
  const [activityKey, setActivityKey] = useState<ActivityLevelKey>("light");

  const [ageYears, setAgeYears] = useState<number>(35);
  const [heightCm, setHeightCm] = useState<number>(177.8); // 5'10"
  const [startWeightKg, setStartWeightKg] = useState<number>(102.1); // 225 lb

  const [fastingDaysPerWeek, setFastingDaysPerWeek] = useState<number>(3);
  const [fastingDayCalories, setFastingDayCalories] = useState<number>(700);
  const [feedingDayCalories, setFeedingDayCalories] = useState<number>(2400);
  const [durationWeeks, setDurationWeeks] = useState<number>(12);

  const activity = useMemo(() => getActivityLevel(activityKey), [activityKey]);

  const heightIn = useMemo(() => Math.round(heightCm / 2.54), [heightCm]);
  const weightLb = useMemo(() => Math.round(kgToLb(startWeightKg)), [startWeightKg]);

  const averageDailyIntakeKcal = useMemo(() => {
    return (
      (fastingDaysPerWeek * fastingDayCalories +
        (7 - fastingDaysPerWeek) * feedingDayCalories) /
      7
    );
  }, [fastingDaysPerWeek, fastingDayCalories, feedingDayCalories]);

  const projection = useMemo(() => {
    return simulateWeightProjection({
      sex,
      ageYears,
      heightCm,
      startWeightKg,
      activityFactor: activity.factor,
      days: durationWeeks * 7,
      intakeForDay: (dayIndex) => {
        const dayOfWeek = dayIndex % 7;
        return dayOfWeek < fastingDaysPerWeek ? fastingDayCalories : feedingDayCalories;
      },
    });
  }, [
    sex,
    ageYears,
    heightCm,
    startWeightKg,
    activity.factor,
    durationWeeks,
    fastingDaysPerWeek,
    fastingDayCalories,
    feedingDayCalories,
  ]);

  const weeklyLossKg = useMemo(() => {
    if (durationWeeks <= 0) return 0;
    return projection.totalLossKg / durationWeeks;
  }, [projection.totalLossKg, durationWeeks]);

  const weeklyLossPct = useMemo(() => {
    if (startWeightKg <= 0) return 0;
    return (weeklyLossKg / startWeightKg) * 100;
  }, [weeklyLossKg, startWeightKg]);

  const category = useMemo(
    () => findRangeBucket(weeklyLossPct, FASTING_WEEKLY_LOSS_RANGES),
    [weeklyLossPct],
  );

  useEffect(() => {
    onChange?.({
      endWeightKg: projection.endWeightKg,
      totalLossKg: projection.totalLossKg,
      weeklyLossPct,
      averageDailyDeficitKcal: projection.averageDailyDeficitKcal,
      averageDailyIntakeKcal,
    });
  }, [
    onChange,
    projection.endWeightKg,
    projection.totalLossKg,
    weeklyLossPct,
    projection.averageDailyDeficitKcal,
    averageDailyIntakeKcal,
  ]);

  const startWeightDisplay =
    units === "metric" ? `${round(startWeightKg, 1)} kg` : `${Math.round(kgToLb(startWeightKg))} lbs`;
  const endWeightDisplay =
    units === "metric"
      ? `${round(projection.endWeightKg, 1)} kg`
      : `${round(kgToLb(projection.endWeightKg), 1)} lbs`;
  const totalLossDisplay =
    units === "metric"
      ? `${round(projection.totalLossKg, 1)} kg`
      : `${round(kgToLb(projection.totalLossKg), 1)} lbs`;

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
                  label="Starting Weight"
                  valueLabel={`${weightLb} lbs`}
                  value={weightLb}
                  min={90}
                  max={500}
                  step={1}
                  onChange={(lb) => setStartWeightKg(lbToKg(lb))}
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
                  label="Starting Weight"
                  valueLabel={`${round(startWeightKg, 1)} kg`}
                  value={round(startWeightKg, 1)}
                  min={41}
                  max={227}
                  step={0.1}
                  onChange={setStartWeightKg}
                />
              </>
            )}

            <SliderRow
              label="Fasting Days Per Week"
              valueLabel={`${Math.round(fastingDaysPerWeek)} days`}
              value={fastingDaysPerWeek}
              min={0}
              max={7}
              step={1}
              onChange={setFastingDaysPerWeek}
            />

            <SliderRow
              label="Calories on Fasting Days"
              valueLabel={`${Math.round(fastingDayCalories)} kcal`}
              value={fastingDayCalories}
              min={0}
              max={2500}
              step={25}
              onChange={setFastingDayCalories}
            />

            <SliderRow
              label="Calories on Non-Fasting Days"
              valueLabel={`${Math.round(feedingDayCalories)} kcal`}
              value={feedingDayCalories}
              min={900}
              max={4500}
              step={25}
              onChange={setFeedingDayCalories}
            />

            <SliderRow
              label="Duration"
              valueLabel={`${Math.round(durationWeeks)} weeks`}
              value={durationWeeks}
              min={1}
              max={52}
              step={1}
              onChange={setDurationWeeks}
              helper={`Average projected daily intake: ${Math.round(averageDailyIntakeKcal)} kcal`}
            />
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge
                value={weeklyLossPct}
                label="%/week"
                rimColor={category.color}
                min={-1}
                max={2.5}
                digits={2}
              />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Start Weight</div>
                  <div className="text-lg font-semibold text-gray-900">{startWeightDisplay}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Projected End Weight</div>
                  <div className="text-lg font-semibold text-gray-900">{endWeightDisplay}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Projected Total Change</div>
                  <div className="text-lg font-semibold text-gray-900">{totalLossDisplay}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Average Daily Deficit</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.round(projection.averageDailyDeficitKcal)} kcal
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-600 max-w-[320px]">
                Activity selection: {activity.label}. {activity.note}
              </p>
            </div>
          </div>
        </div>

        <InterpretationBar
          value={weeklyLossPct}
          ranges={FASTING_WEEKLY_LOSS_RANGES}
          min={-1}
          max={2.5}
          ticks={[-1, 0, 0.5, 1, 1.5, 2, 2.5]}
        />
      </div>
    </div>
  );
}
