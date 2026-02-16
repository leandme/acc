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
  cmToM,
  formatFeetInches,
  inToCm,
  kgToLb,
  lbToKg,
  round,
  type Units,
} from "@/app/components/tools/body-weight/shared/math";
import { BROCA_PERCENT_RANGES } from "./broca-ranges";

type Props = {
  onChange?: (payload: {
    brocaWeightKg: number;
    percentOfBroca: number;
    bmi: number;
    weightGapKg: number;
  }) => void;
};

function brocaWeightKg(heightCm: number) {
  return heightCm - 100;
}

function computeBMI(weightKg: number, heightCm: number) {
  const heightM = cmToM(heightCm);
  if (heightM <= 0) return 0;
  return weightKg / (heightM * heightM);
}

export default function BrocaIndexCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [heightCm, setHeightCm] = useState<number>(175.3); // 5'9"
  const [weightKg, setWeightKg] = useState<number>(81.6); // 180 lb

  const heightIn = useMemo(() => Math.round(heightCm / 2.54), [heightCm]);
  const weightLb = useMemo(() => Math.round(kgToLb(weightKg)), [weightKg]);

  const brocaKg = useMemo(() => brocaWeightKg(heightCm), [heightCm]);
  const percentOfBroca = useMemo(() => {
    if (brocaKg <= 0) return 0;
    return (weightKg / brocaKg) * 100;
  }, [weightKg, brocaKg]);

  const bmi = useMemo(() => computeBMI(weightKg, heightCm), [weightKg, heightCm]);
  const weightGapKg = useMemo(() => weightKg - brocaKg, [weightKg, brocaKg]);

  const category = useMemo(() => findRangeBucket(percentOfBroca, BROCA_PERCENT_RANGES), [percentOfBroca]);

  useEffect(() => {
    onChange?.({
      brocaWeightKg: brocaKg,
      percentOfBroca,
      bmi,
      weightGapKg,
    });
  }, [onChange, brocaKg, percentOfBroca, bmi, weightGapKg]);

  const brocaDisplay = units === "metric" ? `${round(brocaKg, 1)} kg` : `${round(kgToLb(brocaKg), 1)} lbs`;
  const weightGapDisplay =
    units === "metric"
      ? `${weightGapKg >= 0 ? "+" : "-"}${round(Math.abs(weightGapKg), 1)} kg`
      : `${weightGapKg >= 0 ? "+" : "-"}${round(Math.abs(kgToLb(weightGapKg)), 1)} lbs`;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="rounded-3xl bg-white/80 backdrop-blur border shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="p-8 bg-white min-w-0">
            <div className="flex items-center justify-between">
              <UnitToggle units={units} onChange={setUnits} />
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
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge
                value={percentOfBroca}
                label="% of Broca"
                rimColor={category.color}
                min={70}
                max={170}
                digits={1}
              />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Broca Weight</div>
                  <div className="text-lg font-semibold text-gray-900">{brocaDisplay}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Current / Broca</div>
                  <div className="text-lg font-semibold text-gray-900">{round(percentOfBroca, 1)}%</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Current vs Broca</div>
                  <div className="text-lg font-semibold text-gray-900">{weightGapDisplay}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">BMI Context</div>
                  <div className="text-lg font-semibold text-gray-900">{round(bmi, 1)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <InterpretationBar
          value={percentOfBroca}
          ranges={BROCA_PERCENT_RANGES}
          min={70}
          max={170}
          ticks={[70, 90, 100, 110, 120, 130, 170]}
        />
      </div>
    </div>
  );
}
