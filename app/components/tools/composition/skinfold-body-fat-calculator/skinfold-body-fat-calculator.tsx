"use client";

import React, { useEffect, useMemo, useState } from "react";
import SkinfoldInterpretationBar from "./skinfold-interpretation-bar";
import { findSkinfoldRange, type Sex } from "./skinfold-ranges";

type Units = "imperial" | "metric";
type SiteKey = "chest" | "abdomen" | "thigh" | "triceps" | "suprailiac";

type SiteConfig = {
  key: SiteKey;
  label: string;
  helper: string;
  min: number;
  max: number;
};

type Props = {
  onChange?: (payload: { sex: Sex; bodyFatPct: number; sum3: number }) => void;
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

const MALE_SITES: SiteConfig[] = [
  {
    key: "chest",
    label: "Chest (Pectoral)",
    helper: "Diagonal fold midway between armpit and nipple.",
    min: 2,
    max: 70,
  },
  {
    key: "abdomen",
    label: "Abdomen",
    helper: "Vertical fold about 2 cm right of the navel.",
    min: 2,
    max: 80,
  },
  {
    key: "thigh",
    label: "Thigh",
    helper: "Vertical fold on the front mid-thigh.",
    min: 2,
    max: 90,
  },
];

const FEMALE_SITES: SiteConfig[] = [
  {
    key: "triceps",
    label: "Triceps",
    helper: "Vertical fold on the back of the upper arm midpoint.",
    min: 2,
    max: 70,
  },
  {
    key: "suprailiac",
    label: "Suprailiac",
    helper: "Diagonal fold just above the iliac crest.",
    min: 2,
    max: 70,
  },
  {
    key: "thigh",
    label: "Thigh",
    helper: "Vertical fold on the front mid-thigh.",
    min: 2,
    max: 90,
  },
];

function getSites(sex: Sex) {
  return sex === "female" ? FEMALE_SITES : MALE_SITES;
}

function bodyDensityJacksonPollock3Site(params: {
  sex: Sex;
  age: number;
  sum3Mm: number;
}) {
  const { sex, age, sum3Mm } = params;

  if (sex === "female") {
    return 1.0994921 - 0.0009929 * sum3Mm + 0.0000023 * sum3Mm * sum3Mm - 0.0001392 * age;
  }

  return 1.10938 - 0.0008267 * sum3Mm + 0.0000016 * sum3Mm * sum3Mm - 0.0002574 * age;
}

function bodyFatFromDensitySiri(bodyDensity: number) {
  return 495 / bodyDensity - 450;
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

export default function SkinfoldBodyFatCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");

  const [age, setAge] = useState<number>(30);
  const [weightKg, setWeightKg] = useState<number>(82);

  const [siteValues, setSiteValues] = useState<Record<SiteKey, number>>({
    chest: 12,
    abdomen: 18,
    thigh: 18,
    triceps: 16,
    suprailiac: 14,
  });

  const activeSites = useMemo(() => getSites(sex), [sex]);

  const sum3 = useMemo(
    () => activeSites.reduce((sum, site) => sum + siteValues[site.key], 0),
    [activeSites, siteValues]
  );

  const result = useMemo(() => {
    const densityRaw = bodyDensityJacksonPollock3Site({ sex, age, sum3Mm: sum3 });

    if (!Number.isFinite(densityRaw) || densityRaw <= 0) {
      return {
        bodyDensity: null as number | null,
        bodyFatPct: null as number | null,
      };
    }

    const bodyFatRaw = bodyFatFromDensitySiri(densityRaw);

    return {
      bodyDensity: round(densityRaw, 4),
      bodyFatPct: round(clamp(bodyFatRaw, 3, 60), 1),
    };
  }, [sex, age, sum3]);

  useEffect(() => {
    if (result.bodyFatPct != null) {
      onChange?.({ sex, bodyFatPct: result.bodyFatPct, sum3 });
    }
  }, [onChange, sex, result.bodyFatPct, sum3]);

  const category = useMemo(() => {
    if (result.bodyFatPct == null) return null;
    return findSkinfoldRange(sex, result.bodyFatPct);
  }, [sex, result.bodyFatPct]);

  const fatMassKg = useMemo(() => {
    if (result.bodyFatPct == null) return null;
    return (result.bodyFatPct / 100) * weightKg;
  }, [result.bodyFatPct, weightKg]);

  const leanMassKg = useMemo(() => {
    if (fatMassKg == null) return null;
    return weightKg - fatMassKg;
  }, [fatMassKg, weightKg]);

  const displayWeight =
    units === "metric" ? `${Math.round(weightKg)} kg` : `${Math.round(kgToLb(weightKg))} lbs`;

  const displayFatMass =
    fatMassKg == null
      ? "-"
      : units === "metric"
      ? `${round(fatMassKg, 1)} kg`
      : `${round(kgToLb(fatMassKg), 1)} lbs`;

  const displayLeanMass =
    leanMassKg == null
      ? "-"
      : units === "metric"
      ? `${round(leanMassKg, 1)} kg`
      : `${round(kgToLb(leanMassKg), 1)} lbs`;

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
              min={18}
              max={80}
              step={1}
              onChange={setAge}
            />

            {units === "imperial" ? (
              <SliderRow
                label="Weight"
                valueLabel={displayWeight}
                value={Math.round(kgToLb(weightKg))}
                min={80}
                max={420}
                step={1}
                onChange={(lb) => setWeightKg(lbToKg(lb))}
              />
            ) : (
              <SliderRow
                label="Weight"
                valueLabel={displayWeight}
                value={Math.round(weightKg)}
                min={36}
                max={190}
                step={1}
                onChange={setWeightKg}
              />
            )}

            {activeSites.map((site) => (
              <SliderRow
                key={site.key}
                label={site.label}
                valueLabel={`${round(siteValues[site.key], 1)} mm`}
                value={siteValues[site.key]}
                min={site.min}
                max={site.max}
                step={0.5}
                helper={site.helper}
                onChange={(value) => {
                  setSiteValues((prev) => ({ ...prev, [site.key]: value }));
                }}
              />
            ))}
          </div>

          <div className="bg-white border-l border-black/5 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              {result.bodyFatPct != null && category != null ? (
                <>
                  <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Skinfold Body Fat</p>
                  <div className="mt-2">
                    <Gauge value={result.bodyFatPct} label="% BF" rimColor={category.color} />
                  </div>

                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                    {category.label}
                  </div>

                  <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

                  <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                    <div className="rounded-xl bg-base-200/60 p-3">
                      <div className="text-xs text-gray-600">Body Fat %</div>
                      <div className="text-lg font-semibold text-gray-900">{result.bodyFatPct.toFixed(1)}%</div>
                    </div>
                    <div className="rounded-xl bg-base-200/60 p-3">
                      <div className="text-xs text-gray-600">Sum of 3 Sites</div>
                      <div className="text-lg font-semibold text-gray-900">{round(sum3, 1)} mm</div>
                    </div>
                    <div className="rounded-xl bg-base-200/60 p-3">
                      <div className="text-xs text-gray-600">Fat Mass</div>
                      <div className="text-lg font-semibold text-gray-900">{displayFatMass}</div>
                    </div>
                    <div className="rounded-xl bg-base-200/60 p-3">
                      <div className="text-xs text-gray-600">Lean Mass</div>
                      <div className="text-lg font-semibold text-gray-900">{displayLeanMass}</div>
                    </div>
                  </div>

                  <div className="mt-4 w-full rounded-xl bg-base-200/60 p-3 text-left">
                    <div className="text-xs text-gray-600">Body Density (g/cm^3)</div>
                    <div className="text-lg font-semibold text-gray-900">{result.bodyDensity?.toFixed(4)}</div>
                  </div>

                  <div className="mt-3 w-full rounded-xl border p-3 text-left">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Method</div>
                    <div className="mt-1 text-sm text-gray-700">Jackson-Pollock 3-site + Siri equation</div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">Enter valid skinfold measurements to calculate body fat.</p>
              )}
            </div>
          </div>
        </div>

        <SkinfoldInterpretationBar bodyFatPct={result.bodyFatPct ?? 0} sex={sex} />
      </div>
    </div>
  );
}
