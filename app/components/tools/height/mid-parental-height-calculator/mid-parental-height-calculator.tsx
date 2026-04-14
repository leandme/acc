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
  round,
  type Sex,
  type Units,
} from "@/app/components/tools/body-weight/shared/math";
import {
  getMidParentalTargetCm,
  getPopulationHeightPercentile,
  getTargetRangeCm,
} from "@/app/components/tools/height/shared/height-utils";
import {
  getMidParentalPercentileRanges,
  getMidParentalPercentileScale,
} from "./mid-parental-height-ranges";

type Props = {
  onChange?: (payload: {
    childSex: Sex;
    targetHeightCm: number;
    targetRangeLowerCm: number;
    targetRangeUpperCm: number;
    predictedPercentile: number;
  }) => void;
};

function formatHeightDisplay(cm: number, units: Units) {
  const roundedInches = Math.round(cmToIn(cm));
  if (units === "metric") {
    return `${round(cm, 1)} cm (${formatFeetInches(roundedInches)})`;
  }
  return `${formatFeetInches(roundedInches)} (${round(cm, 1)} cm)`;
}

export default function MidParentalHeightCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [childSex, setChildSex] = useState<Sex>("male");

  const [fatherHeightCm, setFatherHeightCm] = useState<number>(177.8); // 5'10"
  const [motherHeightCm, setMotherHeightCm] = useState<number>(162.6); // 5'4"

  const fatherInches = useMemo(() => Math.round(cmToIn(fatherHeightCm)), [fatherHeightCm]);
  const motherInches = useMemo(() => Math.round(cmToIn(motherHeightCm)), [motherHeightCm]);

  const percentileRanges = useMemo(() => getMidParentalPercentileRanges(), []);
  const percentileScale = useMemo(() => getMidParentalPercentileScale(), []);

  const calculated = useMemo(() => {
    const targetHeightCm = getMidParentalTargetCm(fatherHeightCm, motherHeightCm, childSex);
    const targetRange = getTargetRangeCm(targetHeightCm, 8.5);
    const predictedPercentile = getPopulationHeightPercentile(targetHeightCm, childSex);

    return {
      targetHeightCm,
      targetRangeLowerCm: targetRange.lowerCm,
      targetRangeUpperCm: targetRange.upperCm,
      predictedPercentile,
      familyHeightGapCm: fatherHeightCm - motherHeightCm,
    };
  }, [childSex, fatherHeightCm, motherHeightCm]);

  const percentileCategory = useMemo(
    () => findRangeBucket(calculated.predictedPercentile, percentileRanges),
    [calculated.predictedPercentile, percentileRanges],
  );

  useEffect(() => {
    onChange?.({
      childSex,
      targetHeightCm: calculated.targetHeightCm,
      targetRangeLowerCm: calculated.targetRangeLowerCm,
      targetRangeUpperCm: calculated.targetRangeUpperCm,
      predictedPercentile: calculated.predictedPercentile,
    });
  }, [calculated, childSex, onChange]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="rounded-3xl bg-white/80 backdrop-blur border shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="p-8 bg-white min-w-0">
            <div className="flex items-center justify-between">
              <UnitToggle units={units} onChange={setUnits} />
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="font-semibold text-gray-900">Child Sex</div>
              <select
                className="select select-bordered"
                value={childSex}
                onChange={(e) => setChildSex(e.target.value as Sex)}
                aria-label="Select child sex"
              >
                <option value="male">Man</option>
                <option value="female">Girl</option>
              </select>
            </div>

            {units === "imperial" ? (
              <>
                <SliderRow
                  label="Father Height"
                  valueLabel={formatFeetInches(fatherInches)}
                  value={fatherInches}
                  min={54}
                  max={84}
                  step={1}
                  onChange={(inches) => setFatherHeightCm(inToCm(inches))}
                />

                <SliderRow
                  label="Mother Height"
                  valueLabel={formatFeetInches(motherInches)}
                  value={motherInches}
                  min={54}
                  max={84}
                  step={1}
                  onChange={(inches) => setMotherHeightCm(inToCm(inches))}
                  helper={
                    <>
                      Want a desired-target probability too? Use the{" "}
                      <a href="/height-calculator" className="text-primary underline font-semibold">
                        Height Calculator
                      </a>
                      .
                    </>
                  }
                />
              </>
            ) : (
              <>
                <SliderRow
                  label="Father Height"
                  valueLabel={`${round(fatherHeightCm, 1)} cm`}
                  value={round(fatherHeightCm, 1)}
                  min={137}
                  max={214}
                  step={0.1}
                  onChange={setFatherHeightCm}
                />

                <SliderRow
                  label="Mother Height"
                  valueLabel={`${round(motherHeightCm, 1)} cm`}
                  value={round(motherHeightCm, 1)}
                  min={137}
                  max={214}
                  step={0.1}
                  onChange={setMotherHeightCm}
                  helper={
                    <>
                      Want a desired-target probability too? Use the{" "}
                      <a href="/height-calculator" className="text-primary underline font-semibold">
                        Height Calculator
                      </a>
                      .
                    </>
                  }
                />
              </>
            )}
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge
                value={calculated.predictedPercentile}
                label="Percentile"
                rimColor={percentileCategory.color}
                min={percentileScale.min}
                max={percentileScale.max}
                digits={0}
              />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: percentileCategory.color }}
                />
                {percentileCategory.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">
                {percentileCategory.note}
              </p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Target Adult Height</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatHeightDisplay(calculated.targetHeightCm, units)}
                  </div>
                </div>

                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Target Range</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatHeightDisplay(calculated.targetRangeLowerCm, units)} -{" "}
                    {formatHeightDisplay(calculated.targetRangeUpperCm, units)}
                  </div>
                </div>

                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Predicted Percentile</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {round(calculated.predictedPercentile, 1)}th
                  </div>
                </div>

                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Parent Height Difference</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {round(calculated.familyHeightGapCm, 1)} cm
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <InterpretationBar
          value={calculated.predictedPercentile}
          ranges={percentileRanges}
          min={percentileScale.min}
          max={percentileScale.max}
          ticks={percentileScale.ticks}
        />
      </div>
    </div>
  );
}
