// app/components/tools/composition/ffmi-calculator/ffmi-calculator.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import FFMIInterpretationBar from "./ffmi-interpretation-bar";

type Units = "imperial" | "metric";
type Sex = "male" | "female";

type Props = {
  onChange?: (payload: { gender: Sex; normalizedFFMI: number }) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function round(n: number, d = 1) {
  const m = Math.pow(10, d);
  return Math.round(n * m) / m;
}

function lbToKg(lb: number) {
  return lb * 0.45359237;
}

function kgToLb(kg: number) {
  return kg / 0.45359237;
}

function cmToM(cm: number) {
  return cm / 100;
}

// ✅ Buckets + colors aligned to the bar gradient (used for gauge rim + category dot)
const FFMI_BUCKETS: Array<{
  label: string;
  min: number;
  max: number;
  color: string;
}> = [
  { label: "Below Average", min: 0, max: 18, color: "#ef4444" }, // red
  { label: "Average", min: 18, max: 20, color: "#f97316" }, // orange
  { label: "Above Average", min: 20, max: 22, color: "#fde047" }, // yellow
  { label: "Excellent", min: 22, max: 24, color: "#22c55e" }, // green
  { label: "Superior", min: 24, max: 26, color: "#10b981" }, // teal
  { label: "Suspicious", min: 26, max: 28, color: "#3b82f6" }, // blue
  { label: "Unlikely", min: 28, max: 100, color: "#7c3aed" }, // purple
];

function bucketFor(ffmi: number) {
  return (
    FFMI_BUCKETS.find((b) => ffmi >= b.min && ffmi < b.max) ?? FFMI_BUCKETS[0]
  );
}

/**
 * Formulas:
 * - fatMass = weight * (bf% / 100)
 * - leanMass = weight * (1 - bf%/100)
 * - ffmi = leanMassKg / heightM^2
 * - normalizedFFMI = ffmi + 6.3 * (1.8 - heightM)
 */
function computeFFMI(params: {
  units: Units;
  sex: Sex;
  heightCm: number; // stored as cm
  weightKg: number; // stored as kg
  bodyFatPct: number;
}) {
  const { heightCm, weightKg, bodyFatPct } = params;

  const hM = cmToM(heightCm);
  const bf = clamp(bodyFatPct, 0, 100) / 100;

  const fatMassKg = weightKg * bf;
  const leanMassKg = weightKg * (1 - bf);

  const ffmi = hM > 0 ? leanMassKg / (hM * hM) : 0;
  const normalized = ffmi + 6.3 * (1.8 - hM);

  return {
    heightM: hM,
    fatMassKg,
    leanMassKg,
    ffmi,
    normalizedFFMI: normalized,
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
  const pct = clamp((value - 10) / (30 - 10), 0, 1); // 10..30
  const deg = Math.round(pct * 280); // 280° arc

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
          <div className="text-5xl font-bold text-gray-900">
            {round(value, 1)}
          </div>
          <div className="text-sm font-semibold text-gray-700">{label}</div>
        </div>
      </div>
    </div>
  );
}

function SliderRow(props: {
  label: string;
  valueLabel: string;
  minLabel: string;
  maxLabel: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  helper?: React.ReactNode;
}) {
  const {
    label,
    valueLabel,
    minLabel,
    maxLabel,
    value,
    min,
    max,
    step = 1,
    onChange,
    helper,
  } = props;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-gray-900">{label}</div>
      </div>

      <div className="mt-2 flex items-end justify-between gap-4">
        <div className="text-3xl font-semibold text-gray-900 whitespace-nowrap">
          {valueLabel}
        </div>
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

      <div className="mt-1 flex justify-between text-xs text-gray-500">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>

      {helper ? <div className="mt-2">{helper}</div> : null}
    </div>
  );
}

