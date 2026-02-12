"use client";

import React, { useMemo, useState } from "react";
import BodyFatInterpretationBar from "./body-fat-interpretation-bar";

type Sex = "male" | "female";
type Units = "imperial" | "metric";

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

function lbToKg(lb: number) {
  return lb * 0.45359237;
}

function kgToLb(kg: number) {
  return kg / 0.45359237;
}

const MALE_BUCKETS: Bucket[] = [
  {
    label: "Essential",
    min: 0,
    max: 6,
    color: "#3b82f6",
    hint: "Extremely lean. This range is not a casual target for most people.",
  },
  {
    label: "Athletic",
    min: 6,
    max: 14,
    color: "#22c55e",
    hint: "Lean, performance-oriented range with visible definition.",
  },
  {
    label: "Fit",
    min: 14,
    max: 18,
    color: "#fde047",
    hint: "Lean and sustainable for many trained adults.",
  },
  {
    label: "Average",
    min: 18,
    max: 25,
    color: "#f59e0b",
    hint: "Common adult range. Consistent habits can still shift this quickly.",
  },
  {
    label: "High",
    min: 25,
    max: 32,
    color: "#f97316",
    hint: "Higher body fat. Trend tracking matters more than single check-ins.",
  },
  {
    label: "Very High",
    min: 32,
    max: 100,
    color: "#ef4444",
    hint: "Focus on sustainable routines and long-term consistency.",
  },
];

const FEMALE_BUCKETS: Bucket[] = [
  {
    label: "Essential",
    min: 0,
    max: 14,
    color: "#3b82f6",
    hint: "Extremely lean. Hormonal and recovery health should come first.",
  },
  {
    label: "Athletic",
    min: 14,
    max: 21,
    color: "#22c55e",
    hint: "Lean and performance-oriented with stronger visible definition.",
  },
  {
    label: "Fit",
    min: 21,
    max: 28,
    color: "#fde047",
    hint: "Balanced and sustainable range for many active adults.",
  },
  {
    label: "Average",
    min: 28,
    max: 35,
    color: "#f59e0b",
    hint: "Common adult range. Consistency is the key lever.",
  },
  {
    label: "High",
    min: 35,
    max: 42,
    color: "#f97316",
    hint: "Higher body fat. Use weekly or biweekly trends, not daily noise.",
  },
  {
    label: "Very High",
    min: 42,
    max: 100,
    color: "#ef4444",
    hint: "Prioritize stable habits and progressive improvements.",
  },
];

function getBuckets(sex: Sex) {
  return sex === "female" ? FEMALE_BUCKETS : MALE_BUCKETS;
}

function bucketFor(sex: Sex, bf: number) {
  const buckets = getBuckets(sex);
  return buckets.find((b) => bf >= b.min && bf < b.max) ?? buckets[buckets.length - 1];
}

function navyBodyFatPercent(params: {
  sex: Sex;
  heightIn: number;
  neckIn: number;
  waistIn: number;
  hipIn?: number;
}) {
  const { sex, heightIn, neckIn, waistIn, hipIn } = params;
  const log10 = (x: number) => Math.log(x) / Math.LN10;

  if (sex === "male") {
    const x = waistIn - neckIn;
    if (x <= 0 || heightIn <= 0) return null;
    return 86.01 * log10(x) - 70.041 * log10(heightIn) + 36.76;
  }

  const x = waistIn + (hipIn ?? 0) - neckIn;
  if (x <= 0 || heightIn <= 0) return null;
  return 163.205 * log10(x) - 97.684 * log10(heightIn) - 78.387;
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
  onChange: (v: number) => void;
  helper?: React.ReactNode;
}) {
  const { label, valueLabel, value, min, max, step = 1, onChange, helper } = props;

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

      {helper ? <div className="mt-2">{helper}</div> : null}
    </div>
  );
}

