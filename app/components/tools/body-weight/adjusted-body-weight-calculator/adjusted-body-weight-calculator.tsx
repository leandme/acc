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
import { ADJUSTED_BODY_WEIGHT_PERCENT_RANGES } from "./adjusted-body-weight-ranges";

type Props = {
  onChange?: (payload: {
    ibwKg: number;
    percentOfIbw: number;
    adjustedBodyWeightKg: number;
    dosingWeightKg: number;
  }) => void;
};

function devineIBWKg(sex: Sex, heightInches: number) {
  const base = sex === "male" ? 50 : 45.5;
  return base + 2.3 * (heightInches - 60);
}

function adjustedBodyWeightKg(actualKg: number, ibwKg: number) {
  return ibwKg + 0.4 * (actualKg - ibwKg);
}

export default function AdjustedBodyWeightCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");

  const [heightCm, setHeightCm] = useState<number>(177.8);
  const [actualWeightKg, setActualWeightKg] = useState<number>(106.6); // 235 lb

  const heightIn = useMemo(() => Math.round(heightCm / 2.54), [heightCm]);
  const actualWeightLb = useMemo(() => Math.round(kgToLb(actualWeightKg)), [actualWeightKg]);

  const ibwKg = useMemo(() => devineIBWKg(sex, heightIn), [sex, heightIn]);
  const percentOfIbw = useMemo(() => {
    if (ibwKg <= 0) return 0;
    return (actualWeightKg / ibwKg) * 100;
  }, [actualWeightKg, ibwKg]);

  const adjBwKg = useMemo(() => adjustedBodyWeightKg(actualWeightKg, ibwKg), [actualWeightKg, ibwKg]);

  const shouldUseAdjusted = percentOfIbw >= 120;
  const dosingWeightKg = shouldUseAdjusted ? adjBwKg : actualWeightKg;

  const category = useMemo(
    () => findRangeBucket(percentOfIbw, ADJUSTED_BODY_WEIGHT_PERCENT_RANGES),
    [percentOfIbw],
  );

  useEffect(() => {
    onChange?.({
      ibwKg,
      percentOfIbw,
      adjustedBodyWeightKg: adjBwKg,
      dosingWeightKg,
    });
  }, [onChange, ibwKg, percentOfIbw, adjBwKg, dosingWeightKg]);

  const ibwDisplay = units === "metric" ? `${round(ibwKg, 1)} kg` : `${round(kgToLb(ibwKg), 1)} lbs`;
  const adjBwDisplay = units === "metric" ? `${round(adjBwKg, 1)} kg` : `${round(kgToLb(adjBwKg), 1)} lbs`;
  const dosingWeightDisplay =
    units === "metric" ? `${round(dosingWeightKg, 1)} kg` : `${round(kgToLb(dosingWeightKg), 1)} lbs`;

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
                  label="Actual Body Weight"
                  valueLabel={`${actualWeightLb} lbs`}
                  value={actualWeightLb}
                  min={70}
                  max={500}
                  step={1}
                  onChange={(lb) => setActualWeightKg(lbToKg(lb))}
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
                  label="Actual Body Weight"
                  valueLabel={`${round(actualWeightKg, 1)} kg`}
                  value={round(actualWeightKg, 1)}
                  min={32}
                  max={227}
                  step={0.1}
                  onChange={setActualWeightKg}
                />
              </>
            )}
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge value={percentOfIbw} label="% of IBW" rimColor={category.color} min={80} max={200} digits={1} />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Devine IBW</div>
                  <div className="text-lg font-semibold text-gray-900">{ibwDisplay}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Actual / IBW</div>
                  <div className="text-lg font-semibold text-gray-900">{round(percentOfIbw, 1)}%</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Adjusted Body Weight</div>
                  <div className="text-lg font-semibold text-gray-900">{adjBwDisplay}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Suggested Dosing Weight</div>
                  <div className="text-lg font-semibold text-gray-900">{dosingWeightDisplay}</div>
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-600">
                {shouldUseAdjusted
                  ? "At >=120% IBW, this tool surfaces AdjBW as the common default for dosing calculations."
                  : "Below 120% IBW, many protocols use actual body weight for dosing."}
              </p>
            </div>
          </div>
        </div>

        <InterpretationBar
          value={percentOfIbw}
          ranges={ADJUSTED_BODY_WEIGHT_PERCENT_RANGES}
          min={80}
          max={200}
          ticks={[80, 100, 120, 140, 160, 200]}
        />
      </div>
    </div>
  );
}
