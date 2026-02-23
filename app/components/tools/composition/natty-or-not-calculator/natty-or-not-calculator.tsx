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
  clamp,
  cmToIn,
  cmToM,
  formatFeetInches,
  inToCm,
  kgToLb,
  lbToKg,
  round,
  type Sex,
  type Units,
} from "@/app/components/tools/body-weight/shared/math";
import { findFrameRange } from "@/app/components/tools/composition/body-frame-size-calculator/frame-ranges";
import { getNattyScoreRanges, getNattyScoreScale } from "./natty-or-not-ranges";

type Props = {
  onChange?: (payload: {
    sex: Sex;
    frameLabel: string;
    normalizedFFMI: number;
    frameAdjustedLimit: number;
    nattyScore: number;
    weightDeltaKg: number;
  }) => void;
};

const BASE_NATURAL_NFFMI: Record<Sex, number> = {
  male: 25,
  female: 21,
};

const FRAME_ADJUSTMENT_NFFMI: Record<Sex, Record<"small" | "medium" | "large", number>> = {
  male: {
    small: -0.6,
    medium: 0,
    large: 0.6,
  },
  female: {
    small: -0.4,
    medium: 0,
    large: 0.4,
  },
};

const FRAME_LIMIT_ROWS: Array<{
  key: "small" | "medium" | "large";
  label: string;
  rowClass: string;
  dotColor: string;
}> = [
  {
    key: "small",
    label: "Small Frame",
    rowClass: "bg-blue-50",
    dotColor: "#3b82f6",
  },
  {
    key: "medium",
    label: "Medium Frame",
    rowClass: "bg-green-50",
    dotColor: "#22c55e",
  },
  {
    key: "large",
    label: "Large Frame",
    rowClass: "bg-orange-50",
    dotColor: "#f97316",
  },
];

function getFrameAdjustment(sex: Sex, frameKey: string) {
  if (frameKey === "small") return FRAME_ADJUSTMENT_NFFMI[sex].small;
  if (frameKey === "large") return FRAME_ADJUSTMENT_NFFMI[sex].large;
  return FRAME_ADJUSTMENT_NFFMI[sex].medium;
}

function formatSigned(value: number, digits = 1) {
  const abs = round(Math.abs(value), digits);
  if (value > 0) return `+${abs}`;
  if (value < 0) return `-${abs}`;
  return `${abs}`;
}

function formatMass(kg: number, units: Units, digits = 1) {
  if (units === "metric") return `${round(kg, digits)} kg`;
  return `${round(kgToLb(kg), digits)} lbs`;
}

