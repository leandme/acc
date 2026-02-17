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
  cmToIn,
  formatFeetInches,
  inToCm,
  kgToLb,
  lbToKg,
  round,
  type Sex,
  type Units,
} from "@/app/components/tools/body-weight/shared/math";
import { STEPS_ACTIVITY_RANGES } from "@/app/components/tools/calories/steps-to-calories-calculator/steps-to-calories-ranges";

type Props = {
  onChange?: (payload: {
    stepsPerDay: number;
    distanceKm: number;
    durationMinutes: number;
    activeCalories: number;
    totalCalories: number;
  }) => void;
};

type WalkingMetBand = {
  key: string;
  label: string;
  minKmh: number;
  maxKmh: number;
  met: number;
};

const WALKING_MET_BANDS: WalkingMetBand[] = [
  { key: "easy", label: "Easy Walk", minKmh: 0, maxKmh: 3.2, met: 2.8 },
  { key: "normal", label: "Normal Walk", minKmh: 3.2, maxKmh: 4, met: 3.0 },
  { key: "steady", label: "Steady Walk", minKmh: 4, maxKmh: 4.8, met: 3.5 },
  { key: "brisk", label: "Brisk Walk", minKmh: 4.8, maxKmh: 5.6, met: 4.3 },
  { key: "very-brisk", label: "Very Brisk Walk", minKmh: 5.6, maxKmh: 6.4, met: 5.0 },
  { key: "power", label: "Power Walk", minKmh: 6.4, maxKmh: Infinity, met: 6.3 },
];

const STEP_TABLE_PRESETS = [3000, 5000, 7500, 10000, 12500, 15000, 20000];
const US_INT = new Intl.NumberFormat("en-US");
const ASSUMED_CADENCE_SPM = 100;

function estimateStrideFromHeightCm(params: {
  sex: Sex;
  heightCm: number;
}) {
  const ratio = params.sex === "male" ? 0.415 : 0.413;
  return params.heightCm * ratio;
}

function metBandForSpeedKmh(speedKmh: number) {
  return (
    WALKING_MET_BANDS.find((band) => speedKmh >= band.minKmh && speedKmh < band.maxKmh) ??
    WALKING_MET_BANDS[WALKING_MET_BANDS.length - 1]
  );
}

function computeWalkOutputs(params: {
  stepsPerDay: number;
  strideCm: number;
  weightKg: number;
}) {
  const distanceKm = (params.stepsPerDay * params.strideCm) / 100000;
  const durationMinutes = params.stepsPerDay / ASSUMED_CADENCE_SPM;
  const durationHours = durationMinutes / 60;
  const speedKmh = durationHours > 0 ? distanceKm / durationHours : 0;
  const metBand = metBandForSpeedKmh(speedKmh);
  const totalCalories = metBand.met * params.weightKg * durationHours;
  const activeCalories = Math.max(0, (metBand.met - 1) * params.weightKg * durationHours);

  return {
    distanceKm,
    durationMinutes,
    speedKmh,
    metBand,
    totalCalories,
    activeCalories,
  };
}