export default function BodyFatCalculator() {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");

  // Canonical units are inches/lbs.
  const [heightIn, setHeightIn] = useState<number>(69);
  const [neckIn, setNeckIn] = useState<number>(15);
  const [waistIn, setWaistIn] = useState<number>(34);
  const [hipIn, setHipIn] = useState<number>(38);
  const [weightLb, setWeightLb] = useState<number>(175);

  const heightFt = useMemo(() => Math.floor(heightIn / 12), [heightIn]);
  const heightRemIn = useMemo(() => heightIn % 12, [heightIn]);

  const result = useMemo(() => {
    const raw = navyBodyFatPercent({
      sex,
      heightIn,
      neckIn,
      waistIn,
      hipIn: sex === "female" ? hipIn : undefined,
    });

    if (raw === null || !Number.isFinite(raw)) {
      return {
        bf: null as number | null,
        error: "These measurements are not valid for the Navy formula. Make sure waist is larger than neck and all values are realistic.",
      };
    }

    return { bf: round(clamp(raw, 3, 60), 1), error: null as string | null };
  }, [sex, heightIn, neckIn, waistIn, hipIn]);

  const category = useMemo(() => {
    if (result.bf === null) return null;
    return bucketFor(sex, result.bf);
  }, [sex, result.bf]);

  const composition = useMemo(() => {
    if (result.bf === null) return null;

    const fatLb = (result.bf / 100) * weightLb;
    const leanLb = weightLb - fatLb;

    if (units === "metric") {
      return {
        weight: `${round(lbToKg(weightLb), 1)} kg`,
        fat: `${round(lbToKg(fatLb), 1)} kg`,
        lean: `${round(lbToKg(leanLb), 1)} kg`,
      };
    }

    return {
      weight: `${round(weightLb, 1)} lb`,
      fat: `${round(fatLb, 1)} lb`,
      lean: `${round(leanLb, 1)} lb`,
    };
  }, [result.bf, weightLb, units]);

  const displayHeight = units === "metric" ? `${Math.round(inToCm(heightIn))} cm` : `${heightFt} ft ${heightRemIn} in`;
  const displayNeck = units === "metric" ? `${round(inToCm(neckIn), 1)} cm` : `${round(neckIn, 1)} in`;
  const displayWaist = units === "metric" ? `${round(inToCm(waistIn), 1)} cm` : `${round(waistIn, 1)} in`;
  const displayHip = units === "metric" ? `${round(inToCm(hipIn), 1)} cm` : `${round(hipIn, 1)} in`;
  const displayWeight = units === "metric" ? `${Math.round(lbToKg(weightLb))} kg` : `${Math.round(weightLb)} lbs`;

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
                  label="Neck"
                  valueLabel={displayNeck}
                  value={neckIn}
                  min={10}
                  max={24}
                  step={0.1}
                  onChange={setNeckIn}
                />

                <SliderRow
                  label="Waist"
                  valueLabel={displayWaist}
                  value={waistIn}
                  min={22}
                  max={70}
                  step={0.1}
                  onChange={setWaistIn}
                  helper={<p className="text-gray-500">Measure at the same point each time for cleaner trend data.</p>}
                />

                {sex === "female" ? (
                  <SliderRow
                    label="Hips"
                    valueLabel={displayHip}
                    value={hipIn}
                    min={26}
                    max={80}
                    step={0.1}
                    onChange={setHipIn}
                    helper={<p className="text-gray-500">Use the widest point around hips/glutes.</p>}
                  />
                ) : null}

                <SliderRow
                  label="Weight (for fat/lean mass)"
                  valueLabel={displayWeight}
                  value={weightLb}
                  min={80}
                  max={420}
                  step={1}
                  onChange={setWeightLb}
                />
              </>
            ) : (
              <>
                <SliderRow
                  label="Height"
                  valueLabel={displayHeight}
                  value={round(inToCm(heightIn), 0)}
                  min={140}
                  max={214}
                  step={1}
                  onChange={(cm) => setHeightIn(cmToIn(cm))}
                />

                <SliderRow
                  label="Neck"
                  valueLabel={displayNeck}
                  value={round(inToCm(neckIn), 1)}
                  min={25}
                  max={61}
                  step={0.1}
                  onChange={(cm) => setNeckIn(cmToIn(cm))}
                />

                <SliderRow
                  label="Waist"
                  valueLabel={displayWaist}
                  value={round(inToCm(waistIn), 1)}
                  min={56}
                  max={178}
                  step={0.1}
                  onChange={(cm) => setWaistIn(cmToIn(cm))}
                  helper={<p className="text-gray-500">Measure at the same point each time for cleaner trend data.</p>}
                />

                {sex === "female" ? (
                  <SliderRow
                    label="Hips"
                    valueLabel={displayHip}
                    value={round(inToCm(hipIn), 1)}
                    min={66}
                    max={203}
                    step={0.1}
                    onChange={(cm) => setHipIn(cmToIn(cm))}
                    helper={<p className="text-gray-500">Use the widest point around hips/glutes.</p>}
                  />
                ) : null}

                <SliderRow
                  label="Weight (for fat/lean mass)"
                  valueLabel={displayWeight}
                  value={Math.round(lbToKg(weightLb))}
                  min={36}
                  max={190}
                  step={1}
                  onChange={(kg) => setWeightLb(kgToLb(kg))}
                />
              </>
            )}
          </div>

          <div className="p-8 bg-base-100 min-w-0">
            <div className="mt-7 flex items-center justify-center">
              <Gauge
                value={result.bf ?? 0}
                label="Body Fat %"
                rimColor={category?.color ?? "#94a3b8"}
              />
            </div>

            {result.error ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                {result.error}
              </div>
            ) : null}

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Estimated Body Fat</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{result.bf !== null ? `${result.bf}%` : "-"}</div>
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Category</div>
                <div className="mt-1 text-2xl font-bold" style={{ color: category?.color ?? "#111827" }}>
                  {category?.label ?? "-"}
                </div>
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Fat Mass</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{composition?.fat ?? "-"}</div>
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Lean Mass</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{composition?.lean ?? "-"}</div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-base-200/60 p-4">
              <div className="text-sm text-gray-600">Interpretation</div>
              <div
                className="mt-1 text-2xl font-bold"
                style={{ color: category?.color ?? "#111827" }}
              >
                {category?.label ?? "Enter measurements"}
              </div>
              <p className="mt-2 text-gray-700 leading-relaxed">
                {category?.hint ?? "Use stable measurement technique and track trends over time."}
              </p>
            </div>

            <p className="mt-4 text-md text-gray-500">
              Want a more accurate read?{" "}
              <a
                href="/estimate"
                className="inline-flex items-center gap-2 text-md font-semibold text-primary underline hover:underline"
              >
                Estimate Body Fat %
              </a>
            </p>
          </div>
        </div>

        <BodyFatInterpretationBar bf={result.bf ?? 0} sex={sex} />
      </div>
    </div>
  );
}
