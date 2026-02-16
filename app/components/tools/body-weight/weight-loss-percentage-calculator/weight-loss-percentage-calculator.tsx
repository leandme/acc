"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Gauge,
  InterpretationBar,
  SliderRow,
  UnitToggle,
  findRangeBucket,
} from "@/app/components/tools/body-weight/shared/ui";
import { kgToLb, lbToKg, round, type Units } from "@/app/components/tools/body-weight/shared/math";
import { WEIGHT_LOSS_PERCENTAGE_RANGES } from "./weight-loss-percentage-ranges";

type Props = {
  onChange?: (payload: {
    weightLossPct: number;
    weightChangeKg: number;
    startWeightKg: number;
    currentWeightKg: number;
  }) => void;
};

function computeWeightLossPercentage(startWeightKg: number, currentWeightKg: number) {
  if (startWeightKg <= 0) return 0;
  return ((startWeightKg - currentWeightKg) / startWeightKg) * 100;
}

export default function WeightLossPercentageCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");

  // Canonical storage in kg.
  const [startWeightKg, setStartWeightKg] = useState<number>(95.3); // 210 lb
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(86.2); // 190 lb

  const startWeightLb = useMemo(() => Math.round(kgToLb(startWeightKg)), [startWeightKg]);
  const currentWeightLb = useMemo(() => Math.round(kgToLb(currentWeightKg)), [currentWeightKg]);

  const weightLossPct = useMemo(
    () => computeWeightLossPercentage(startWeightKg, currentWeightKg),
    [startWeightKg, currentWeightKg],
  );

  const weightChangeKg = useMemo(() => startWeightKg - currentWeightKg, [startWeightKg, currentWeightKg]);

  const category = useMemo(
    () => findRangeBucket(weightLossPct, WEIGHT_LOSS_PERCENTAGE_RANGES),
    [weightLossPct],
  );

  useEffect(() => {
    onChange?.({
      weightLossPct,
      weightChangeKg,
      startWeightKg,
      currentWeightKg,
    });
  }, [onChange, weightLossPct, weightChangeKg, startWeightKg, currentWeightKg]);

  const displayStartWeight =
    units === "metric" ? `${round(startWeightKg, 1)} kg` : `${Math.round(kgToLb(startWeightKg))} lbs`;

  const displayCurrentWeight =
    units === "metric"
      ? `${round(currentWeightKg, 1)} kg`
      : `${Math.round(kgToLb(currentWeightKg))} lbs`;

  const displayWeightChange =
    units === "metric"
      ? `${round(weightChangeKg, 1)} kg`
      : `${round(kgToLb(weightChangeKg), 1)} lbs`;

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
                  label="Starting Weight"
                  valueLabel={`${startWeightLb} lbs`}
                  value={startWeightLb}
                  min={80}
                  max={450}
                  step={1}
                  onChange={(lb) => setStartWeightKg(lbToKg(lb))}
                  helper="Use the weight from the start of your cut or intervention period."
                />

                <SliderRow
                  label="Current Weight"
                  valueLabel={`${currentWeightLb} lbs`}
                  value={currentWeightLb}
                  min={70}
                  max={450}
                  step={1}
                  onChange={(lb) => setCurrentWeightKg(lbToKg(lb))}
                  helper="Use a recent average (for example, your 7-day rolling average)."
                />
              </>
            ) : (
              <>
                <SliderRow
                  label="Starting Weight"
                  valueLabel={`${round(startWeightKg, 1)} kg`}
                  value={round(startWeightKg, 1)}
                  min={36}
                  max={205}
                  step={0.1}
                  onChange={setStartWeightKg}
                  helper="Use the weight from the start of your cut or intervention period."
                />

                <SliderRow
                  label="Current Weight"
                  valueLabel={`${round(currentWeightKg, 1)} kg`}
                  value={round(currentWeightKg, 1)}
                  min={32}
                  max={205}
                  step={0.1}
                  onChange={setCurrentWeightKg}
                  helper="Use a recent average (for example, your 7-day rolling average)."
                />
              </>
            )}
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge value={weightLossPct} label="Weight Loss %" rimColor={category.color} min={-10} max={40} digits={1} />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Weight Loss %</div>
                  <div className="text-lg font-semibold text-gray-900">{round(weightLossPct, 1)}%</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Weight Change</div>
                  <div className="text-lg font-semibold text-gray-900">{displayWeightChange}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Starting Weight</div>
                  <div className="text-lg font-semibold text-gray-900">{displayStartWeight}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Current Weight</div>
                  <div className="text-lg font-semibold text-gray-900">{displayCurrentWeight}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <InterpretationBar
          value={weightLossPct}
          ranges={WEIGHT_LOSS_PERCENTAGE_RANGES}
          min={-10}
          max={40}
          ticks={[-10, 0, 5, 10, 15, 20, 30, 40]}
        />
      </div>
    </div>
  );
}
