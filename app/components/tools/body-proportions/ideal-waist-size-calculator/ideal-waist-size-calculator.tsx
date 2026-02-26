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
import { IDEAL_WAIST_RATIO_RANGES } from "./ideal-waist-size-ranges";

type Props = {
  onChange?: (payload: {
    sex: Sex;
    heightCm: number;
    waistCm: number;
    ratio: number;
    idealWaistCm: number;
    upperTargetWaistCm: number;
    aestheticRatio: number;
  }) => void;
};

type HeightTargetRow = {
  heightCm: number;
  idealWaistCm: number;
  upperTargetWaistCm: number;
};

export default function IdealWaistSizeCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");
  const [heightCm, setHeightCm] = useState<number>(177.8); // 5'10"
  const [waistCm, setWaistCm] = useState<number>(86.4); // 34 in

  const ratio = waistCm / Math.max(heightCm, 1);
  const category = useMemo(
    () => findRangeBucket(ratio, IDEAL_WAIST_RATIO_RANGES),
    [ratio],
  );

  const aestheticRatio = sex === "male" ? 0.46 : 0.45;
  const idealWaistCm = heightCm * aestheticRatio;
  const upperTargetWaistCm = heightCm * 0.5;
  const deltaFromIdealCm = waistCm - idealWaistCm;
  const deltaFromUpperCm = waistCm - upperTargetWaistCm;

  const heightIn = useMemo(() => round(cmToIn(heightCm), 1), [heightCm]);
  const waistIn = useMemo(() => round(cmToIn(waistCm), 1), [waistCm]);
  const idealWaistIn = useMemo(() => round(cmToIn(idealWaistCm), 1), [idealWaistCm]);
  const upperTargetWaistIn = useMemo(() => round(cmToIn(upperTargetWaistCm), 1), [upperTargetWaistCm]);

  const heightRows = useMemo<HeightTargetRow[]>(() => {
    const rows: HeightTargetRow[] = [];
    for (let h = 150; h <= 200; h += 5) {
      rows.push({
        heightCm: h,
        idealWaistCm: h * aestheticRatio,
        upperTargetWaistCm: h * 0.5,
      });
    }
    return rows;
  }, [aestheticRatio]);

  const closestHeightRow = useMemo(
    () =>
      heightRows.reduce((best, row) => {
        if (!best) return row;
        return Math.abs(row.heightCm - heightCm) < Math.abs(best.heightCm - heightCm)
          ? row
          : best;
      }, heightRows[0]),
    [heightRows, heightCm],
  );

  useEffect(() => {
    onChange?.({
      sex,
      heightCm,
      waistCm,
      ratio,
      idealWaistCm,
      upperTargetWaistCm,
      aestheticRatio,
    });
  }, [onChange, sex, heightCm, waistCm, ratio, idealWaistCm, upperTargetWaistCm, aestheticRatio]);

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
                  label="Height"
                  valueLabel={`${heightIn} in`}
                  value={heightIn}
                  min={55}
                  max={84}
                  step={0.1}
                  onChange={(inches) => setHeightCm(inToCm(inches))}
                />
                <SliderRow
                  label="Current Waist"
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
                  label="Current Waist"
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
              This calculator uses two reference targets:
              <span className="font-semibold text-gray-900"> {aestheticRatio.toFixed(2)}</span> (ideal-style
              target) and <span className="font-semibold text-gray-900">0.50</span> (upper practical target).
            </div>
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge value={ratio} label="Waist/Height" rimColor={category.color} min={0.35} max={0.75} digits={2} />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Current Waist</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {units === "metric" ? `${round(waistCm, 1)} cm` : `${waistIn} in`}
                  </div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Current Ratio</div>
                  <div className="text-lg font-semibold text-gray-900">{round(ratio, 2)}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Ideal Waist</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {units === "metric" ? `${round(idealWaistCm, 1)} cm` : `${idealWaistIn} in`}
                  </div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Upper Target Waist</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {units === "metric" ? `${round(upperTargetWaistCm, 1)} cm` : `${upperTargetWaistIn} in`}
                  </div>
                </div>
              </div>

              <div className="mt-6 w-full overflow-hidden rounded-xl border bg-white">
                <table className="w-full text-left text-xs sm:text-sm border-separate border-spacing-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 font-semibold text-gray-700">Height</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 text-right">Ideal / Upper Target Waist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heightRows.map((row) => {
                      const isActive = row.heightCm === closestHeightRow.heightCm;
                      return (
                        <tr key={row.heightCm} className={isActive ? "bg-primary/10" : "bg-white"}>
                          <td
                            className={[
                              "px-3 py-2 tabular-nums text-gray-900",
                              isActive ? "border-l-4 border-gray-900 font-semibold" : "",
                            ].join(" ")}
                          >
                            {row.heightCm} cm
                          </td>
                          <td
                            className={[
                              "px-3 py-2 text-right tabular-nums text-gray-900",
                              isActive ? "font-semibold border-r-4 border-gray-900 bg-white" : "",
                            ].join(" ")}
                          >
                            {round(row.idealWaistCm, 1)} / {round(row.upperTargetWaistCm, 1)} cm
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-sm text-gray-700">
                {deltaFromIdealCm > 0 ? "+" : ""}
                {round(deltaFromIdealCm, 1)} cm vs ideal target,{" "}
                {deltaFromUpperCm > 0 ? "+" : ""}
                {round(deltaFromUpperCm, 1)} cm vs upper target.
              </div>
            </div>
          </div>
        </div>

        <InterpretationBar
          value={ratio}
          ranges={IDEAL_WAIST_RATIO_RANGES}
          min={0.35}
          max={0.75}
          ticks={[0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.7]}
        />
      </div>
    </div>
  );
}
