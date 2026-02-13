"use client";

import React, { useEffect, useMemo, useState } from "react";
import VisceralFatInterpretationBar from "./visceral-fat-interpretation-bar";

type Units = "imperial" | "metric";
type Sex = "male" | "female";

type Props = {
  onChange?: (payload: { sex: Sex; vat: number }) => void;
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

const BUCKETS: Bucket[] = [
  {
    label: "Low",
    min: 0,
    max: 80,
    color: "#3b82f6",
    hint: "Lower estimated visceral fat area.",
  },
  {
    label: "Moderate",
    min: 80,
    max: 130,
    color: "#22c55e",
    hint: "Moderate visceral fat area.",
  },
  {
    label: "Visceral Obesity",
    min: 130,
    max: 170,
    color: "#fde047",
    hint: "At or above the commonly cited 130 cm2 threshold.",
  },
  {
    label: "High",
    min: 170,
    max: 220,
    color: "#f59e0b",
    hint: "High estimated visceral fat area.",
  },
  {
    label: "Very High",
    min: 220,
    max: 1000,
    color: "#ef4444",
    hint: "Very high estimated visceral fat area.",
  },
];

function bucketFor(vat: number) {
  return BUCKETS.find((b) => vat >= b.min && vat < b.max) ?? BUCKETS[BUCKETS.length - 1];
}

function computeVatCm2(params: {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  waistCm: number;
  thighCm: number;
}) {
  const { sex, age, heightCm, weightKg, waistCm, thighCm } = params;

  const hM = heightCm / 100;
  if (hM <= 0 || weightKg <= 0 || waistCm <= 0 || thighCm <= 0 || age <= 0) {
    return null;
  }

  const bmi = weightKg / (hM * hM);

  // Samouda et al. anthropometric VAT model (cm2)
  if (sex === "female") {
    return 2.15 * waistCm - 3.63 * thighCm + 1.46 * age + 6.22 * bmi - 92.713;
  }

  return 6 * waistCm - 4.41 * thighCm + 1.19 * age - 213.65;
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
  const pct = clamp((value - 0) / (300 - 0), 0, 1);
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
          <div className="text-5xl font-bold text-gray-900">{Math.round(value)}</div>
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

export default function VisceralFatCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");

  // Canonical body units: cm and kg
  const [age, setAge] = useState<number>(40);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(80);
  const [waistCm, setWaistCm] = useState<number>(92);
  const [thighCm, setThighCm] = useState<number>(56);

  const heightIn = useMemo(() => Math.round(cmToIn(heightCm)), [heightCm]);
  const heightFt = useMemo(() => Math.floor(heightIn / 12), [heightIn]);
  const heightRemIn = useMemo(() => heightIn % 12, [heightIn]);

  const vatRaw = useMemo(
    () => computeVatCm2({ sex, age, heightCm, weightKg, waistCm, thighCm }),
    [sex, age, heightCm, weightKg, waistCm, thighCm]
  );

  const vat = useMemo(() => (vatRaw == null ? null : round(clamp(vatRaw, 0, 500), 1)), [vatRaw]);

  useEffect(() => {
    if (vat != null) {
      onChange?.({ sex, vat });
    }
  }, [onChange, sex, vat]);

  const category = useMemo(() => {
    if (vat == null) return null;
    return bucketFor(vat);
  }, [vat]);

  const bmi = useMemo(() => {
    const hM = heightCm / 100;
    if (hM <= 0) return null;
    return weightKg / (hM * hM);
  }, [heightCm, weightKg]);

  const displayHeight = units === "metric" ? `${Math.round(heightCm)} cm` : `${heightFt} ft ${heightRemIn} in`;
  const displayWeight = units === "metric" ? `${Math.round(weightKg)} kg` : `${Math.round(kgToLb(weightKg))} lbs`;
  const displayWaist =
    units === "metric" ? `${Math.round(waistCm)} cm` : `${round(cmToIn(waistCm), 1).toFixed(1)} in`;
  const displayThigh =
    units === "metric" ? `${Math.round(thighCm)} cm` : `${round(cmToIn(thighCm), 1).toFixed(1)} in`;

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
              valueLabel={`${Math.round(age)}`}
              value={age}
              min={18}
              max={90}
              step={1}
              onChange={setAge}
            />

            {units === "imperial" ? (
              <>
                <SliderRow
                  label="Height"
                  valueLabel={displayHeight}
                  value={Math.round(cmToIn(heightCm))}
                  min={55}
                  max={84}
                  step={1}
                  onChange={(inches) => setHeightCm(inToCm(inches))}
                />

                <SliderRow
                  label="Weight"
                  valueLabel={displayWeight}
                  value={Math.round(kgToLb(weightKg))}
                  min={80}
                  max={420}
                  step={1}
                  onChange={(lb) => setWeightKg(lbToKg(lb))}
                />

                <SliderRow
                  label="Waist Circumference"
                  valueLabel={displayWaist}
                  value={round(cmToIn(waistCm), 1)}
                  min={22}
                  max={70}
                  step={0.1}
                  onChange={(inches) => setWaistCm(inToCm(inches))}
                />

                <SliderRow
                  label="Proximal Thigh Circumference"
                  valueLabel={displayThigh}
                  value={round(cmToIn(thighCm), 1)}
                  min={14}
                  max={40}
                  step={0.1}
                  onChange={(inches) => setThighCm(inToCm(inches))}
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
                />

                <SliderRow
                  label="Weight"
                  valueLabel={displayWeight}
                  value={Math.round(weightKg)}
                  min={36}
                  max={190}
                  step={1}
                  onChange={setWeightKg}
                />

                <SliderRow
                  label="Waist Circumference"
                  valueLabel={displayWaist}
                  value={Math.round(waistCm)}
                  min={56}
                  max={178}
                  step={1}
                  onChange={setWaistCm}
                />

                <SliderRow
                  label="Proximal Thigh Circumference"
                  valueLabel={displayThigh}
                  value={Math.round(thighCm)}
                  min={36}
                  max={102}
                  step={1}
                  onChange={setThighCm}
                />
              </>
            )}
          </div>

          <div className="bg-white border-l border-black/5 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              {vat != null && category != null ? (
                <>
                  <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Estimated Visceral Fat Area</p>
                  <div className="mt-2">
                    <Gauge value={vat} label="cm2 VAT" rimColor={category.color} />
                  </div>

                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                    {category.label}
                  </div>

                  <p className="mt-3 text-sm text-gray-600 max-w-[300px] leading-relaxed">{category.hint}</p>

                  <div className="mt-5 rounded-2xl bg-base-200/60 p-4 w-full max-w-[320px]">
                    <div className="text-sm text-gray-600">BMI (used in model)</div>
                    <div className="mt-1 text-xl font-semibold text-gray-900">
                      {bmi != null ? round(bmi, 1).toFixed(1) : "-"}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">Enter valid inputs to calculate visceral fat estimate.</p>
              )}
            </div>
          </div>
        </div>

        <VisceralFatInterpretationBar value={vat ?? 0} />
      </div>
    </div>
  );
}
