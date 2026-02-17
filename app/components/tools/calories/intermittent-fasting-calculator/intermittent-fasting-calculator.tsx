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
  simulateWeightProjection,
  type ActivityLevelKey,
} from "@/app/components/tools/body-weight/shared/weight-projection";
import { WEIGHT_LOSS_PACE_RANGES } from "@/app/components/tools/body-weight/shared/weight-loss-pace-ranges";

type ProtocolKey = "14-10" | "16-8" | "18-6" | "20-4" | "omad" | "five-two";

type Protocol = {
  key: ProtocolKey;
  label: string;
  intakeReductionPct: number;
  note: string;
};

const FASTING_PROTOCOLS: Protocol[] = [
  {
    key: "14-10",
    label: "14:10",
    intakeReductionPct: 5,
    note: "Entry-level time-restricted eating window.",
  },
  {
    key: "16-8",
    label: "16:8",
    intakeReductionPct: 10,
    note: "Common daily fasting window for consistency.",
  },
  {
    key: "18-6",
    label: "18:6",
    intakeReductionPct: 13,
    note: "More compressed eating window than 16:8.",
  },
  {
    key: "20-4",
    label: "20:4",
    intakeReductionPct: 17,
    note: "Tighter feeding window that can reduce average intake.",
  },
  {
    key: "omad",
    label: "OMAD",
    intakeReductionPct: 20,
    note: "One meal per day setup with a narrow feeding window.",
  },
  {
    key: "five-two",
    label: "5:2",
    intakeReductionPct: 0,
    note: "Two low-calorie fasting days each week.",
  },
];

type Props = {
  onChange?: (payload: {
    bmr: number;
    tdee: number;
    averageDailyIntakeKcal: number;
    averageDailyDeficitKcal: number;
    weeklyLossPct: number;
    totalLossKg: number;
    endWeightKg: number;
    protocolLabel: string;
  }) => void;
};

