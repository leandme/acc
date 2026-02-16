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
  type Sex,
  type Units,
} from "@/app/components/tools/body-weight/shared/math";
import { IDEAL_WEIGHT_PERCENT_RANGES } from "./ideal-weight-ranges";

type Props = {
  onChange?: (payload: {
    percentOfTarget: number;
    devineKg: number;
    healthyMinKg: number;
    healthyMaxKg: number;
    gapToDevineKg: number;
  }) => void;
};

function devineIBWKg(sex: Sex, heightInches: number) {
  const base = sex === "male" ? 50 : 45.5;
  return base + 2.3 * (heightInches - 60);
}

export default function IdealWeightCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");

  const [heightCm, setHeightCm] = useState<number>(177.8); // 5'10"
  const [weightKg, setWeightKg] = useState<number>(83.9); // 185 lb

  const heightIn = useMemo(() => Math.round(heightCm / 2.54), [heightCm]);
  const weightLb = useMemo(() => Math.round(kgToLb(weightKg)), [weightKg]);

  const devineKg = useMemo(() => devineIBWKg(sex, heightIn), [sex, heightIn]);
  const healthyMinKg = useMemo(() => 18.5 * Math.pow(cmToM(heightCm), 2), [heightCm]);
  const healthyMaxKg = useMemo(() => 24.9 * Math.pow(cmToM(heightCm), 2), [heightCm]);

  const percentOfTarget = useMemo(() => {
    if (devineKg <= 0) return 0;
    return (weightKg / devineKg) * 100;
  }, [weightKg, devineKg]);

  const gapToDevineKg = useMemo(() => weightKg - devineKg, [weightKg, devineKg]);

  const category = useMemo(
    () => findRangeBucket(percentOfTarget, IDEAL_WEIGHT_PERCENT_RANGES),
    [percentOfTarget],
  );

  useEffect(() => {
    onChange?.({
      percentOfTarget,
      devineKg,
      healthyMinKg,
      healthyMaxKg,
      gapToDevineKg,
    });
  }, [onChange, percentOfTarget, devineKg, healthyMinKg, healthyMaxKg, gapToDevineKg]);

  const devineDisplay = units === "metric" ? `${round(devineKg, 1)} kg` : `${round(kgToLb(devineKg), 1)} lbs`;
  const healthyRangeDisplay =
    units === "metric"
      ? `${round(healthyMinKg, 1)}-${round(healthyMaxKg, 1)} kg`
      : `${round(kgToLb(healthyMinKg), 1)}-${round(kgToLb(healthyMaxKg), 1)} lbs`;
  const gapDisplay =
    units === "metric"
      ? `${round(Math.abs(gapToDevineKg), 1)} kg`
      : `${round(Math.abs(kgToLb(gapToDevineKg)), 1)} lbs`;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="rounded-3xl bg-white/80 backdrop-blur border shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="p-8 bg-white min-w-0">
            <div className="flex items-center justify-between">
              <UnitToggle units={units} onChange={setUnits} />
            </div>

            <div className="mt-5 flex items-center justify-between">
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
                value={percentOfTarget}
                label="% of Target"
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
                  <div className="text-xs text-gray-600">Devine IBW</div>
                  <div className="text-lg font-semibold text-gray-900">{devineDisplay}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Healthy BMI Range</div>
                  <div className="text-lg font-semibold text-gray-900">{healthyRangeDisplay}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Current vs Devine</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {gapToDevineKg >= 0 ? "+" : "-"}
                    {gapDisplay}
                  </div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Current / Devine</div>
                  <div className="text-lg font-semibold text-gray-900">{round(percentOfTarget, 1)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <InterpretationBar
          value={percentOfTarget}
          ranges={IDEAL_WEIGHT_PERCENT_RANGES}
          min={70}
          max={170}
          ticks={[70, 90, 100, 110, 120, 130, 170]}
        />
      </div>
    </div>
  );
}
