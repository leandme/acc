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
import {
  BODY_SHAPE_MATCH_RANGES,
  BODY_SHAPE_ROWS,
  getBodyShapeRow,
  type BodyShapeKey,
} from "@/app/components/tools/composition/body-shape-calculator/body-shape-types";
import { estimateBodyShape } from "@/app/components/tools/composition/body-shape-calculator/body-shape-math";

type Props = {
  onChange?: (payload: {
    shape: BodyShapeKey;
    topScore: number;
    bustCm: number;
    waistCm: number;
    hipCm: number;
    bustToHip: number;
    waistToBust: number;
    waistToHip: number;
  }) => void;
};

export default function BodyShapeCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [bustCm, setBustCm] = useState<number>(96.5); // 38 in
  const [waistCm, setWaistCm] = useState<number>(76.2); // 30 in
  const [hipCm, setHipCm] = useState<number>(101.6); // 40 in

  const result = useMemo(
    () =>
      estimateBodyShape({
        bustCm,
        waistCm,
        hipCm,
      }),
    [bustCm, waistCm, hipCm],
  );

  const activeRow = useMemo(() => getBodyShapeRow(result.shape), [result.shape]);
  const matchBand = useMemo(
    () => findRangeBucket(result.topScore, BODY_SHAPE_MATCH_RANGES),
    [result.topScore],
  );

  const rowsWithScores = useMemo(() => {
    return BODY_SHAPE_ROWS.map((row) => ({
      ...row,
      score: result.scores[row.key],
    }));
  }, [result.scores]);

  const bustIn = useMemo(() => round(cmToIn(bustCm), 1), [bustCm]);
  const waistIn = useMemo(() => round(cmToIn(waistCm), 1), [waistCm]);
  const hipIn = useMemo(() => round(cmToIn(hipCm), 1), [hipCm]);

  useEffect(() => {
    onChange?.({
      shape: result.shape,
      topScore: result.topScore,
      bustCm,
      waistCm,
      hipCm,
      bustToHip: result.bustToHip,
      waistToBust: result.waistToBust,
      waistToHip: result.waistToHip,
    });
  }, [
    onChange,
    result.shape,
    result.topScore,
    result.bustToHip,
    result.waistToBust,
    result.waistToHip,
    bustCm,
    waistCm,
    hipCm,
  ]);

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
                  label="Bust / Chest"
                  valueLabel={`${bustIn} in`}
                  value={bustIn}
                  min={24}
                  max={70}
                  step={0.1}
                  onChange={(inches) => setBustCm(inToCm(inches))}
                />
                <SliderRow
                  label="Waist"
                  valueLabel={`${waistIn} in`}
                  value={waistIn}
                  min={20}
                  max={65}
                  step={0.1}
                  onChange={(inches) => setWaistCm(inToCm(inches))}
                />
                <SliderRow
                  label="Hips"
                  valueLabel={`${hipIn} in`}
                  value={hipIn}
                  min={24}
                  max={75}
                  step={0.1}
                  onChange={(inches) => setHipCm(inToCm(inches))}
                />
              </>
            ) : (
              <>
                <SliderRow
                  label="Bust / Chest"
                  valueLabel={`${round(bustCm, 1)} cm`}
                  value={round(bustCm, 1)}
                  min={60}
                  max={178}
                  step={0.1}
                  onChange={setBustCm}
                />
                <SliderRow
                  label="Waist"
                  valueLabel={`${round(waistCm, 1)} cm`}
                  value={round(waistCm, 1)}
                  min={50}
                  max={165}
                  step={0.1}
                  onChange={setWaistCm}
                />
                <SliderRow
                  label="Hips"
                  valueLabel={`${round(hipCm, 1)} cm`}
                  value={round(hipCm, 1)}
                  min={60}
                  max={191}
                  step={0.1}
                  onChange={setHipCm}
                />
              </>
            )}

            <div className="mt-6 rounded-xl bg-base-200/50 p-4 text-sm text-gray-700">
              Use flexible tape measurements at consistent landmarks and compare trends over time.
            </div>
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge value={result.topScore} label="Match %" rimColor={activeRow.color} min={0} max={100} digits={0} />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: activeRow.color }} />
                {activeRow.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{activeRow.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Bust : Hip</div>
                  <div className="text-lg font-semibold text-gray-900">{round(result.bustToHip, 2)}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Waist : Bust</div>
                  <div className="text-lg font-semibold text-gray-900">{round(result.waistToBust, 2)}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3 col-span-2">
                  <div className="text-xs text-gray-600">Waist : Hip</div>
                  <div className="text-lg font-semibold text-gray-900">{round(result.waistToHip, 2)}</div>
                </div>
              </div>

              <div className="mt-6 w-full overflow-hidden rounded-xl border bg-white">
                <table className="w-full text-left text-xs sm:text-sm border-separate border-spacing-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 font-semibold text-gray-700">Body Shape</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 text-right">Match</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowsWithScores.map((row) => {
                      const isActive = row.key === result.shape;
                      return (
                        <tr key={row.key} className={row.rowClass}>
                          <td className={["px-3 py-2 text-gray-900", isActive ? "border-l-4 border-gray-900 font-semibold" : ""].join(" ")}>
                            {row.label}
                          </td>
                          <td
                            className={[
                              "px-3 py-2 text-right tabular-nums",
                              isActive ? "font-semibold border-r-4 border-gray-900 bg-white text-gray-900" : "text-gray-700",
                            ].join(" ")}
                          >
                            {row.score}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="mt-3 text-xs text-gray-500">Shape match strength: {matchBand.label}</p>
            </div>
          </div>
        </div>

        <InterpretationBar
          value={result.topScore}
          ranges={BODY_SHAPE_MATCH_RANGES}
          min={0}
          max={100}
          ticks={[0, 25, 45, 65, 80, 100]}
        />
      </div>
    </div>
  );
}