export default function FFMICalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");

  // canonical values
  const [heightCm, setHeightCm] = useState<number>(183);
  const [weightKg, setWeightKg] = useState<number>(83);
  const [bodyFatPct, setBodyFatPct] = useState<number>(12.5);

  // Imperial UI (single slider = total inches)
  const heightInchesUI = useMemo(() => Math.round(heightCm / 2.54), [heightCm]);
  const heightFtUI = useMemo(() => Math.floor(heightInchesUI / 12), [heightInchesUI]);
  const heightInUI = useMemo(() => heightInchesUI % 12, [heightInchesUI]);

  const weightLbUI = useMemo(() => Math.round(kgToLb(weightKg)), [weightKg]);

  const stats = useMemo(() => {
    return computeFFMI({ units, sex, heightCm, weightKg, bodyFatPct });
  }, [units, sex, heightCm, weightKg, bodyFatPct]);

  // ✅ report upward
  useEffect(() => {
    onChange?.({ gender: sex, normalizedFFMI: stats.normalizedFFMI });
  }, [onChange, sex, stats.normalizedFFMI]);

  const leanKg = stats.leanMassKg;
  const fatKg = stats.fatMassKg;

  const leanDisplay =
    units === "metric"
      ? `${round(leanKg, 1)} kg`
      : `${round(kgToLb(leanKg), 1)} lbs`;

  const fatMassDisplay =
    units === "metric"
      ? `${round(fatKg, 1)} kg`
      : `${round(kgToLb(fatKg), 1)} lbs`;

  const category = bucketFor(stats.normalizedFFMI);
  const rimColor = category.color;

  return (
    // ✅ Lock the overall feel to a stable width (so it won’t “get narrower” depending on wrapper)
    <div className="w-full max-w-5xl mx-auto">
      <div className="rounded-3xl bg-white/80 backdrop-blur border shadow-xl overflow-hidden">
        {/* ✅ Keep proportions stable:
            - Inputs: flexible column
            - Results: fixed 420px
        */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px]">
          {/* Inputs */}
          <div className="p-8 bg-white min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-semibold ${
                    units === "imperial" ? "text-primary" : "text-gray-500"
                  }`}
                >
                  Imperial
                </span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={units === "metric"}
                  onChange={(e) => setUnits(e.target.checked ? "metric" : "imperial")}
                  aria-label="Toggle imperial/metric"
                />
                <span
                  className={`text-sm font-semibold ${
                    units === "metric" ? "text-primary" : "text-gray-500"
                  }`}
                >
                  Metric
                </span>
              </div>
            </div>

            {/* Sex on input side */}
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
                  valueLabel={`${heightFtUI} ft ${heightInUI} in`}
                  minLabel=""
                  maxLabel=""
                  value={heightInchesUI}
                  min={36}
                  max={90}
                  step={1}
                  onChange={(inches) => setHeightCm(round(inches * 2.54, 0))}
                />

                <SliderRow
                  label="Weight"
                  valueLabel={`${weightLbUI} lbs`}
                  minLabel=""
                  maxLabel=""
                  value={weightLbUI}
                  min={65}
                  max={380}
                  step={1}
                  onChange={(lb) => setWeightKg(lbToKg(lb))}
                />

                <SliderRow
                  label="Body Fat Percentage"
                  valueLabel={`${round(bodyFatPct, 1)}%`}
                  minLabel=""
                  maxLabel=""
                  value={bodyFatPct}
                  min={0}
                  max={50}
                  step={0.1}
                  onChange={setBodyFatPct}
                  helper={
                    <p className="text-gray-500">Don’t know?{" "}
                    <a
                      href="/estimate"
                      className="inline-flex items-center gap-2 text-md font-semibold text-primary underline hover:underline"
                    >
                      {" "}Estimate Body Fat %
                    </a>
                    </p>
                  }
                />
              </>
            ) : (
              <>
                <SliderRow
                  label="Height"
                  valueLabel={`${Math.round(heightCm)} cm`}
                  minLabel=""
                  maxLabel=""
                  value={heightCm}
                  min={120}
                  max={225}
                  step={1}
                  onChange={setHeightCm}
                />

                <SliderRow
                  label="Weight"
                  valueLabel={`${Math.round(weightKg)} kg`}
                  minLabel=""
                  maxLabel=""
                  value={weightKg}
                  min={30}
                  max={160}
                  step={1}
                  onChange={setWeightKg}
                />

                <SliderRow
                  label="Body Fat Percentage"
                  valueLabel={`${round(bodyFatPct, 1)}%`}
                  minLabel=""
                  maxLabel=""
                  value={bodyFatPct}
                  min={0}
                  max={50}
                  step={0.1}
                  onChange={setBodyFatPct}
                  helper={
                     <p className="text-gray-500">Don’t know?{" "}
                    <a
                      href="/estimate"
                      className="inline-flex items-center gap-2 text-md font-semibold text-primary underline hover:underline"
                    >
                      {" "}Estimate Body Fat %
                    </a>
                    </p>
                     
                  }
                />
              </>
            )}
          </div>

          {/* Results */}
          <div className="p-8 bg-base-100 min-w-0">
            <div className="mt-7 flex items-center justify-center">
              <Gauge value={stats.normalizedFFMI} label="FFMI" rimColor={rimColor} />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Fat Free Mass</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">
                  {leanDisplay}
                </div>
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Fat Mass</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">
                  {fatMassDisplay}
                </div>
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">FFMI</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">
                  {round(stats.ffmi, 2)}
                </div>
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Normalized FFMI</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">
                  {round(stats.normalizedFFMI, 2)}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-base-200/60 p-4">
              <div className="text-sm text-gray-600">Category</div>
              <div className="mt-1 text-2xl font-bold" style={{ color: category.color }}>
                {category.label}
              </div>
            </div>
          </div>
        </div>

        <FFMIInterpretationBar ffmi={stats.normalizedFFMI} />
      </div>
    </div>
  );
}
