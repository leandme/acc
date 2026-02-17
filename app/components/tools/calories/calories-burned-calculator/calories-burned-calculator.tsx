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
  kgToLb,
  lbToKg,
  round,
  type Units,
} from "@/app/components/tools/body-weight/shared/math";
import {
  CALORIE_BURN_ACTIVITIES,
  getCalorieBurnActivity,
  type CalorieBurnActivityKey,
} from "@/app/components/tools/calories/calories-burned-calculator/calories-burned-activities";
import { CALORIES_BURNED_RANGES } from "@/app/components/tools/calories/calories-burned-calculator/calories-burned-ranges";

type Props = {
  onChange?: (payload: {
    activityLabel: string;
    met: number;
    durationMinutes: number;
    sessionsPerWeek: number;
    activeCalories: number;
    totalCalories: number;
    weeklyActiveCalories: number;
  }) => void;
};

type BurnOutput = {
  totalCalories: number;
  activeCalories: number;
};

const DURATION_PRESETS = [15, 30, 45, 60, 90, 120];

function computeBurn(params: {
  met: number;
  weightKg: number;
  durationMinutes: number;
}): BurnOutput {
  const durationHours = Math.max(0, params.durationMinutes) / 60;
  const totalCalories = params.met * params.weightKg * durationHours;
  const activeCalories = Math.max(0, (params.met - 1) * params.weightKg * durationHours);
  return {
    totalCalories,
    activeCalories,
  };
}

export default function CaloriesBurnedCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [activityKey, setActivityKey] = useState<CalorieBurnActivityKey>("walking");
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [sessionsPerWeek, setSessionsPerWeek] = useState<number>(4);
  const [weightKg, setWeightKg] = useState<number>(83.9); // 185 lbs

  const activity = useMemo(() => getCalorieBurnActivity(activityKey), [activityKey]);
  const weightLb = useMemo(() => Math.round(kgToLb(weightKg)), [weightKg]);

  const burn = useMemo(
    () =>
      computeBurn({
        met: activity.met,
        weightKg,
        durationMinutes,
      }),
    [activity.met, weightKg, durationMinutes],
  );

  const weeklyActiveCalories = burn.activeCalories * sessionsPerWeek;
  const category = useMemo(
    () => findRangeBucket(burn.activeCalories, CALORIES_BURNED_RANGES),
    [burn.activeCalories],
  );

  const durationRows = useMemo(() => {
    return DURATION_PRESETS.map((minutes) => {
      const rowBurn = computeBurn({
        met: activity.met,
        weightKg,
        durationMinutes: minutes,
      });
      const range = findRangeBucket(rowBurn.activeCalories, CALORIES_BURNED_RANGES);
      return {
        minutes,
        ...rowBurn,
        range,
      };
    });
  }, [activity.met, weightKg]);

  const closestDurationRow = useMemo(() => {
    return durationRows.reduce((best, row) => {
      if (!best) return row;
      return Math.abs(row.minutes - durationMinutes) < Math.abs(best.minutes - durationMinutes) ? row : best;
    }, durationRows[0]);
  }, [durationRows, durationMinutes]);

  useEffect(() => {
    onChange?.({
      activityLabel: activity.label,
      met: activity.met,
      durationMinutes,
      sessionsPerWeek,
      activeCalories: burn.activeCalories,
      totalCalories: burn.totalCalories,
      weeklyActiveCalories,
    });
  }, [
    onChange,
    activity.label,
    activity.met,
    durationMinutes,
    sessionsPerWeek,
    burn.activeCalories,
    burn.totalCalories,
    weeklyActiveCalories,
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
              <div className="font-semibold text-gray-900">Activity</div>
              <select
                className="select select-bordered max-w-[250px]"
                value={activityKey}
                onChange={(event) => setActivityKey(event.target.value as CalorieBurnActivityKey)}
                aria-label="Select activity"
              >
                {CALORIE_BURN_ACTIVITIES.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {units === "imperial" ? (
              <SliderRow
                label="Body Weight"
                valueLabel={`${weightLb} lbs`}
                value={weightLb}
                min={80}
                max={450}
                step={1}
                onChange={(lbs) => setWeightKg(lbToKg(lbs))}
              />
            ) : (
              <SliderRow
                label="Body Weight"
                valueLabel={`${round(weightKg, 1)} kg`}
                value={round(weightKg, 1)}
                min={36}
                max={205}
                step={0.1}
                onChange={setWeightKg}
              />
            )}

            <SliderRow
              label="Duration"
              valueLabel={`${durationMinutes} min`}
              value={durationMinutes}
              min={10}
              max={180}
              step={1}
              onChange={setDurationMinutes}
            />

            <SliderRow
              label="Sessions Per Week"
              valueLabel={`${sessionsPerWeek} sessions`}
              value={sessionsPerWeek}
              min={1}
              max={14}
              step={1}
              onChange={setSessionsPerWeek}
            />

            <div className="mt-6 rounded-xl bg-base-200/50 p-4 text-sm text-gray-700">
              <span className="font-semibold text-gray-900">{activity.label}</span>: {activity.note} MET used:{" "}
              <span className="font-semibold text-gray-900">{activity.met}</span>.
            </div>
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge
                value={burn.activeCalories}
                label="Active kcal"
                rimColor={category.color}
                min={0}
                max={1200}
                digits={0}
              />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">MET Value</div>
                  <div className="text-lg font-semibold text-gray-900">{activity.met}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Duration</div>
                  <div className="text-lg font-semibold text-gray-900">{durationMinutes} min</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Active Calories</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(burn.activeCalories)} kcal</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Total Calories</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(burn.totalCalories)} kcal</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3 col-span-2">
                  <div className="text-xs text-gray-600">Weekly Active Calories</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(weeklyActiveCalories)} kcal</div>
                </div>
              </div>

              <div className="mt-6 w-full overflow-hidden rounded-xl border bg-white">
                <table className="w-full text-left text-xs sm:text-sm border-separate border-spacing-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 font-semibold text-gray-700">Duration</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 text-right">Active kcal</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 text-right">Total kcal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {durationRows.map((row) => {
                      const isActive = row.minutes === closestDurationRow.minutes;
                      return (
                        <tr key={row.minutes} className={row.range.rowClass}>
                          <td
                            className={[
                              "px-3 py-2 text-gray-900 tabular-nums",
                              isActive ? "border-l-4 border-gray-900 font-semibold" : "",
                            ].join(" ")}
                          >
                            {row.minutes} min
                          </td>
                          <td
                            className={[
                              "px-3 py-2 text-right tabular-nums",
                              isActive ? "font-semibold text-gray-900" : "text-gray-700",
                            ].join(" ")}
                          >
                            {Math.round(row.activeCalories)}
                          </td>
                          <td
                            className={[
                              "px-3 py-2 text-right tabular-nums",
                              isActive ? "font-semibold border-r-4 border-gray-900 bg-white text-gray-900" : "text-gray-700",
                            ].join(" ")}
                          >
                            {Math.round(row.totalCalories)}
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
          value={burn.activeCalories}
          ranges={CALORIES_BURNED_RANGES}
          min={0}
          max={1200}
          ticks={[0, 150, 300, 500, 800, 1100]}
        />
      </div>
    </div>
  );
}
