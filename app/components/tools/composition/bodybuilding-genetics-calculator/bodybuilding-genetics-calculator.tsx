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
import {
  getBodybuildingGeneticsRanges,
  getBodybuildingGeneticsScale,
} from "./bodybuilding-genetics-ranges";

type Props = {
  onChange?: (payload: {
    sex: Sex;
    geneticsScore: number;
    structureScore: number;
    potentialScore: number;
    currentExecutionScore: number;
    potentialNormalizedFFMI: number;
    currentNormalizedFFMI: number;
    potentialWeightKg: number;
    targetBodyFatPct: number;
  }) => void;
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

  if (sex === "female") return baseWeightLb * 0.78;
  return baseWeightLb;
}

function formatMass(kg: number, units: Units) {
  if (units === "metric") return `${round(kg, 1)} kg`;
  return `${round(kgToLb(kg), 1)} lbs`;
}

export default function BodybuildingGeneticsCalculator({ onChange }: Props) {
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

  const ranges = useMemo(() => getBodybuildingGeneticsRanges(), []);
  const scale = useMemo(() => getBodybuildingGeneticsScale(), []);

  const calculated = useMemo(() => {
    const safeCurrentBf = clamp(currentBodyFatPct, 3, 45) / 100;
    const hM = cmToM(heightCm);

    const currentLeanMassKg = weightKg * (1 - safeCurrentBf);
    const currentNormalizedFFMI =
      currentLeanMassKg / (hM * hM) + 6.3 * (1.8 - hM);

    const potentialWeightLb = caseyButtPotentialWeightLb({
      heightIn: cmToIn(heightCm),
      wristIn: cmToIn(wristCm),
      ankleIn: cmToIn(ankleCm),
      bodyFatPct: targetBodyFatPct,
      sex,
    });
    const potentialWeightKg = lbToKg(potentialWeightLb);
    const potentialLeanMassKg = potentialWeightKg * (1 - clamp(targetBodyFatPct, 3, 30) / 100);
    const potentialNormalizedFFMI =
      potentialLeanMassKg / (hM * hM) + 6.3 * (1.8 - hM);

    const frameIndex = (cmToIn(wristCm) + cmToIn(ankleCm)) / cmToIn(heightCm);
    const structureScore = clamp(((frameIndex - 0.19) / (0.26 - 0.19)) * 100, 0, 100);
    const potentialScore = clamp(((potentialNormalizedFFMI - 18) / (28 - 18)) * 100, 0, 100);
    const currentExecutionScore = clamp(
      (currentNormalizedFFMI / Math.max(potentialNormalizedFFMI, 1)) * 100,
      0,
      120,
    );

    const geneticsScore = clamp(0.7 * potentialScore + 0.3 * structureScore, 0, 100);

    return {
      currentLeanMassKg,
      currentNormalizedFFMI,
      potentialWeightKg,
      potentialLeanMassKg,
      potentialNormalizedFFMI,
      frameIndex,
      structureScore,
      potentialScore,
      currentExecutionScore,
      geneticsScore,
      remainingLeanMassKg: potentialLeanMassKg - currentLeanMassKg,
    };
  }, [ankleCm, currentBodyFatPct, heightCm, sex, targetBodyFatPct, weightKg, wristCm]);

  const category = useMemo(
    () => findRangeBucket(calculated.geneticsScore, ranges),
    [calculated.geneticsScore, ranges],
  );

  useEffect(() => {
    onChange?.({
      sex,
      geneticsScore: calculated.geneticsScore,
      structureScore: calculated.structureScore,
      potentialScore: calculated.potentialScore,
      currentExecutionScore: calculated.currentExecutionScore,
      potentialNormalizedFFMI: calculated.potentialNormalizedFFMI,
      currentNormalizedFFMI: calculated.currentNormalizedFFMI,
      potentialWeightKg: calculated.potentialWeightKg,
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
                  label="Target Body Fat % (Potential)"
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
                  label="Target Body Fat % (Potential)"
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
                value={calculated.geneticsScore}
                label="Genetics Score"
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
                  <div className="text-xs text-gray-600">Genetics Score</div>
                  <div className="text-lg font-semibold text-gray-900">{round(calculated.geneticsScore, 1)}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Structure Score (30%)</div>
                  <div className="text-lg font-semibold text-gray-900">{round(calculated.structureScore, 1)}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Potential Score (70%)</div>
                  <div className="text-lg font-semibold text-gray-900">{round(calculated.potentialScore, 1)}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Current Execution Score</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {round(calculated.currentExecutionScore, 1)}
                  </div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Potential Normalized FFMI</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {round(calculated.potentialNormalizedFFMI, 2)}
                  </div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Current Normalized FFMI</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {round(calculated.currentNormalizedFFMI, 2)}
                  </div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Potential Weight @ Target BF%</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatMass(calculated.potentialWeightKg, units)}
                  </div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Remaining Lean Mass</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatMass(Math.max(0, calculated.remainingLeanMassKg), units)}
                  </div>
                </div>
              </div>

              <div className="mt-6 w-full overflow-hidden rounded-2xl border bg-white">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-xs font-semibold text-gray-700 border-r border-gray-200">
                        COMPONENT
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold text-gray-700 border-r border-gray-200">
                        SCORE
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold text-gray-700">
                        WEIGHT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-blue-50">
                      <td className="px-3 py-2 text-sm font-semibold text-gray-900 border-t">
                        Structure Leverage
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 border-t">
                        {round(calculated.structureScore, 1)}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 border-t">
                        30%
                      </td>
                    </tr>
                    <tr className="bg-green-50">
                      <td className="px-3 py-2 text-sm font-semibold text-gray-900 border-t">
                        Potential Muscularity
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 border-t">
                        {round(calculated.potentialScore, 1)}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 border-t">
                        70%
                      </td>
                    </tr>
                    <tr className="bg-base-100">
                      <td className="px-3 py-2 text-sm font-semibold text-gray-900 border-t">
                        Current Execution (informational)
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 border-t">
                        {round(calculated.currentExecutionScore, 1)}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 border-t">
                        0%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <InterpretationBar
          value={calculated.geneticsScore}
          ranges={ranges}
          min={scale.min}
          max={scale.max}
          ticks={scale.ticks}
        />
      </div>
    </div>
  );
}
