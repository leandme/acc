"use client";

import React, { useMemo, useState } from "react";

type Sex = "male" | "female";
type Unit = "metric" | "imperial";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function cmToIn(cm: number) {
  return cm / 2.54;
}

function kgToLb(kg: number) {
  return kg * 2.2046226218;
}

/**
 * US Navy body fat formula (uses log10)
 * Works in inches.
 * Male: 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
 * Female: 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
 */
function navyBodyFatPercent({
  sex,
  heightIn,
  neckIn,
  waistIn,
  hipIn,
}: {
  sex: Sex;
  heightIn: number;
  neckIn: number;
  waistIn: number;
  hipIn?: number;
}) {
  const log10 = (x: number) => Math.log(x) / Math.LN10;

  if (sex === "male") {
    const x = waistIn - neckIn;
    if (x <= 0 || heightIn <= 0) return null;
    const bf = 86.010 * log10(x) - 70.041 * log10(heightIn) + 36.76;
    return bf;
  }

  // female
  const hip = hipIn ?? 0;
  const x = waistIn + hip - neckIn;
  if (x <= 0 || heightIn <= 0) return null;
  const bf = 163.205 * log10(x) - 97.684 * log10(heightIn) - 78.387;
  return bf;
}

function getLabel(sex: Sex, bf: number) {
  // Non-medical, appearance-oriented buckets (tweak later if you want)
  const t =
    sex === "female"
      ? { athleticMax: 20, fitMax: 27, averageMax: 34, highMax: 42 }
      : { athleticMax: 13, fitMax: 18, averageMax: 25, highMax: 32 };

  if (bf <= t.athleticMax)
    return {
      label: "Athletic",
      hint: "Leaner look with clearer definition. Often requires consistent training and diet.",
    };
  if (bf <= t.fitMax)
    return {
      label: "Fit",
      hint: "Generally lean with some definition. A common “lean but livable” range.",
    };
  if (bf <= t.averageMax)
    return {
      label: "Average",
      hint: "Normal softness and limited definition at rest. Very common.",
    };
  if (bf <= t.highMax)
    return {
      label: "Higher body fat",
      hint: "More visible softness (often midsection/hips). Small changes show up clearly.",
    };
  return {
    label: "Very high body fat",
    hint: "Higher overall softness. Track trends over time rather than obsessing over a single reading.",
  };
}

