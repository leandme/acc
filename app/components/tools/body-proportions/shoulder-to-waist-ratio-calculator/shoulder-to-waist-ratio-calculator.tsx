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
import { getShoulderToWaistRanges } from "./shoulder-to-waist-ratio-ranges";

type Props = {
  onChange?: (payload: {
    sex: Sex;
    ratio: number;
    shoulderCm: number;
    waistCm: number;
    benchmarkRatio: number;
    benchmarkWaistCm: number;
  }) => void;
};

function formatRange(min: number, max: number) {
  if (!Number.isFinite(max)) return `${round(min, 2)}+`;
  return `${round(min, 2)}-${round(max, 2)}`;
}

export default function ShoulderToWaistRatioCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");
  const [shoulderCm, setShoulderCm] = useState<number>(122); // ~48 in
  const [waistCm, setWaistCm] = useState<number>(81.3); // 32 in

  const ratio = shoulderCm / Math.max(waistCm, 1);
  const ranges = useMemo(() => getShoulderToWaistRanges(sex), [sex]);
  const category = useMemo(() => findRangeBucket(ratio, ranges), [ratio, ranges]);
  const benchmarkRatio = sex === "male" ? 1.6 : 1.4;
  const benchmarkWaistCm = shoulderCm / benchmarkRatio;

  const shoulderIn = useMemo(() => round(cmToIn(shoulderCm), 1), [shoulderCm]);
  const waistIn = useMemo(() => round(cmToIn(waistCm), 1), [waistCm]);
  const benchmarkWaistIn = useMemo(() => round(cmToIn(benchmarkWaistCm), 1), [benchmarkWaistCm]);

  useEffect(() => {
    onChange?.({
      sex,
      ratio,
      shoulderCm,
      waistCm,
      benchmarkRatio,
      benchmarkWaistCm,
    });
  }, [onChange, sex, ratio, shoulderCm, waistCm, benchmarkRatio, benchmarkWaistCm]);

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
                  label="Shoulder Circumference"
                  valueLabel={`${shoulderIn} in`}
                  value={shoulderIn}
                  min={30}
                  max={70}
                  step={0.1}
                  onChange={(inches) => setShoulderCm(inToCm(inches))}
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
                  label="Shoulder Circumference"
                  valueLabel={`${round(shoulderCm, 1)} cm`}
                  value={round(shoulderCm, 1)}
                  min={76}
                  max={178}
                  step={0.1}
                  onChange={setShoulderCm}
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
              Benchmark taper used here:{" "}
              <span className="font-semibold text-gray-900">{benchmarkRatio.toFixed(2)}</span>.
              At your shoulder size, that corresponds to waist near{" "}
              <span className="font-semibold text-gray-900">
                {units === "metric" ? `${round(benchmarkWaistCm, 1)} cm` : `${benchmarkWaistIn} in`}
              </span>
              .
            </div>
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge value={ratio} label="SWR" rimColor={category.color} min={1.0} max={2.0} digits={2} />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Shoulders</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {units === "metric" ? `${round(shoulderCm, 1)} cm` : `${shoulderIn} in`}
                  </div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Waist</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {units === "metric" ? `${round(waistCm, 1)} cm` : `${waistIn} in`}
                  </div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">SWR</div>
                  <div className="text-lg font-semibold text-gray-900">{round(ratio, 2)}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Waist at Benchmark</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {units === "metric" ? `${round(benchmarkWaistCm, 1)} cm` : `${benchmarkWaistIn} in`}
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
                    {ranges.map((row) => {
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
          ranges={ranges}
          min={1.0}
          max={2.0}
          ticks={[1.0, 1.15, 1.3, 1.45, 1.6, 1.75, 2.0]}
        />
      </div>
    </div>
  );
}
