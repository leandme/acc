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
import { buildPonderalRanges } from "./ponderal-ranges";

type Props = {
  onChange?: (payload: {
    ponderalIndex: number;
    equivalentBmi: number;
    ranges: ReturnType<typeof buildPonderalRanges>;
  }) => void;
};

function calculatePonderalIndex(weightKg: number, heightCm: number) {
  const heightM = cmToM(heightCm);
  if (heightM <= 0) return 0;
  return weightKg / Math.pow(heightM, 3);
}

export default function PonderalIndexCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [heightCm, setHeightCm] = useState<number>(175.3);
  const [weightKg, setWeightKg] = useState<number>(81.6);

  const heightIn = useMemo(() => Math.round(heightCm / 2.54), [heightCm]);
  const weightLb = useMemo(() => Math.round(kgToLb(weightKg)), [weightKg]);

  const heightM = useMemo(() => cmToM(heightCm), [heightCm]);
  const ponderalIndex = useMemo(() => calculatePonderalIndex(weightKg, heightCm), [weightKg, heightCm]);
  const equivalentBmi = useMemo(() => ponderalIndex * heightM, [ponderalIndex, heightM]);

  const ranges = useMemo(() => buildPonderalRanges(heightM), [heightM]);
  const category = useMemo(() => findRangeBucket(ponderalIndex, ranges), [ponderalIndex, ranges]);

  const healthyMinPi = useMemo(() => 18.5 / heightM, [heightM]);
  const healthyMaxPi = useMemo(() => 24.9 / heightM, [heightM]);

  const barMin = useMemo(() => Math.max(4, healthyMinPi - 4), [healthyMinPi]);
  const barMax = useMemo(() => Math.min(30, (40 / Math.max(heightM, 0.01)) + 4), [heightM]);

  const ticks = useMemo(() => {
    const raw = [barMin, ranges[0].max, ranges[1].max, ranges[2].max, ranges[3].max, ranges[4].max, barMax];
    const rounded = raw.map((value) => round(value, 1));
    const unique = Array.from(new Set(rounded));
    return unique.sort((a, b) => a - b);
  }, [barMin, barMax, ranges]);

  useEffect(() => {
    onChange?.({
      ponderalIndex,
      equivalentBmi,
      ranges,
    });
  }, [onChange, ponderalIndex, equivalentBmi, ranges]);

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
                  label="Weight"
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
                  label="Weight"
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
                value={ponderalIndex}
                label="PI"
                rimColor={category.color}
                min={barMin}
                max={barMax}
                digits={2}
              />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Ponderal Index</div>
                  <div className="text-lg font-semibold text-gray-900">{round(ponderalIndex, 2)}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Equivalent BMI</div>
                  <div className="text-lg font-semibold text-gray-900">{round(equivalentBmi, 1)}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Healthy PI Range</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {round(healthyMinPi, 2)}-{round(healthyMaxPi, 2)}
                  </div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Height-Adjusted Category</div>
                  <div className="text-lg font-semibold text-gray-900">{category.label}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <InterpretationBar value={ponderalIndex} ranges={ranges} min={barMin} max={barMax} ticks={ticks} />
      </div>
    </div>
  );
}
