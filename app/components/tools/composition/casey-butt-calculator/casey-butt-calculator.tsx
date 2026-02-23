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
import { getCaseyButtRanges, getCaseyButtScale } from "./casey-butt-ranges";

type Props = {
  onChange?: (payload: {
    sex: Sex;
    potentialWeightKg: number;
    potentialLeanMassKg: number;
    potentialNormalizedFFMI: number;
    currentLeanMassKg: number;
    utilizationPct: number;
    targetBodyFatPct: number;
  }) => void;
};

type MeasurementRow = {
  key: string;
  label: string;
  inches: number;
};

function caseyButtPotentialWeightLb(params: {
  heightIn: number;
  wristIn: number;
  ankleIn: number;
  bodyFatPct: number;
  sex: Sex;
}) {
  const { heightIn, wristIn, ankleIn, bodyFatPct, sex } = params;

  const safeBodyFat = clamp(bodyFatPct, 3, 30);
  const baseWeightLb =
    (Math.pow(heightIn, 1.5) *
      ((Math.sqrt(wristIn) / 22.667) + (Math.sqrt(ankleIn) / 17.0104)) *
      (safeBodyFat / 224 + 1)) /
    (1 - safeBodyFat / 100);

  // Casey Butt equations are based on male datasets.
  // This scales output for women so the tool remains usable across sexes.
  if (sex === "female") return baseWeightLb * 0.78;
  return baseWeightLb;
}

function caseyButtMeasurementInches(params: {
  heightIn: number;
  wristIn: number;
  ankleIn: number;
  sex: Sex;
}) {
  const { heightIn, wristIn, ankleIn, sex } = params;
  const femaleScale = sex === "female" ? 0.88 : 1;

  const rows: MeasurementRow[] = [
    {
      key: "chest",
      label: "Chest",
      inches: (1.6817 * wristIn + 1.3759 * ankleIn + 0.3314 * heightIn) * femaleScale,
    },
    {
      key: "upper-arm",
      label: "Upper Arm",
      inches: (1.2033 * wristIn + 0.1236 * heightIn) * femaleScale,
    },
    {
      key: "forearm",
      label: "Forearm",
      inches: (0.9626 * wristIn + 0.0989 * heightIn) * femaleScale,
    },
    {
      key: "neck",
      label: "Neck",
      inches: (1.1424 * wristIn + 0.1236 * heightIn) * femaleScale,
    },
    {
      key: "thigh",
      label: "Thigh",
      inches: (1.3868 * ankleIn + 0.1805 * heightIn) * femaleScale,
    },
    {
      key: "calf",
      label: "Calf",
      inches: (0.9298 * ankleIn + 0.121 * heightIn) * femaleScale,
    },
  ];

  return rows;
}

function formatMass(kg: number, units: Units) {
  if (units === "metric") return `${round(kg, 1)} kg`;
  return `${round(kgToLb(kg), 1)} lbs`;
}

