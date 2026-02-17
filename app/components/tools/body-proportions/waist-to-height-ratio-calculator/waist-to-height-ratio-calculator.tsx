"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Gauge,
  InterpretationBar,
  SliderRow,
  UnitToggle,
  findRangeBucket,
} from "@/app/components/tools/body-weight/shared/ui";
import { cmToIn, inToCm, round, type Units } from "@/app/components/tools/body-weight/shared/math";
import { WAIST_TO_HEIGHT_RANGES } from "@/app/components/tools/body-proportions/waist-to-height-ratio-calculator/waist-to-height-ratio-ranges";

type Props = {
  onChange?: (payload: {
    ratio: number;
    waistCm: number;
    heightCm: number;
    targetWaistCm: number;
  }) => void;
};

function formatRange(min: number, max: number) {
  if (!Number.isFinite(max)) return `${round(min, 2)}+`;
  return `${round(min, 2)}-${round(max, 2)}`;
}

export default function WaistToHeightRatioCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [heightCm, setHeightCm] = useState<number>(177.8); // 5'10"
  const [waistCm, setWaistCm] = useState<number>(86.4); // 34 in

  const ratio = waistCm / Math.max(heightCm, 1);
  const targetWaistCm = heightCm * 0.5;

  const category = useMemo(
    () => findRangeBucket(ratio, WAIST_TO_HEIGHT_RANGES),
    [ratio],
  );

  const heightIn = useMemo(() => round(cmToIn(heightCm), 1), [heightCm]);
  const waistIn = useMemo(() => round(cmToIn(waistCm), 1), [waistCm]);
  const targetWaistIn = useMemo(() => round(cmToIn(targetWaistCm), 1), [targetWaistCm]);

  useEffect(() => {
    onChange?.({
      ratio,
      waistCm,
      heightCm,
      targetWaistCm,
    });
  }, [onChange, ratio, waistCm, heightCm, targetWaistCm]);

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
                  valueLabel={`${heightIn} in`}
                  value={heightIn}
                  min={55}
                  max={84}
                  step={0.1}
                  onChange={(inches) => setHeightCm(inToCm(inches))}
                />
                <SliderRow
                  label="Waist Circumference"
                  valueLabel={`${waistIn} in`}
                  value={waistIn}
                  min={20}
                  max={70}
                  step={0.1}
                  onChange={(inches) => setWaistCm(inToCm(inches))}
                />
              </>
            ) : (
              <>
                <SliderRow
                  label="Height"
                  valueLabel={`${round(heightCm, 1)} cm`}
                  value={round(heightCm, 1)}
                  min={140}
                  max={214}
                  step={0.1}
                  onChange={setHeightCm}
                />
                <SliderRow
                  label="Waist Circumference"
                  valueLabel={`${round(waistCm, 1)} cm`}
                  value={round(waistCm, 1)}
                  min={50}
                  max={180}
                  step={0.1}
                  onChange={setWaistCm}
                />
              </>
            )}

            <div className="mt-6 rounded-xl bg-base-200/50 p-4 text-sm text-gray-700">
              Common screening cue: keep waist under half your height. At your current height, that is about{" "}
              <span className="font-semibold text-gray-900">
                {units === "metric" ? `${round(targetWaistCm, 1)} cm` : `${targetWaistIn} in`}
              </span>
              .
            </div>
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge value={ratio} label="WHtR" rimColor={category.color} min={0.35} max={0.75} digits={2} />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Height</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {units === "metric" ? `${round(heightCm, 1)} cm` : `${heightIn} in`}
                  </div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Waist</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {units === "metric" ? `${round(waistCm, 1)} cm` : `${waistIn} in`}
                  </div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Waist-to-Height Ratio</div>
                  <div className="text-lg font-semibold text-gray-900">{round(ratio, 2)}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Waist at 0.50</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {units === "metric" ? `${round(targetWaistCm, 1)} cm` : `${targetWaistIn} in`}
                  </div>
                </div>
              </div>

              <div className="mt-6 w-full overflow-hidden rounded-xl border bg-white">
                <table className="w-full text-left text-xs sm:text-sm border-separate border-spacing-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 font-semibold text-gray-700">Range</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 text-right">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WAIST_TO_HEIGHT_RANGES.map((row) => {
                      const isActive = ratio >= row.min && ratio < row.max;
                      return (
                        <tr key={row.key} className={row.rowClass}>
                          <td
                            className={[
                              "px-3 py-2 tabular-nums text-gray-900",
                              isActive ? "border-l-4 border-gray-900 font-semibold" : "",
                            ].join(" ")}
                          >
                            {formatRange(row.min, row.max)}
                          </td>
                          <td
                            className={[
                              "px-3 py-2 text-right text-gray-900",
                              isActive ? "font-semibold border-r-4 border-gray-900 bg-white" : "",
                            ].join(" ")}
                          >
                            {row.label}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <InterpretationBar
          value={ratio}
          ranges={WAIST_TO_HEIGHT_RANGES}
          min={0.35}
          max={0.75}
          ticks={[0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7]}
        />
      </div>
    </div>
  );
}
