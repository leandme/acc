"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Gauge,
  InterpretationBar,
  SliderRow,
  UnitToggle,
  findRangeBucket,
} from "@/app/components/tools/body-weight/shared/ui";
import { cmToIn, inToCm, round, type Sex, type Units } from "@/app/components/tools/body-weight/shared/math";
import { getWaistToHipRanges } from "@/app/components/tools/body-proportions/waist-to-hip-ratio-calculator/waist-to-hip-ratio-ranges";

type Props = {
  onChange?: (payload: {
    sex: Sex;
    ratio: number;
    waistCm: number;
    hipCm: number;
  }) => void;
};

function formatRange(min: number, max: number) {
  if (!Number.isFinite(max)) return `${round(min, 2)}+`;
  return `${round(min, 2)}-${round(max, 2)}`;
}

export default function WaistToHipRatioCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");
  const [waistCm, setWaistCm] = useState<number>(88.9); // 35 in
  const [hipCm, setHipCm] = useState<number>(101.6); // 40 in

  const ratio = waistCm / Math.max(hipCm, 1);
  const ranges = useMemo(() => getWaistToHipRanges(sex), [sex]);
  const category = useMemo(() => findRangeBucket(ratio, ranges), [ratio, ranges]);

  const waistIn = useMemo(() => round(cmToIn(waistCm), 1), [waistCm]);
  const hipIn = useMemo(() => round(cmToIn(hipCm), 1), [hipCm]);

  useEffect(() => {
    onChange?.({
      sex,
      ratio,
      waistCm,
      hipCm,
    });
  }, [onChange, sex, ratio, waistCm, hipCm]);

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
                onChange={(event) => setSex(event.target.value as Sex)}
                aria-label="Select sex"
              >
                <option value="male">Men</option>
                <option value="female">Women</option>
              </select>
            </div>

            {units === "imperial" ? (
              <>
                <SliderRow
                  label="Waist Circumference"
                  valueLabel={`${waistIn} in`}
                  value={waistIn}
                  min={20}
                  max={70}
                  step={0.1}
                  onChange={(inches) => setWaistCm(inToCm(inches))}
                />
                <SliderRow
                  label="Hip Circumference"
                  valueLabel={`${hipIn} in`}
                  value={hipIn}
                  min={24}
                  max={80}
                  step={0.1}
                  onChange={(inches) => setHipCm(inToCm(inches))}
                />
              </>
            ) : (
              <>
                <SliderRow
                  label="Waist Circumference"
                  valueLabel={`${round(waistCm, 1)} cm`}
                  value={round(waistCm, 1)}
                  min={50}
                  max={180}
                  step={0.1}
                  onChange={setWaistCm}
                />
                <SliderRow
                  label="Hip Circumference"
                  valueLabel={`${round(hipCm, 1)} cm`}
                  value={round(hipCm, 1)}
                  min={60}
                  max={200}
                  step={0.1}
                  onChange={setHipCm}
                />
              </>
            )}
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge value={ratio} label="WHR" rimColor={category.color} min={0.6} max={1.2} digits={2} />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Waist</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {units === "metric" ? `${round(waistCm, 1)} cm` : `${waistIn} in`}
                  </div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Hip</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {units === "metric" ? `${round(hipCm, 1)} cm` : `${hipIn} in`}
                  </div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3 col-span-2">
                  <div className="text-xs text-gray-600">Waist-to-Hip Ratio</div>
                  <div className="text-lg font-semibold text-gray-900">{round(ratio, 2)}</div>
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
                    {ranges.map((row) => {
                      const isActive = ratio >= row.min && ratio < row.max;
                      return (
                        <tr key={row.key} className={row.rowClass}>
                          <td className={["px-3 py-2 tabular-nums text-gray-900", isActive ? "border-l-4 border-gray-900 font-semibold" : ""].join(" ")}>
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
          ranges={ranges}
          min={0.6}
          max={1.2}
          ticks={[0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2]}
        />
      </div>
    </div>
  );
}

