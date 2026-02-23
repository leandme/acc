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
import {
  getMuscularPotentialRanges,
  getMuscularPotentialScale,
} from "./muscular-potential-ranges";

type Props = {
  onChange?: (payload: {
    sex: Sex;
    frameLabel: string;
    utilizationPct: number;
    maxLeanMassKg: number;
    currentLeanMassKg: number;
    maxWeightAtTargetBfKg: number;
    targetBodyFatPct: number;
    normalizedCeilingFFMI: number;
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

function getFrameAdjustment(sex: Sex, frameKey: string) {
  if (frameKey === "small") return FRAME_ADJUSTMENT_NFFMI[sex].small;
  if (frameKey === "large") return FRAME_ADJUSTMENT_NFFMI[sex].large;
  return FRAME_ADJUSTMENT_NFFMI[sex].medium;
}

function formatMass(kg: number, units: Units) {
  if (units === "metric") return `${round(kg, 1)} kg`;
  return `${round(kgToLb(kg), 1)} lbs`;
}

export default function MuscularPotentialCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");

  const [heightCm, setHeightCm] = useState<number>(177.8); // 5'10"
  const [weightKg, setWeightKg] = useState<number>(81.6); // 180 lbs
  const [bodyFatPct, setBodyFatPct] = useState<number>(15);
  const [wristCm, setWristCm] = useState<number>(17.5);
  const [targetBodyFatPct, setTargetBodyFatPct] = useState<number>(12);

  const heightIn = useMemo(() => Math.round(cmToIn(heightCm)), [heightCm]);
  const weightLb = useMemo(() => Math.round(kgToLb(weightKg)), [weightKg]);
  const wristIn = useMemo(() => round(cmToIn(wristCm), 1), [wristCm]);

  const ranges = useMemo(() => getMuscularPotentialRanges(), []);
  const scale = useMemo(() => getMuscularPotentialScale(), []);

  const calculated = useMemo(() => {
    const safeCurrentBf = clamp(bodyFatPct, 3, 45) / 100;
    const safeTargetBf = clamp(targetBodyFatPct, 3, 30) / 100;

    const heightM = cmToM(heightCm);
    const currentLeanMassKg = weightKg * (1 - safeCurrentBf);
    const frameRatio = heightCm / wristCm;
    const frameCategory = findFrameRange(sex, frameRatio);
    const frameAdjustment = getFrameAdjustment(sex, frameCategory.key);

    const normalizedCeilingFFMI = BASE_NATURAL_NFFMI[sex] + frameAdjustment;
    const heightSpecificFfmiCeiling = normalizedCeilingFFMI - 6.3 * (1.8 - heightM);
    const maxLeanMassKg = heightSpecificFfmiCeiling * (heightM * heightM);
    const maxWeightAtTargetBfKg = maxLeanMassKg / (1 - safeTargetBf);

    const utilizationPct = (currentLeanMassKg / maxLeanMassKg) * 100;
    const remainingLeanMassKg = maxLeanMassKg - currentLeanMassKg;
    const currentNormalizedFfmi =
      currentLeanMassKg / (heightM * heightM) + 6.3 * (1.8 - heightM);

    const stageToLeanMass = (pct: number) => maxLeanMassKg * pct;

    const stageRows = [
      { key: "novice", label: "Novice Build", stagePct: 0.7 },
      { key: "intermediate", label: "Intermediate Build", stagePct: 0.82 },
      { key: "advanced", label: "Advanced Build", stagePct: 0.92 },
      { key: "ceiling", label: "Modelled Ceiling", stagePct: 1.0 },
    ].map((row) => {
      const leanKg = stageToLeanMass(row.stagePct);
      return {
        ...row,
        leanKg,
        weightKgAtTargetBf: leanKg / (1 - safeTargetBf),
      };
    });

    return {
      currentLeanMassKg,
      frameCategory,
      normalizedCeilingFFMI,
      maxLeanMassKg,
      maxWeightAtTargetBfKg,
      utilizationPct,
      remainingLeanMassKg,
      currentNormalizedFfmi,
      stageRows,
    };
  }, [bodyFatPct, heightCm, sex, targetBodyFatPct, weightKg, wristCm]);

  const category = useMemo(
    () => findRangeBucket(calculated.utilizationPct, ranges),
    [calculated.utilizationPct, ranges],
  );

  useEffect(() => {
    onChange?.({
      sex,
      frameLabel: calculated.frameCategory.label,
      utilizationPct: calculated.utilizationPct,
      maxLeanMassKg: calculated.maxLeanMassKg,
      currentLeanMassKg: calculated.currentLeanMassKg,
      maxWeightAtTargetBfKg: calculated.maxWeightAtTargetBfKg,
      targetBodyFatPct,
      normalizedCeilingFFMI: calculated.normalizedCeilingFFMI,
    });
  }, [calculated, onChange, sex, targetBodyFatPct]);

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
                  label="Current Weight"
                  valueLabel={`${weightLb} lbs`}
                  value={weightLb}
                  min={90}
                  max={360}
                  step={1}
                  onChange={(lb) => setWeightKg(lbToKg(lb))}
                />

                <SliderRow
                  label="Current Body Fat %"
                  valueLabel={`${round(bodyFatPct, 1)}%`}
                  value={bodyFatPct}
                  min={3}
                  max={45}
                  step={0.1}
                  onChange={setBodyFatPct}
                  helper={
                    <>
                      Need a body-fat estimate?{" "}
                      <a href="/estimate" className="text-primary underline font-semibold">
                        Estimate Body Fat %
                      </a>
                      .
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
                />

                <SliderRow
                  label="Target Body Fat %"
                  valueLabel={`${round(targetBodyFatPct, 1)}%`}
                  value={targetBodyFatPct}
                  min={3}
                  max={30}
                  step={0.1}
                  onChange={setTargetBodyFatPct}
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
                  label="Current Weight"
                  valueLabel={`${Math.round(weightKg)} kg`}
                  value={weightKg}
                  min={40}
                  max={165}
                  step={1}
                  onChange={setWeightKg}
                />

                <SliderRow
                  label="Current Body Fat %"
                  valueLabel={`${round(bodyFatPct, 1)}%`}
                  value={bodyFatPct}
                  min={3}
                  max={45}
                  step={0.1}
                  onChange={setBodyFatPct}
                  helper={
                    <>
                      Need a body-fat estimate?{" "}
                      <a href="/estimate" className="text-primary underline font-semibold">
                        Estimate Body Fat %
                      </a>
                      .
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
                />

                <SliderRow
                  label="Target Body Fat %"
                  valueLabel={`${round(targetBodyFatPct, 1)}%`}
                  value={targetBodyFatPct}
                  min={3}
                  max={30}
                  step={0.1}
                  onChange={setTargetBodyFatPct}
                />
              </>
            )}
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge
                value={calculated.utilizationPct}
                label="% of Potential"
                rimColor={category.color}
                min={scale.min}
                max={scale.max}
                digits={0}
              />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Current Lean Mass</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatMass(calculated.currentLeanMassKg, units)}
                  </div>
                </div>

                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Modelled Max Lean Mass</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatMass(calculated.maxLeanMassKg, units)}
                  </div>
                </div>

                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Remaining Lean Mass</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatMass(Math.max(0, calculated.remainingLeanMassKg), units)}
                  </div>
                </div>

                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Weight at Target BF%</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatMass(calculated.maxWeightAtTargetBfKg, units)}
                  </div>
                </div>

                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Current Normalized FFMI</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {round(calculated.currentNormalizedFfmi, 2)}
                  </div>
                </div>

                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Ceiling Normalized FFMI</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {round(calculated.normalizedCeilingFFMI, 2)}
                  </div>
                </div>
              </div>

              <div className="mt-6 w-full overflow-hidden rounded-2xl border bg-white">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-xs font-semibold text-gray-700 border-r border-gray-200">
                        STAGE
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold text-gray-700 border-r border-gray-200">
                        LEAN MASS
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold text-gray-700">
                        WT @ TARGET BF%
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculated.stageRows.map((row) => (
                      <tr key={row.key} className="bg-base-100">
                        <td className="px-3 py-2 text-sm text-gray-900 font-semibold border-t">
                          {row.label}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900 border-t">
                          {formatMass(row.leanKg, units)}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900 border-t">
                          {formatMass(row.weightKgAtTargetBf, units)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <InterpretationBar
          value={calculated.utilizationPct}
          ranges={ranges}
          min={scale.min}
          max={scale.max}
          ticks={scale.ticks}
        />
      </div>
    </div>
  );
}
