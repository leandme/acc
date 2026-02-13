"use client";

import React, { useEffect, useMemo, useState } from "react";
import RFMInterpretationBar from "./rfm-interpretation-bar";

type Units = "imperial" | "metric";
type Sex = "male" | "female";

type Props = {
  onChange?: (payload: { gender: Sex; rfm: number }) => void;
};

type Bucket = {
  label: string;
  min: number;
  max: number;
  color: string;
  hint: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function inToCm(inches: number) {
  return inches * 2.54;
}

function cmToIn(cm: number) {
  return cm / 2.54;
}

const MALE_BUCKETS: Bucket[] = [
  {
    label: "Essential",
    min: 0,
    max: 6,
    color: "#3b82f6",
    hint: "Extremely lean range.",
  },
  {
    label: "Athletic",
    min: 6,
    max: 14,
    color: "#22c55e",
    hint: "Lean and performance-oriented.",
  },
  {
    label: "Fitness",
    min: 14,
    max: 18,
    color: "#fde047",
    hint: "Fit range for active men.",
  },
  {
    label: "Average",
    min: 18,
    max: 25,
    color: "#f59e0b",
    hint: "Typical adult range.",
  },
  {
    label: "High",
    min: 25,
    max: 100,
    color: "#ef4444",
    hint: "Higher range; focus on trends over time.",
  },
];

const FEMALE_BUCKETS: Bucket[] = [
  {
    label: "Essential",
    min: 0,
    max: 14,
    color: "#3b82f6",
    hint: "Extremely lean range.",
  },
  {
    label: "Athletic",
    min: 14,
    max: 21,
    color: "#22c55e",
    hint: "Lean and performance-oriented.",
  },
  {
    label: "Fitness",
    min: 21,
    max: 25,
    color: "#fde047",
    hint: "Fit range for active women.",
  },
  {
    label: "Average",
    min: 25,
    max: 32,
    color: "#f59e0b",
    hint: "Typical adult range.",
  },
  {
    label: "High",
    min: 32,
    max: 100,
    color: "#ef4444",
    hint: "Higher range; focus on trends over time.",
  },
];

function getBuckets(sex: Sex) {
  return sex === "female" ? FEMALE_BUCKETS : MALE_BUCKETS;
}

function bucketFor(sex: Sex, rfm: number) {
  const buckets = getBuckets(sex);
  return buckets.find((b) => rfm >= b.min && rfm < b.max) ?? buckets[buckets.length - 1];
}

function computeRFM(params: {
  sex: Sex;
  heightIn: number;
  waistIn: number;
}) {
  const { sex, heightIn, waistIn } = params;

  if (heightIn <= 0 || waistIn <= 0) {
    return { raw: null as number | null, rounded: null as number | null };
  }

  const constant = sex === "male" ? 64 : 76;
  const raw = constant - 20 * (heightIn / waistIn);
  const clamped = clamp(raw, 2, 70);

  return {
    raw: clamped,
    rounded: Math.round(clamped),
  };
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
  const pct = clamp((value - 5) / (45 - 5), 0, 1);
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
          <div className="text-5xl font-bold text-gray-900">{value}</div>
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
  onChange: (v: number) => void;
}) {
  const { label, valueLabel, value, min, max, step = 1, onChange } = props;

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
    </div>
  );
}

export default function RFMCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");

  // Canonical units are inches because the classic equation uses a ratio.
  const [heightIn, setHeightIn] = useState<number>(69);
  const [waistIn, setWaistIn] = useState<number>(34);

  const heightFt = useMemo(() => Math.floor(heightIn / 12), [heightIn]);
  const heightRemIn = useMemo(() => heightIn % 12, [heightIn]);

  const result = useMemo(() => computeRFM({ sex, heightIn, waistIn }), [sex, heightIn, waistIn]);

  useEffect(() => {
    if (result.rounded != null) {
      onChange?.({ gender: sex, rfm: result.rounded });
    }
  }, [onChange, result.rounded, sex]);

  const category = useMemo(() => {
    if (result.rounded == null) return null;
    return bucketFor(sex, result.rounded);
  }, [sex, result.rounded]);

  const displayHeight =
    units === "metric" ? `${Math.round(inToCm(heightIn))} cm` : `${heightFt} ft ${heightRemIn} in`;
  const displayWaist =
    units === "metric" ? `${Math.round(inToCm(waistIn))} cm` : `${waistIn.toFixed(1)} in`;

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
                  onChange={setHeightIn}
                />

                <SliderRow
                  label="Waist"
                  valueLabel={displayWaist}
                  value={waistIn}
                  min={22}
                  max={70}
                  step={0.1}
                  onChange={setWaistIn}
                />
              </>
            ) : (
              <>
                <SliderRow
                  label="Height"
                  valueLabel={displayHeight}
                  value={Math.round(inToCm(heightIn))}
                  min={140}
                  max={214}
                  step={1}
                  onChange={(cm) => setHeightIn(cmToIn(cm))}
                />

                <SliderRow
                  label="Waist"
                  valueLabel={displayWaist}
                  value={Math.round(inToCm(waistIn))}
                  min={56}
                  max={178}
                  step={1}
                  onChange={(cm) => setWaistIn(cmToIn(cm))}
                />
              </>
            )}

          </div>

          <div className="bg-white border-l border-black/5 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              {result.rounded != null && category != null ? (
                <>
                  <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Relative Fat Mass</p>
                  <div className="mt-2">
                    <Gauge value={result.rounded} label="% RFM" rimColor={category.color} />
                  </div>

                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                    {category.label}
                  </div>

                  <p className="mt-3 text-sm text-gray-600 max-w-[300px] leading-relaxed">{category.hint}</p>
                </>
              ) : (
                <p className="text-sm text-gray-500">Enter valid measurements to calculate RFM.</p>
              )}
            </div>

          </div>
        </div>
        <RFMInterpretationBar rfm={result.rounded ?? 0} sex={sex} />
      </div>
    </div>
  );
}