export default function CaseyButtCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");

  const [heightCm, setHeightCm] = useState<number>(177.8); // 5'10"
  const [weightKg, setWeightKg] = useState<number>(81.6); // 180 lbs
  const [currentBodyFatPct, setCurrentBodyFatPct] = useState<number>(15);
  const [targetBodyFatPct, setTargetBodyFatPct] = useState<number>(10);
  const [wristCm, setWristCm] = useState<number>(17.5);
  const [ankleCm, setAnkleCm] = useState<number>(23.5);

  const heightIn = useMemo(() => Math.round(cmToIn(heightCm)), [heightCm]);
  const weightLb = useMemo(() => Math.round(kgToLb(weightKg)), [weightKg]);
  const wristIn = useMemo(() => round(cmToIn(wristCm), 1), [wristCm]);
  const ankleIn = useMemo(() => round(cmToIn(ankleCm), 1), [ankleCm]);

  const ranges = useMemo(() => getCaseyButtRanges(), []);
  const scale = useMemo(() => getCaseyButtScale(), []);

  const calculated = useMemo(() => {
    const safeCurrentBf = clamp(currentBodyFatPct, 3, 45) / 100;
    const potentialWeightLb = caseyButtPotentialWeightLb({
      heightIn: cmToIn(heightCm),
      wristIn: cmToIn(wristCm),
      ankleIn: cmToIn(ankleCm),
      bodyFatPct: targetBodyFatPct,
      sex,
    });
    const potentialWeightKg = lbToKg(potentialWeightLb);
    const potentialLeanMassKg = potentialWeightKg * (1 - clamp(targetBodyFatPct, 3, 30) / 100);

    const currentLeanMassKg = weightKg * (1 - safeCurrentBf);
    const utilizationPct = (currentLeanMassKg / potentialLeanMassKg) * 100;

    const hM = cmToM(heightCm);
    const potentialNormalizedFFMI =
      potentialLeanMassKg / (hM * hM) + 6.3 * (1.8 - hM);

    const measurementRows = caseyButtMeasurementInches({
      heightIn: cmToIn(heightCm),
      wristIn: cmToIn(wristCm),
      ankleIn: cmToIn(ankleCm),
      sex,
    });

    return {
      potentialWeightKg,
      potentialLeanMassKg,
      currentLeanMassKg,
      utilizationPct,
      potentialNormalizedFFMI,
      measurementRows,
      remainingLeanMassKg: potentialLeanMassKg - currentLeanMassKg,
    };
  }, [ankleCm, currentBodyFatPct, heightCm, sex, targetBodyFatPct, weightKg, wristCm]);

  const category = useMemo(
    () => findRangeBucket(calculated.potentialNormalizedFFMI, ranges),
    [calculated.potentialNormalizedFFMI, ranges],
  );

  useEffect(() => {
    onChange?.({
      sex,
      potentialWeightKg: calculated.potentialWeightKg,
      potentialLeanMassKg: calculated.potentialLeanMassKg,
      potentialNormalizedFFMI: calculated.potentialNormalizedFFMI,
      currentLeanMassKg: calculated.currentLeanMassKg,
      utilizationPct: calculated.utilizationPct,
      targetBodyFatPct,
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
                <option value="female">Women (scaled estimate)</option>
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
                  valueLabel={`${round(currentBodyFatPct, 1)}%`}
                  value={currentBodyFatPct}
                  min={3}
                  max={45}
                  step={0.1}
                  onChange={setCurrentBodyFatPct}
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
                  label="Ankle Circumference"
                  valueLabel={`${ankleIn} in`}
                  value={ankleIn}
                  min={6}
                  max={13}
                  step={0.1}
                  onChange={(inches) => setAnkleCm(inToCm(inches))}
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
                  valueLabel={`${round(currentBodyFatPct, 1)}%`}
                  value={currentBodyFatPct}
                  min={3}
                  max={45}
                  step={0.1}
                  onChange={setCurrentBodyFatPct}
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
                  label="Ankle Circumference"
                  valueLabel={`${round(ankleCm, 1)} cm`}
                  value={ankleCm}
                  min={15.2}
                  max={33}
                  step={0.1}
                  onChange={setAnkleCm}
                />
              </>
            )}
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge
                value={calculated.potentialNormalizedFFMI}
                label="Potential NFFMI"
                rimColor={category.color}
                min={scale.min}
                max={scale.max}
                digits={1}
              />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Potential Weight @ Target BF%</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatMass(calculated.potentialWeightKg, units)}
                  </div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Potential Lean Mass</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatMass(calculated.potentialLeanMassKg, units)}
                  </div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Current Lean Mass</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatMass(calculated.currentLeanMassKg, units)}
                  </div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Current Utilization</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {round(calculated.utilizationPct, 1)}%
                  </div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Remaining Lean Mass</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatMass(Math.max(0, calculated.remainingLeanMassKg), units)}
                  </div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Potential Normalized FFMI</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {round(calculated.potentialNormalizedFFMI, 2)}
                  </div>
                </div>
              </div>

              <div className="mt-6 w-full overflow-hidden rounded-2xl border bg-white">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-xs font-semibold text-gray-700 border-r border-gray-200">
                        MEASUREMENT
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold text-gray-700">POTENTIAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculated.measurementRows.map((row) => (
                      <tr key={row.key} className="bg-base-100">
                        <td className="px-3 py-2 text-sm text-gray-900 font-semibold border-t">
                          {row.label}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900 border-t">
                          {units === "metric"
                            ? `${round(inToCm(row.inches), 1)} cm`
                            : `${round(row.inches, 1)} in`}
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
          value={calculated.potentialNormalizedFFMI}
          ranges={ranges}
          min={scale.min}
          max={scale.max}
          ticks={scale.ticks}
        />
      </div>
    </div>
  );
}
