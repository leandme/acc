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
import { OVERWEIGHT_BMI_RANGES } from "@/app/components/tools/body-weight/overweight-calculator/overweight-ranges";

type Props = {
  onChange?: (payload: {
    bmi: number;
    healthyMinWeightKg: number;
    healthyMaxWeightKg: number;
    category: string;
  }) => void;
};

function computeBMI(weightKg: number, heightCm: number) {
  const heightM = cmToM(heightCm);
  if (heightM <= 0) return 0;
  return weightKg / (heightM * heightM);
}

export default function BMICalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [heightCm, setHeightCm] = useState<number>(175.3); // 5'9"
  const [weightKg, setWeightKg] = useState<number>(81.6); // 180 lb

  const heightIn = useMemo(() => Math.round(heightCm / 2.54), [heightCm]);
  const weightLb = useMemo(() => Math.round(kgToLb(weightKg)), [weightKg]);

  const bmi = useMemo(() => computeBMI(weightKg, heightCm), [weightKg, heightCm]);

  const healthyMinWeightKg = useMemo(() => 18.5 * Math.pow(cmToM(heightCm), 2), [heightCm]);
  const healthyMaxWeightKg = useMemo(() => 24.9 * Math.pow(cmToM(heightCm), 2), [heightCm]);

  const category = useMemo(() => findRangeBucket(bmi, OVERWEIGHT_BMI_RANGES), [bmi]);

  useEffect(() => {
    onChange?.({
      bmi,
      healthyMinWeightKg,
      healthyMaxWeightKg,
      category: category.label,
    });
  }, [onChange, bmi, healthyMinWeightKg, healthyMaxWeightKg, category.label]);

  const healthyRangeDisplay =
    units === "metric"
      ? `${round(healthyMinWeightKg, 1)}-${round(healthyMaxWeightKg, 1)} kg`
      : `${round(kgToLb(healthyMinWeightKg), 1)}-${round(kgToLb(healthyMaxWeightKg), 1)} lbs`;

  const weightToUpperHealthyKg = Math.max(0, weightKg - healthyMaxWeightKg);
  const weightToLowerHealthyKg = Math.max(0, healthyMinWeightKg - weightKg);

  const changeToRangeDisplay =
    weightToUpperHealthyKg > 0
      ? units === "metric"
        ? `-${round(weightToUpperHealthyKg, 1)} kg`
        : `-${round(kgToLb(weightToUpperHealthyKg), 1)} lbs`
      : weightToLowerHealthyKg > 0
      ? units === "metric"
        ? `+${round(weightToLowerHealthyKg, 1)} kg`
        : `+${round(kgToLb(weightToLowerHealthyKg), 1)} lbs`
      : "In range";

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
              <Gauge value={bmi} label="BMI" rimColor={category.color} min={15} max={45} digits={1} />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">BMI</div>
                  <div className="text-lg font-semibold text-gray-900">{round(bmi, 1)}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Category</div>
                  <div className="text-lg font-semibold text-gray-900">{category.label}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Healthy BMI Weight Range</div>
                  <div className="text-lg font-semibold text-gray-900">{healthyRangeDisplay}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Change to Reach Range</div>
                  <div className="text-lg font-semibold text-gray-900">{changeToRangeDisplay}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <InterpretationBar
          value={bmi}
          ranges={OVERWEIGHT_BMI_RANGES}
          min={15}
          max={45}
          ticks={[15, 18.5, 25, 30, 35, 40, 45]}
        />
      </div>
    </div>
  );
}
