"use client";

import React, { useMemo, useState } from "react";
import BodyFatInterpretationBar from "../body-fat-calculator/body-fat-interpretation-bar";

type Sex = "male" | "female";
type Units = "imperial" | "metric";
type AgeBand = "17-20" | "21-27" | "28-39" | "40+";

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
    hint: "Extremely lean. Not a typical target for most people.",
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
    hint: "Common adult range. Consistency drives trend changes.",
  },
  {
    label: "High",
    min: 25,
    max: 32,
    color: "#f97316",
    hint: "Higher body fat. Weekly trends matter more than single checks.",
  },
  {
    label: "Very High",
    min: 32,
    max: 100,
    color: "#ef4444",
    hint: "Focus on sustainable progress and long-term habits.",
  },
];

const FEMALE_BUCKETS: Bucket[] = [
  {
    label: "Essential",
    min: 0,
    max: 14,
    color: "#3b82f6",
    hint: "Extremely lean. Recovery and hormonal health should come first.",
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
    hint: "Higher body fat. Focus on repeatable habits and trend direction.",
  },
  {
    label: "Very High",
    min: 42,
    max: 100,
    color: "#ef4444",
    hint: "Prioritize steady routines and realistic progression.",
  },
];

const ARMY_MAX_BF: Record<AgeBand, { male: number; female: number }> = {
  "17-20": { male: 20, female: 30 },
  "21-27": { male: 22, female: 32 },
  "28-39": { male: 24, female: 34 },
  "40+": { male: 26, female: 36 },
};

function getBuckets(sex: Sex) {
  return sex === "female" ? FEMALE_BUCKETS : MALE_BUCKETS;
}

function bucketFor(sex: Sex, bf: number) {
  const buckets = getBuckets(sex);
  return buckets.find((b) => bf >= b.min && bf < b.max) ?? buckets[buckets.length - 1];
}

/**
 * U.S. Army one-site circumference equations (abdomen/waist at navel + body weight).
 * Inputs are inches and pounds.
 */
function armyOneSiteBodyFatPercent(params: {
  sex: Sex;
  weightLb: number;
  abdomenIn: number;
}) {
  const { sex, weightLb, abdomenIn } = params;
  if (weightLb <= 0 || abdomenIn <= 0) return null;

  if (sex === "female") {
    return -9.15 - 0.015 * weightLb + 1.27 * abdomenIn;
  }

  return -26.97 - 0.12 * weightLb + 1.99 * abdomenIn;
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

export default function ArmyBodyFatCalculator() {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");
  const [ageBand, setAgeBand] = useState<AgeBand>("21-27");

  // Canonical units are inches and lbs.
  const [abdomenIn, setAbdomenIn] = useState<number>(34);
  const [weightLb, setWeightLb] = useState<number>(175);

  const result = useMemo(() => {
    const raw = armyOneSiteBodyFatPercent({ sex, weightLb, abdomenIn });

    if (raw === null || !Number.isFinite(raw)) {
      return {
        bf: null as number | null,
        error: "These inputs are not valid for the Army one-site equation.",
      };
    }

    return { bf: round(clamp(raw, 3, 60), 1), error: null as string | null };
  }, [sex, weightLb, abdomenIn]);

  const category = useMemo(() => {
    if (result.bf === null) return null;
    return bucketFor(sex, result.bf);
  }, [sex, result.bf]);

  const armyRounded = useMemo(() => {
    if (result.bf === null) return null;
    return Math.round(result.bf);
  }, [result.bf]);

  const maxAllowed = useMemo(() => {
    const row = ARMY_MAX_BF[ageBand];
    return sex === "female" ? row.female : row.male;
  }, [ageBand, sex]);

  const status = useMemo(() => {
    if (armyRounded === null) return null;
    return armyRounded <= maxAllowed ? "Within Standard" : "Over Standard";
  }, [armyRounded, maxAllowed]);

  const statusColor = status === "Within Standard" ? "#22c55e" : "#ef4444";

  const displayAbdomen = units === "metric" ? `${round(inToCm(abdomenIn), 1)} cm` : `${round(abdomenIn, 1)} in`;
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

            <div className="mt-5 flex items-center justify-between">
              <div className="font-semibold text-gray-900">Age Group (Army Standard)</div>
              <select
                className="select select-bordered"
                value={ageBand}
                onChange={(e) => setAgeBand(e.target.value as AgeBand)}
                aria-label="Select age band"
              >
                <option value="17-20">17-20</option>
                <option value="21-27">21-27</option>
                <option value="28-39">28-39</option>
                <option value="40+">40+</option>
              </select>
            </div>

            {units === "imperial" ? (
              <>
                <SliderRow
                  label="Abdomen / Waist (at navel)"
                  valueLabel={displayAbdomen}
                  value={abdomenIn}
                  min={25}
                  max={55}
                  step={0.1}
                  onChange={setAbdomenIn}
                  helper={<p className="text-gray-500">Measure at relaxed exhale, tape parallel to floor.</p>}
                />

                <SliderRow
                  label="Body Weight"
                  valueLabel={displayWeight}
                  value={weightLb}
                  min={90}
                  max={320}
                  step={1}
                  onChange={setWeightLb}
                  helper={<p className="text-gray-500">Army one-site formula uses weight and abdomen circumference.</p>}
                />
              </>
            ) : (
              <>
                <SliderRow
                  label="Abdomen / Waist (at navel)"
                  valueLabel={displayAbdomen}
                  value={round(inToCm(abdomenIn), 1)}
                  min={63}
                  max={140}
                  step={0.1}
                  onChange={(cm) => setAbdomenIn(cmToIn(cm))}
                  helper={<p className="text-gray-500">Measure at relaxed exhale, tape parallel to floor.</p>}
                />

                <SliderRow
                  label="Body Weight"
                  valueLabel={displayWeight}
                  value={Math.round(lbToKg(weightLb))}
                  min={41}
                  max={145}
                  step={1}
                  onChange={(kg) => setWeightLb(kgToLb(kg))}
                  helper={<p className="text-gray-500">Army one-site formula uses weight and abdomen circumference.</p>}
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
                <div className="text-sm text-gray-600">Army Rounded Result</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{armyRounded !== null ? `${armyRounded}%` : "-"}</div>
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Army Max (Age/Sex)</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{maxAllowed}%</div>
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Army Status</div>
                <div className="mt-1 text-xl font-semibold" style={{ color: status ? statusColor : "#111827" }}>
                  {status ?? "-"}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-base-200/60 p-4">
              <div className="text-sm text-gray-600">Interpretation</div>
              <div className="mt-1 text-2xl font-bold" style={{ color: category?.color ?? "#111827" }}>
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