export default function StepsToCaloriesCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");
  const [heightCm, setHeightCm] = useState<number>(177.8); // 5'10"
  const [weightKg, setWeightKg] = useState<number>(83.9); // 185 lbs
  const [stepsPerDay, setStepsPerDay] = useState<number>(10000);

  const estimatedStrideCm = useMemo(
    () => estimateStrideFromHeightCm({ sex, heightCm }),
    [sex, heightCm],
  );

  const heightIn = useMemo(() => Math.round(heightCm / 2.54), [heightCm]);
  const weightLb = useMemo(() => Math.round(kgToLb(weightKg)), [weightKg]);

  const outputs = useMemo(
    () =>
      computeWalkOutputs({
        stepsPerDay,
        strideCm: estimatedStrideCm,
        weightKg,
      }),
    [stepsPerDay, estimatedStrideCm, weightKg],
  );

  const category = useMemo(
    () => findRangeBucket(stepsPerDay, STEPS_ACTIVITY_RANGES),
    [stepsPerDay],
  );

  const comparisonRows = useMemo(() => {
    return STEP_TABLE_PRESETS.map((presetSteps) => {
      const rowOutputs = computeWalkOutputs({
        stepsPerDay: presetSteps,
        strideCm: estimatedStrideCm,
        weightKg,
      });

      return {
        stepsPerDay: presetSteps,
        distanceKm: rowOutputs.distanceKm,
        activeCalories: rowOutputs.activeCalories,
        range: findRangeBucket(presetSteps, STEPS_ACTIVITY_RANGES),
      };
    });
  }, [estimatedStrideCm, weightKg]);

  const closestPreset = useMemo(() => {
    return comparisonRows.reduce((best, row) => {
      if (!best) return row;
      return Math.abs(row.stepsPerDay - stepsPerDay) < Math.abs(best.stepsPerDay - stepsPerDay) ? row : best;
    }, comparisonRows[0]);
  }, [comparisonRows, stepsPerDay]);

  useEffect(() => {
    onChange?.({
      stepsPerDay,
      distanceKm: outputs.distanceKm,
      durationMinutes: outputs.durationMinutes,
      activeCalories: outputs.activeCalories,
      totalCalories: outputs.totalCalories,
    });
  }, [onChange, stepsPerDay, outputs]);

  const distancePrimary =
    units === "metric"
      ? `${round(outputs.distanceKm, 2)} km`
      : `${round(outputs.distanceKm * 0.621371, 2)} mi`;

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

            <SliderRow
              label="Steps"
              valueLabel={`${US_INT.format(stepsPerDay)} steps/day`}
              value={stepsPerDay}
              min={1000}
              max={30000}
              step={100}
              onChange={setStepsPerDay}
              helper="Duration and calories use a standard walking pace assumption."
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

            <div className="mt-5 rounded-xl bg-base-200/50 p-4 text-sm text-gray-700">
              Stride length is estimated automatically from your height input:{" "}
              <span className="font-semibold text-gray-900">
                {round(estimatedStrideCm, 1)} cm ({round(cmToIn(estimatedStrideCm), 1)} in)
              </span>
              .
            </div>
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge
                value={outputs.activeCalories}
                label="Active kcal"
                rimColor={category.color}
                min={0}
                max={1400}
                digits={0}
              />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Distance</div>
                  <div className="text-lg font-semibold text-gray-900">{distancePrimary}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Duration</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(outputs.durationMinutes)} min</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Active Calories</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(outputs.activeCalories)} kcal</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Total Calories</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(outputs.totalCalories)} kcal</div>
                </div>
              </div>

              <div className="mt-6 w-full overflow-hidden rounded-xl border bg-white">
                <table className="w-full text-left text-xs sm:text-sm border-separate border-spacing-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 font-semibold text-gray-700">Steps</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 text-right">Distance</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 text-right">Active kcal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row) => {
                      const isActive = row.stepsPerDay === closestPreset.stepsPerDay;
                      const distanceValue =
                        units === "metric"
                          ? `${round(row.distanceKm, 2)} km`
                          : `${round(row.distanceKm * 0.621371, 2)} mi`;

                      return (
                        <tr key={row.stepsPerDay} className={row.range.rowClass}>
                          <td className={["px-3 py-2 text-gray-900 tabular-nums", isActive ? "border-l-4 border-gray-900 font-semibold" : ""].join(" ")}>
                            {US_INT.format(row.stepsPerDay)}
                          </td>
                          <td className={["px-3 py-2 text-right tabular-nums", isActive ? "font-semibold text-gray-900" : "text-gray-700"].join(" ")}>
                            {distanceValue}
                          </td>
                          <td
                            className={[
                              "px-3 py-2 text-right tabular-nums",
                              isActive ? "font-semibold border-r-4 border-gray-900 bg-white text-gray-900" : "text-gray-700",
                            ].join(" ")}
                          >
                            {Math.round(row.activeCalories)}
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
          value={stepsPerDay}
          ranges={STEPS_ACTIVITY_RANGES}
          min={0}
          max={20000}
          ticks={[0, 2500, 5000, 7500, 10000, 12500, 15000, 20000]}
        />
      </div>
    </div>
  );
}