export default function NattyOrNotCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");

  const [heightCm, setHeightCm] = useState<number>(178);
  const [weightKg, setWeightKg] = useState<number>(82);
  const [bodyFatPct, setBodyFatPct] = useState<number>(14);
  const [wristCm, setWristCm] = useState<number>(17.5);

  const heightIn = useMemo(() => Math.round(cmToIn(heightCm)), [heightCm]);
  const weightLb = useMemo(() => Math.round(kgToLb(weightKg)), [weightKg]);
  const wristIn = useMemo(() => round(cmToIn(wristCm), 1), [wristCm]);

  const ranges = useMemo(() => getNattyScoreRanges(), []);
  const scoreScale = useMemo(() => getNattyScoreScale(), []);

  const calculated = useMemo(() => {
    const safeBodyFat = clamp(bodyFatPct, 3, 45);
    const bodyFatFraction = safeBodyFat / 100;
    const heightM = cmToM(heightCm);
    const leanMassKg = weightKg * (1 - bodyFatFraction);
    const ffmi = leanMassKg / (heightM * heightM);
    const normalizedFFMI = ffmi + 6.3 * (1.8 - heightM);

    const frameRatio = heightCm / wristCm;
    const frameCategory = findFrameRange(sex, frameRatio);
    const frameAdjustment = getFrameAdjustment(sex, frameCategory.key);

    const frameAdjustedLimit = BASE_NATURAL_NFFMI[sex] + frameAdjustment;
    const score = (normalizedFFMI / frameAdjustedLimit) * 100;

    const ffmiLimitAtHeight = frameAdjustedLimit - 6.3 * (1.8 - heightM);
    const leanMassLimitKg = ffmiLimitAtHeight * (heightM * heightM);
    const maxWeightAtCurrentBodyFatKg = leanMassLimitKg / (1 - bodyFatFraction);

    return {
      bodyFatFraction,
      leanMassKg,
      ffmi,
      normalizedFFMI,
      frameRatio,
      frameCategory,
      frameAdjustedLimit,
      score,
      ffmiLimitAtHeight,
      leanMassLimitKg,
      maxWeightAtCurrentBodyFatKg,
      weightDeltaKg: weightKg - maxWeightAtCurrentBodyFatKg,
      leanMassDeltaKg: leanMassKg - leanMassLimitKg,
    };
  }, [bodyFatPct, heightCm, sex, weightKg, wristCm]);

  const activeRange = useMemo(
    () => findRangeBucket(calculated.score, ranges),
    [calculated.score, ranges],
  );

  const frameLimitRows = useMemo(() => {
    return FRAME_LIMIT_ROWS.map((row) => ({
      ...row,
      limit: BASE_NATURAL_NFFMI[sex] + FRAME_ADJUSTMENT_NFFMI[sex][row.key],
      isActive: row.key === calculated.frameCategory.key,
    }));
  }, [calculated.frameCategory.key, sex]);

  useEffect(() => {
    onChange?.({
      sex,
      frameLabel: calculated.frameCategory.label,
      normalizedFFMI: calculated.normalizedFFMI,
      frameAdjustedLimit: calculated.frameAdjustedLimit,
      nattyScore: calculated.score,
      weightDeltaKg: calculated.weightDeltaKg,
    });
  }, [
    calculated.frameAdjustedLimit,
    calculated.frameCategory.label,
    calculated.normalizedFFMI,
    calculated.score,
    calculated.weightDeltaKg,
    onChange,
    sex,
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
                  label="Body Weight"
                  valueLabel={`${weightLb} lbs`}
                  value={weightLb}
                  min={90}
                  max={360}
                  step={1}
                  onChange={(lb) => setWeightKg(lbToKg(lb))}
                />

                <SliderRow
                  label="Body Fat Percentage"
                  valueLabel={`${round(bodyFatPct, 1)}%`}
                  value={bodyFatPct}
                  min={3}
                  max={45}
                  step={0.1}
                  onChange={setBodyFatPct}
                  helper={
                    <>
                      Need a body-fat estimate first?{" "}
                      <a href="/estimate" className="text-primary underline font-semibold">
                        Estimate Body Fat %
                      </a>
                    </>
                  }
                />

                <SliderRow
                  label="Wrist Circumference"
                  valueLabel={`${wristIn} in`}
                  value={wristIn}
                  min={4.8}
                  max={10.6}
                  step={0.1}
                  onChange={(inches) => setWristCm(inToCm(inches))}
                  helper={
                    <>
                      Measure at the narrowest wrist point. For context, compare with{" "}
                      <a href="/body-frame-size-calculator" className="text-primary underline font-semibold">
                        Body Frame Size Calculator
                      </a>
                      .
                    </>
                  }
                />
              </>
            ) : (
              <>
                <SliderRow
                  label="Height"
                  valueLabel={`${Math.round(heightCm)} cm`}
                  value={heightCm}
                  min={140}
                  max={214}
                  step={1}
                  onChange={setHeightCm}
                />

                <SliderRow
                  label="Body Weight"
                  valueLabel={`${Math.round(weightKg)} kg`}
                  value={weightKg}
                  min={40}
                  max={165}
                  step={1}
                  onChange={setWeightKg}
                />

                <SliderRow
                  label="Body Fat Percentage"
                  valueLabel={`${round(bodyFatPct, 1)}%`}
                  value={bodyFatPct}
                  min={3}
                  max={45}
                  step={0.1}
                  onChange={setBodyFatPct}
                  helper={
                    <>
                      Need a body-fat estimate first?{" "}
                      <a href="/estimate" className="text-primary underline font-semibold">
                        Estimate Body Fat %
                      </a>
                    </>
                  }
                />

                <SliderRow
                  label="Wrist Circumference"
                  valueLabel={`${round(wristCm, 1)} cm`}
                  value={wristCm}
                  min={12.2}
                  max={26.9}
                  step={0.1}
                  onChange={setWristCm}
                  helper={
                    <>
                      Measure at the narrowest wrist point. For context, compare with{" "}
                      <a href="/body-frame-size-calculator" className="text-primary underline font-semibold">
                        Body Frame Size Calculator
                      </a>
                      .
                    </>
                  }
                />
              </>
            )}
          </div>

          <div className="p-8 bg-base-100 min-w-0">
            <div className="mt-7 flex items-center justify-center">
              <Gauge
                value={calculated.score}
                label="% of Limit"
                rimColor={activeRange.color}
                min={scoreScale.min}
                max={scoreScale.max}
                digits={0}
              />
            </div>

            <div className="mt-6 rounded-2xl bg-base-200/60 p-4 text-center">
              <div className="text-sm text-gray-600">Assessment</div>
              <div className="mt-1 text-2xl font-bold" style={{ color: activeRange.color }}>
                {activeRange.label}
              </div>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">{activeRange.note}</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Normalized FFMI</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">
                  {round(calculated.normalizedFFMI, 2)}
                </div>
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Frame-Adjusted Limit</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">
                  {round(calculated.frameAdjustedLimit, 2)}
                </div>
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Current FFMI</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">
                  {round(calculated.ffmi, 2)}
                </div>
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Frame Category</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">
                  {calculated.frameCategory.label}
                </div>
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Lean Mass (estimated)</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">
                  {formatMass(calculated.leanMassKg, units)}
                </div>
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Natural Weight at Same BF%</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">
                  {formatMass(calculated.maxWeightAtCurrentBodyFatKg, units)}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-base-200/60 p-4">
              <div className="text-sm text-gray-600">Delta vs Frame-Adjusted Ceiling</div>
              <div className="mt-1 text-xl font-semibold text-gray-900">
                {formatSigned(
                  units === "metric" ? calculated.weightDeltaKg : kgToLb(calculated.weightDeltaKg),
                  1,
                )}{" "}
                {units === "metric" ? "kg" : "lbs"}
              </div>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                Positive values mean your current body weight is above the model's frame-adjusted ceiling
                at your selected body-fat percentage.
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-xs font-semibold text-gray-700 border-r border-gray-200">
                      FRAME
                    </th>
                    <th className="px-3 py-2 text-xs font-semibold text-gray-700">NFFMI LIMIT</th>
                  </tr>
                </thead>
                <tbody>
                  {frameLimitRows.map((row) => {
                    const activeCell = row.isActive
                      ? "border-y-4 border-gray-900"
                      : "border-y border-transparent";

                    return (
                      <tr key={row.key} className={row.rowClass}>
                        <td
                          className={[
                            "px-3 py-3 align-top",
                            activeCell,
                            row.isActive ? "border-l-4 border-gray-900 rounded-l-xl" : "",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full"
                              style={{ background: row.dotColor }}
                            />
                            <span className="font-semibold text-gray-900">{row.label}</span>
                          </div>
                        </td>
                        <td
                          className={[
                            "px-3 py-3 align-top font-semibold text-gray-900 tabular-nums",
                            activeCell,
                            row.isActive ? "border-r-4 border-gray-900 rounded-r-xl" : "",
                          ].join(" ")}
                        >
                          {round(row.limit, 2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <InterpretationBar
          value={calculated.score}
          ranges={ranges}
          min={scoreScale.min}
          max={scoreScale.max}
          ticks={scoreScale.ticks}
        />
      </div>
    </div>
  );
}