export default function IntermittentFastingCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");
  const [activityKey, setActivityKey] = useState<ActivityLevelKey>("light");
  const [protocolKey, setProtocolKey] = useState<ProtocolKey>("16-8");

  const [ageYears, setAgeYears] = useState<number>(35);
  const [heightCm, setHeightCm] = useState<number>(177.8); // 5'10"
  const [startWeightKg, setStartWeightKg] = useState<number>(95.3); // 210 lb
  const [baselineCalories, setBaselineCalories] = useState<number>(2600);
  const [fastingDayCalories, setFastingDayCalories] = useState<number>(700);
  const [fastingDaysPerWeek, setFastingDaysPerWeek] = useState<number>(2);
  const [durationWeeks, setDurationWeeks] = useState<number>(12);

  const activity = useMemo(() => getActivityLevel(activityKey), [activityKey]);
  const protocol = useMemo(
    () => FASTING_PROTOCOLS.find((item) => item.key === protocolKey) ?? FASTING_PROTOCOLS[1],
    [protocolKey],
  );

  const heightIn = useMemo(() => Math.round(heightCm / 2.54), [heightCm]);
  const weightLb = useMemo(() => Math.round(kgToLb(startWeightKg)), [startWeightKg]);

  const bmr = useMemo(
    () =>
      mifflinStJeorBmr({
        sex,
        ageYears,
        heightCm,
        weightKg: startWeightKg,
      }),
    [sex, ageYears, heightCm, startWeightKg],
  );

  const tdee = bmr * activity.factor;

  const protocolDailyIntake = useMemo(() => {
    if (protocol.key === "five-two") {
      return (
        (fastingDaysPerWeek * fastingDayCalories +
          (7 - fastingDaysPerWeek) * baselineCalories) /
        7
      );
    }

    return baselineCalories * (1 - protocol.intakeReductionPct / 100);
  }, [protocol, fastingDaysPerWeek, fastingDayCalories, baselineCalories]);

  const projection = useMemo(() => {
    return simulateWeightProjection({
      sex,
      ageYears,
      heightCm,
      startWeightKg,
      activityFactor: activity.factor,
      days: durationWeeks * 7,
      intakeForDay: (dayIndex) => {
        if (protocol.key === "five-two") {
          const dayOfWeek = dayIndex % 7;
          return dayOfWeek < fastingDaysPerWeek ? fastingDayCalories : baselineCalories;
        }

        return protocolDailyIntake;
      },
    });
  }, [
    sex,
    ageYears,
    heightCm,
    startWeightKg,
    activity.factor,
    durationWeeks,
    protocol,
    fastingDaysPerWeek,
    fastingDayCalories,
    baselineCalories,
    protocolDailyIntake,
  ]);

  const weeklyLossPct = useMemo(() => {
    if (durationWeeks <= 0 || startWeightKg <= 0) return 0;
    const weeklyLossKg = projection.totalLossKg / durationWeeks;
    return (weeklyLossKg / startWeightKg) * 100;
  }, [durationWeeks, projection.totalLossKg, startWeightKg]);

  const normalizedWeeklyLossPct = useMemo(
    () => Math.max(-0.99, weeklyLossPct),
    [weeklyLossPct],
  );

  const averageDailyDeficitKcal = useMemo(() => tdee - protocolDailyIntake, [tdee, protocolDailyIntake]);

  const category = useMemo(
    () => findRangeBucket(normalizedWeeklyLossPct, WEIGHT_LOSS_PACE_RANGES),
    [normalizedWeeklyLossPct],
  );

  const protocolRows = useMemo(() => {
    return FASTING_PROTOCOLS.map((item) => {
      const intake =
        item.key === "five-two"
          ? (fastingDaysPerWeek * fastingDayCalories + (7 - fastingDaysPerWeek) * baselineCalories) / 7
          : baselineCalories * (1 - item.intakeReductionPct / 100);
      const dailyDeficit = tdee - intake;
      const weeklyLossKg = (dailyDeficit * 7) / 7700;
      const pacePct = startWeightKg > 0 ? (weeklyLossKg / startWeightKg) * 100 : 0;
      const boundedPace = Math.max(-0.99, pacePct);
      const range = findRangeBucket(boundedPace, WEIGHT_LOSS_PACE_RANGES);

      return {
        ...item,
        intake,
        pacePct,
        range,
      };
    });
  }, [fastingDaysPerWeek, fastingDayCalories, baselineCalories, tdee, startWeightKg]);

  useEffect(() => {
    onChange?.({
      bmr,
      tdee,
      averageDailyIntakeKcal: protocolDailyIntake,
      averageDailyDeficitKcal,
      weeklyLossPct,
      totalLossKg: projection.totalLossKg,
      endWeightKg: projection.endWeightKg,
      protocolLabel: protocol.label,
    });
  }, [
    onChange,
    bmr,
    tdee,
    protocolDailyIntake,
    averageDailyDeficitKcal,
    weeklyLossPct,
    projection.totalLossKg,
    projection.endWeightKg,
    protocol.label,
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

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="font-semibold text-gray-900">Protocol</div>
              <select
                className="select select-bordered"
                value={protocolKey}
                onChange={(e) => setProtocolKey(e.target.value as ProtocolKey)}
                aria-label="Select intermittent fasting protocol"
              >
                {FASTING_PROTOCOLS.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
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
                  label="Current Weight"
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
              label="Usual Daily Calories (No Fasting)"
              valueLabel={`${Math.round(baselineCalories)} kcal`}
              value={baselineCalories}
              min={900}
              max={4500}
              step={25}
              onChange={setBaselineCalories}
            />

            {protocol.key === "five-two" ? (
              <>
                <SliderRow
                  label="Fasting Days Per Week"
                  valueLabel={`${Math.round(fastingDaysPerWeek)} days`}
                  value={fastingDaysPerWeek}
                  min={1}
                  max={3}
                  step={1}
                  onChange={setFastingDaysPerWeek}
                />
                <SliderRow
                  label="Calories on Fasting Days"
                  valueLabel={`${Math.round(fastingDayCalories)} kcal`}
                  value={fastingDayCalories}
                  min={0}
                  max={1400}
                  step={25}
                  onChange={setFastingDayCalories}
                />
              </>
            ) : null}

            <SliderRow
              label="Projection Length"
              valueLabel={`${Math.round(durationWeeks)} weeks`}
              value={durationWeeks}
              min={2}
              max={52}
              step={1}
              onChange={setDurationWeeks}
              helper={protocol.note}
            />
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge
                value={normalizedWeeklyLossPct}
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
                  <div className="text-xs text-gray-600">BMR</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(bmr)} kcal</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Estimated TDEE</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(tdee)} kcal</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Avg Daily Intake</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(protocolDailyIntake)} kcal</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Avg Daily Deficit</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(averageDailyDeficitKcal)} kcal</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Start Weight</div>
                  <div className="text-lg font-semibold text-gray-900">{startWeightDisplay}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Projected End Weight</div>
                  <div className="text-lg font-semibold text-gray-900">{endWeightDisplay}</div>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-base-200/60 p-3 w-full text-left">
                <div className="text-xs text-gray-600">Projected Total Change ({Math.round(durationWeeks)} weeks)</div>
                <div className="text-lg font-semibold text-gray-900">{totalLossDisplay}</div>
              </div>

              <div className="mt-6 w-full overflow-hidden rounded-xl border bg-white">
                <table className="w-full text-left text-xs sm:text-sm border-separate border-spacing-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 font-semibold text-gray-700">Protocol</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 text-right">Avg kcal/day</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 text-right">%/week</th>
                    </tr>
                  </thead>
                  <tbody>
                    {protocolRows.map((row) => {
                      const isActive = row.key === protocolKey;
                      return (
                        <tr key={row.key} className={row.range.rowClass}>
                          <td
                            className={[
                              "px-3 py-2 text-gray-900",
                              isActive ? "border-l-4 border-gray-900 font-semibold" : "",
                            ].join(" ")}
                          >
                            {row.label}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums text-gray-700">
                            {Math.round(row.intake)}
                          </td>
                          <td
                            className={[
                              "px-3 py-2 text-right tabular-nums",
                              isActive ? "font-semibold border-r-4 border-gray-900 bg-white" : "text-gray-700",
                            ].join(" ")}
                          >
                            {round(row.pacePct, 2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-xs text-gray-600 max-w-[320px]">
                Activity assumption: {activity.label}. {activity.note}
              </p>
            </div>
          </div>
        </div>

        <InterpretationBar
          value={normalizedWeeklyLossPct}
          ranges={WEIGHT_LOSS_PACE_RANGES}
          min={-1}
          max={2}
          ticks={[-1, 0, 0.25, 0.75, 1, 1.5, 2]}
        />
      </div>
    </div>
  );
}
