"use client";

import React, { useEffect, useMemo, useState } from "react";
import FrameInterpretationBar from "./frame-interpretation-bar";
import { findFrameRange, type Sex } from "./frame-ranges";

type Units = "imperial" | "metric";

type Props = {
  onChange?: (payload: { sex: Sex; ratio: number; frameLabel: string }) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function round(n: number, d = 1) {
  const m = Math.pow(10, d);
  return Math.round(n * m) / m;
}

function inToCm(inches: number) {
  return inches * 2.54;
}

function cmToIn(cm: number) {
  return cm / 2.54;
}

function Gauge({
  value,
  label,
  rimColor,
}: {
  value: number;
  label: string;
  rimColor: string;
}) {
  const pct = clamp((value - 8.5) / (12.2 - 8.5), 0, 1);
  const deg = Math.round(pct * 280);

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative w-44 h-44 rounded-full"
        style={{
          background: `conic-gradient(from 220deg,
            ${rimColor} 0deg ${deg}deg,
            rgba(0,0,0,0.08) ${deg}deg 280deg,
            transparent 280deg 360deg
          )`,
        }}
      >
        <div className="absolute inset-[14px] rounded-full bg-white/90 flex flex-col items-center justify-center shadow-sm">
          <div className="text-5xl font-bold text-gray-900">{round(value, 2)}</div>
          <div className="text-sm font-semibold text-gray-700">{label}</div>
        </div>
      </div>
    </div>
  );
}

function SliderRow(props: {
  label: string;
  valueLabel: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  helper?: React.ReactNode;
  onChange: (v: number) => void;
}) {
  const { label, valueLabel, value, min, max, step = 1, helper, onChange } = props;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-gray-900">{label}</div>
      </div>

      <div className="mt-2 flex items-end justify-between gap-4">
        <div className="text-3xl font-semibold text-gray-900 whitespace-nowrap">{valueLabel}</div>
      </div>

      <input
        type="range"
        className="range range-primary mt-3"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />

      {helper ? <div className="mt-2 text-sm text-gray-500">{helper}</div> : null}
    </div>
  );
}

export default function BodyFrameSizeCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");

  // Canonical units: cm
  const [heightCm, setHeightCm] = useState<number>(178);
  const [wristCm, setWristCm] = useState<number>(17.5);

  const heightIn = useMemo(() => Math.round(cmToIn(heightCm)), [heightCm]);
  const heightFt = useMemo(() => Math.floor(heightIn / 12), [heightIn]);
  const heightRemIn = useMemo(() => heightIn % 12, [heightIn]);

  const ratio = useMemo(() => {
    if (wristCm <= 0) return 0;
    return heightCm / wristCm;
  }, [heightCm, wristCm]);

  const category = useMemo(() => findFrameRange(sex, ratio), [sex, ratio]);

  useEffect(() => {
    onChange?.({ sex, ratio, frameLabel: category.label });
  }, [onChange, sex, ratio, category.label]);

  const displayHeight = units === "metric" ? `${Math.round(heightCm)} cm` : `${heightFt} ft ${heightRemIn} in`;
  const displayWrist =
    units === "metric" ? `${round(wristCm, 1).toFixed(1)} cm` : `${round(cmToIn(wristCm), 1).toFixed(1)} in`;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="rounded-3xl bg-white/80 backdrop-blur border shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="p-8 bg-white min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${units === "imperial" ? "text-primary" : "text-gray-500"}`}>
                  Imperial
                </span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={units === "metric"}
                  onChange={(e) => setUnits(e.target.checked ? "metric" : "imperial")}
                  aria-label="Toggle imperial/metric"
                />
                <span className={`text-sm font-semibold ${units === "metric" ? "text-primary" : "text-gray-500"}`}>
                  Metric
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="font-semibold text-gray-900">Gender</div>
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
                  valueLabel={displayHeight}
                  value={heightIn}
                  min={55}
                  max={84}
                  step={1}
                  onChange={(inches) => setHeightCm(inToCm(inches))}
                  helper="Stand tall without shoes and keep posture neutral."
                />

                <SliderRow
                  label="Wrist Circumference"
                  valueLabel={displayWrist}
                  value={round(cmToIn(wristCm), 1)}
                  min={4.5}
                  max={10.5}
                  step={0.1}
                  onChange={(inches) => setWristCm(inToCm(inches))}
                  helper="Measure at the narrowest point between hand and forearm."
                />
              </>
            ) : (
              <>
                <SliderRow
                  label="Height"
                  valueLabel={displayHeight}
                  value={Math.round(heightCm)}
                  min={140}
                  max={214}
                  step={1}
                  onChange={setHeightCm}
                  helper="Stand tall without shoes and keep posture neutral."
                />

                <SliderRow
                  label="Wrist Circumference"
                  valueLabel={displayWrist}
                  value={round(wristCm, 1)}
                  min={11}
                  max={27}
                  step={0.1}
                  onChange={setWristCm}
                  helper="Measure at the narrowest point between hand and forearm."
                />
              </>
            )}
          </div>

          <div className="p-8 bg-base-100 min-w-0">
            <div className="mt-7 flex items-center justify-center">
              <Gauge value={ratio} label="Ratio" rimColor={category.color} />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Frame Size</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{category.label}</div>
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Height / Wrist Ratio</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{ratio.toFixed(2)}</div>
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Height</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{displayHeight}</div>
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Wrist</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{displayWrist}</div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-base-200/60 p-4">
              <div className="text-sm text-gray-600">Interpretation</div>
              <div className="mt-1 text-2xl font-bold" style={{ color: category.color }}>
                {category.note}
              </div>
              <p className="mt-2 text-sm text-gray-700">{category.adjustment}</p>
            </div>
          </div>
        </div>

        <FrameInterpretationBar ratio={ratio} sex={sex} />
      </div>
    </div>
  );
}