export default function BodyFatCalculator() {
  const [sex, setSex] = useState<Sex>("male");
  const [unit, setUnit] = useState<Unit>("metric");

  // Inputs (stored as strings for better UX)
  const [height, setHeight] = useState<string>("175");
  const [neck, setNeck] = useState<string>("38");
  const [waist, setWaist] = useState<string>("85");
  const [hip, setHip] = useState<string>("95");
  const [weight, setWeight] = useState<string>(""); // optional

  const parsed = useMemo(() => {
    const h = Number(height);
    const n = Number(neck);
    const w = Number(waist);
    const hp = Number(hip);
    const wt = weight.trim() ? Number(weight) : null;

    const validNums =
      Number.isFinite(h) && Number.isFinite(n) && Number.isFinite(w) && (sex === "male" || Number.isFinite(hp));

    if (!validNums) return { ok: false as const };

    if (unit === "metric") {
      return {
        ok: true as const,
        heightIn: cmToIn(h),
        neckIn: cmToIn(n),
        waistIn: cmToIn(w),
        hipIn: sex === "female" ? cmToIn(hp) : undefined,
        weightLb: wt !== null ? kgToLb(wt) : null,
      };
    }

    // imperial
    return {
      ok: true as const,
      heightIn: h,
      neckIn: n,
      waistIn: w,
      hipIn: sex === "female" ? hp : undefined,
      weightLb: wt,
    };
  }, [height, neck, waist, hip, weight, sex, unit]);

  const result = useMemo(() => {
    if (!parsed.ok) return { bf: null as number | null, error: null as string | null };

    const bf = navyBodyFatPercent({
      sex,
      heightIn: parsed.heightIn,
      neckIn: parsed.neckIn,
      waistIn: parsed.waistIn,
      hipIn: parsed.hipIn,
    });

    if (bf === null || !Number.isFinite(bf)) {
      return {
        bf: null,
        error:
          "Those measurements don’t work with the Navy formula. Double-check units and make sure waist is larger than neck.",
      };
    }

    const clamped = clamp(bf, 3, 60);
    return { bf: round1(clamped), error: null };
  }, [parsed, sex]);

  const composition = useMemo(() => {
    if (!parsed.ok) return null;
    if (result.bf === null) return null;
    if (parsed.weightLb === null || !Number.isFinite(parsed.weightLb)) return null;

    const wtLb = parsed.weightLb;
    const fatLb = (result.bf / 100) * wtLb;
    const leanLb = wtLb - fatLb;

    // Display in current unit
    if (unit === "metric") {
      const wtKg = wtLb / 2.2046226218;
      const fatKg = fatLb / 2.2046226218;
      const leanKg = leanLb / 2.2046226218;
      return {
        weight: round1(wtKg),
        fat: round1(fatKg),
        lean: round1(leanKg),
        unitLabel: "kg",
      };
    }

    return {
      weight: round1(wtLb),
      fat: round1(fatLb),
      lean: round1(leanLb),
      unitLabel: "lb",
    };
  }, [parsed, result.bf, unit]);

  const label = useMemo(() => {
    if (result.bf === null) return null;
    return getLabel(sex, result.bf);
  }, [result.bf, sex]);

  const placeholders = useMemo(() => {
    // Helps user understand what units we expect without reading
    if (unit === "metric") {
      return { height: "cm", neck: "cm", waist: "cm", hip: "cm", weight: "kg" };
    }
    return { height: "in", neck: "in", waist: "in", hip: "in", weight: "lb" };
  }, [unit]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: inputs */}
      <div className="rounded-2xl border bg-base-100 p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">Sex:</span>
            <div className="join">
              <button
                type="button"
                className={`btn btn-sm join-item ${sex === "male" ? "btn-primary text-white" : "btn-ghost"}`}
                onClick={() => setSex("male")}
              >
                Male
              </button>
              <button
                type="button"
                className={`btn btn-sm join-item ${sex === "female" ? "btn-primary text-white" : "btn-ghost"}`}
                onClick={() => setSex("female")}
              >
                Female
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">Units:</span>
            <div className="join">
              <button
                type="button"
                className={`btn btn-sm join-item ${unit === "metric" ? "btn-primary text-white" : "btn-ghost"}`}
                onClick={() => setUnit("metric")}
              >
                Metric
              </button>
              <button
                type="button"
                className={`btn btn-sm join-item ${unit === "imperial" ? "btn-primary text-white" : "btn-ghost"}`}
                onClick={() => setUnit("imperial")}
              >
                Imperial
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <label className="form-control">
            <div className="label">
              <span className="label-text font-semibold">Height ({placeholders.height})</span>
            </div>
            <input
              inputMode="decimal"
              className="input input-bordered"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={unit === "metric" ? "e.g. 175" : "e.g. 69"}
            />
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text font-semibold">Neck ({placeholders.neck})</span>
            </div>
            <input
              inputMode="decimal"
              className="input input-bordered"
              value={neck}
              onChange={(e) => setNeck(e.target.value)}
              placeholder={unit === "metric" ? "e.g. 38" : "e.g. 15"}
            />
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text font-semibold">Waist ({placeholders.waist})</span>
            </div>
            <input
              inputMode="decimal"
              className="input input-bordered"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              placeholder={unit === "metric" ? "e.g. 85" : "e.g. 34"}
            />
            <div className="label">
              <span className="label-text-alt text-gray-500">
                Tip: measure at the same spot each time (commonly at the navel).
              </span>
            </div>
          </label>

          {sex === "female" && (
            <label className="form-control">
              <div className="label">
                <span className="label-text font-semibold">Hips ({placeholders.hip})</span>
              </div>
              <input
                inputMode="decimal"
                className="input input-bordered"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                placeholder={unit === "metric" ? "e.g. 95" : "e.g. 38"}
              />
              <div className="label">
                <span className="label-text-alt text-gray-500">
                  Measure at the widest point around hips/glutes.
                </span>
              </div>
            </label>
          )}

          <label className="form-control">
            <div className="label">
              <span className="label-text font-semibold">
                Weight (optional) ({placeholders.weight})
              </span>
            </div>
            <input
              inputMode="decimal"
              className="input input-bordered"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === "metric" ? "e.g. 78" : "e.g. 172"}
            />
            <div className="label">
              <span className="label-text-alt text-gray-500">
                Adds fat mass + lean mass estimates (still approximate).
              </span>
            </div>
          </label>
        </div>

        <div className="mt-6 rounded-2xl border bg-white p-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            This calculator uses the <strong>Navy tape method</strong>. It’s most useful when you
            measure consistently and track change over time.
          </p>
        </div>
      </div>

      {/* Right: results */}
      <div className="rounded-2xl border bg-white p-5 md:p-6">
        <h3 className="text-xl font-semibold text-gray-900">Your result</h3>

        {result.error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-red-700 font-semibold">Check your inputs</p>
            <p className="mt-1 text-red-700">{result.error}</p>
          </div>
        )}

        <div className="mt-5 rounded-2xl border bg-base-100 p-5">
          <p className="text-sm text-gray-600">Estimated body fat</p>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 tabular-nums">
            {result.bf !== null ? `${result.bf}%` : "—"}
          </p>

          <div className="mt-4">
            <p className="text-sm text-gray-600">Interpretation</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {label ? label.label : "Enter measurements to see your category"}
            </p>
            <p className="mt-1 text-gray-700 text-lg leading-relaxed">
              {label ? label.hint : "Use consistent measurement spots and conditions for best trend tracking."}
            </p>
          </div>
        </div>

        {composition && (
          <div className="mt-6 rounded-2xl border bg-white p-5">
            <p className="text-lg font-semibold text-gray-900">Estimated composition (from your weight)</p>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border bg-base-100 p-4">
                <p className="text-xs text-gray-600">Weight</p>
                <p className="mt-1 font-bold text-gray-900 tabular-nums">
                  {composition.weight} {composition.unitLabel}
                </p>
              </div>
              <div className="rounded-2xl border bg-base-100 p-4">
                <p className="text-xs text-gray-600">Fat mass</p>
                <p className="mt-1 font-bold text-gray-900 tabular-nums">
                  {composition.fat} {composition.unitLabel}
                </p>
              </div>
              <div className="rounded-2xl border bg-base-100 p-4">
                <p className="text-xs text-gray-600">Lean mass</p>
                <p className="mt-1 font-bold text-gray-900 tabular-nums">
                  {composition.lean} {composition.unitLabel}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              These numbers are approximate because they depend on the body fat estimate.
            </p>
          </div>
        )}

        <div className="mt-6 rounded-2xl border bg-base-100 p-5">
          <p className="text-gray-900 font-semibold text-lg">
            Want something that matches appearance better?
          </p>
          <p className="mt-2 text-gray-700 text-lg leading-relaxed">
            Tape formulas infer body fat from measurements. Photo-based estimation infers body fat from
            <strong> visible body composition cues</strong>.
          </p>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <a
              href="/estimate"
              className="btn btn-primary btn-lg text-white"
            >
              Estimate from a photo →
            </a>
            <a
              href="/guides/body-fat-calculator-vs-estimator"
              className="btn btn-ghost btn-lg"
            >
              Calculator vs estimator
            </a>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500 leading-relaxed">
          Not medical advice. If you need clinical precision, consider a DEXA scan.
        </p>
      </div>
    </div>
  );
}
