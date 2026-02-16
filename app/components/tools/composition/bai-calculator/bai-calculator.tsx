"use client";

import React, { useEffect, useMemo, useState } from "react";
import BAIInterpretationBar from "./bai-interpretation-bar";
import { findBAIRange, getAgeBand, type Sex } from "./bai-ranges";

type Units = "imperial" | "metric";

type Props = {
  onChange?: (payload: {
    sex: Sex;
    age: number;
    bai: number;
    category: string;
    ageBand: string;
  }) => void;
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

function calculateBAI(hipCm: number, heightCm: number) {
  if (hipCm <= 0 || heightCm <= 0) return null;

  const heightM = heightCm / 100;
  if (heightM <= 0) return null;

  const raw = hipCm / Math.pow(heightM, 1.5) - 18;
  if (!Number.isFinite(raw)) return null;

  return raw;
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
  const pct = clamp((value - 0) / (50 - 0), 0, 1);
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
          <div className="text-5xl font-bold text-gray-900">{round(value, 1)}</div>
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

export default function BAICalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");

  // Canonical units: cm
  const [heightCm, setHeightCm] = useState<number>(175);
  const [hipCm, setHipCm] = useState<number>(100);
  const [age, setAge] = useState<number>(30);

  const heightIn = useMemo(() => Math.round(cmToIn(heightCm)), [heightCm]);
  const heightFt = useMemo(() => Math.floor(heightIn / 12), [heightIn]);
  const heightRemIn = useMemo(() => heightIn % 12, [heightIn]);

  const baiRaw = useMemo(() => calculateBAI(hipCm, heightCm), [hipCm, heightCm]);

  const bai = useMemo(() => {
    if (baiRaw == null) return null;
    return round(clamp(baiRaw, 2, 70), 1);
  }, [baiRaw]);

  const category = useMemo(() => {
    if (bai == null) return null;
    return findBAIRange(sex, age, bai);
  }, [sex, age, bai]);

  const ageBand = useMemo(() => getAgeBand(age), [age]);

  useEffect(() => {
    if (bai != null && category != null) {
      onChange?.({ sex, age, bai, category: category.label, ageBand });
    }
  }, [onChange, sex, age, bai, category, ageBand]);

  const displayHeight = units === "metric" ? `${Math.round(heightCm)} cm` : `${heightFt} ft ${heightRemIn} in`;
  const displayHip =
    units === "metric" ? `${round(hipCm, 1).toFixed(1)} cm` : `${round(cmToIn(hipCm), 1).toFixed(1)} in`;

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

            <SliderRow
              label="Age"
              valueLabel={`${age}`}
              value={age}
              min={20}
              max={79}
              step={1}
              onChange={setAge}
              helper="Interpretation ranges are age-banded: 20-39, 40-59, and 60-79."
            />

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
                  helper="Measure without shoes and keep posture neutral."
                />

                <SliderRow
                  label="Hip Circumference"
                  valueLabel={displayHip}
                  value={round(cmToIn(hipCm), 1)}
                  min={26}
                  max={70}
                  step={0.1}
                  onChange={(inches) => setHipCm(inToCm(inches))}
                  helper="Measure around the widest point of the hips/glutes."
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
                  helper="Measure without shoes and keep posture neutral."
                />

                <SliderRow
                  label="Hip Circumference"
                  valueLabel={displayHip}
                  value={round(hipCm, 1)}
                  min={66}
                  max={178}
                  step={0.1}
                  onChange={setHipCm}
                  helper="Measure around the widest point of the hips/glutes."
                />
              </>
            )}
          </div>

          <div className="bg-white border-l border-black/5 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              {bai != null && category != null ? (
                <>
                  <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Body Adiposity Index</p>
                  <div className="mt-2">
                    <Gauge value={bai} label="BAI" rimColor={category.color} />
                  </div>

                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                    {category.label}
                  </div>

                  <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

                  <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                    <div className="rounded-xl bg-base-200/60 p-3">
                      <div className="text-xs text-gray-600">BAI</div>
                      <div className="text-lg font-semibold text-gray-900">{bai.toFixed(1)}%</div>
                    </div>
                    <div className="rounded-xl bg-base-200/60 p-3">
                      <div className="text-xs text-gray-600">Category</div>
                      <div className="text-lg font-semibold text-gray-900">{category.label}</div>
                    </div>
                    <div className="rounded-xl bg-base-200/60 p-3">
                      <div className="text-xs text-gray-600">Age Band</div>
                      <div className="text-lg font-semibold text-gray-900">{ageBand}</div>
                    </div>
                    <div className="rounded-xl bg-base-200/60 p-3">
                      <div className="text-xs text-gray-600">Hip / Height</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {(hipCm / heightCm).toFixed(3)}
                      </div>
                    </div>
                    <div className="rounded-xl bg-base-200/60 p-3">
                      <div className="text-xs text-gray-600">Height</div>
                      <div className="text-lg font-semibold text-gray-900">{displayHeight}</div>
                    </div>
                    <div className="rounded-xl bg-base-200/60 p-3">
                      <div className="text-xs text-gray-600">Hip</div>
                      <div className="text-lg font-semibold text-gray-900">{displayHip}</div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">Enter valid measurements to calculate BAI.</p>
              )}
            </div>
          </div>
        </div>

        <BAIInterpretationBar bai={bai ?? 0} sex={sex} age={age} />
      </div>
    </div>
  );
}
