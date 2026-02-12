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
 * US Army "one-site" body fat equations (abdomen circumference + body weight)
 * Works in inches + pounds.
 *
 * Female BF% = -9.15 - (0.015 * weight_lb) + (1.27 * abdomen_in)
 * Male   BF% = -26.97 - (0.12  * weight_lb) + (1.99 * abdomen_in)
 */
function armyBodyFatPercent({
  sex,
  weightLb,
  abdomenIn,
}: {
  sex: Sex;
  weightLb: number;
  abdomenIn: number;
}) {
  if (weightLb <= 0 || abdomenIn <= 0) return null;

  if (sex === "female") {
    return -9.15 - 0.015 * weightLb + 1.27 * abdomenIn;
  }
  return -26.97 - 0.12 * weightLb + 1.99 * abdomenIn;
}

function getLabel(sex: Sex, bf: number) {
  // Non-medical, appearance-oriented buckets (same style as your current calc)
  const t =
    sex === "female"
      ? { athleticMax: 20, fitMax: 27, averageMax: 34, highMax: 42 }
      : { athleticMax: 13, fitMax: 18, averageMax: 25, highMax: 32 };

  if (bf <= t.athleticMax)
    return { label: "Athletic", hint: "Leaner look with clearer definition for many people." };
  if (bf <= t.fitMax)
    return { label: "Fit", hint: "Generally lean with some definition. Often very livable." };
  if (bf <= t.averageMax)
    return { label: "Average", hint: "Normal softness and limited definition at rest. Very common." };
  if (bf <= t.highMax)
    return { label: "Higher body fat", hint: "More visible softness (often midsection/hips). Progress shows fast." };
  return { label: "Very high body fat", hint: "Higher overall softness. Focus on sustainable trend tracking." };
}

export default function ArmyBodyFatCalculator() {
  const [sex, setSex] = useState<Sex>("male");
  const [unit, setUnit] = useState<Unit>("metric");

  // Inputs as strings for UX
  const [abdomen, setAbdomen] = useState<string>(unit === "metric" ? "85" : "34");
  const [weight, setWeight] = useState<string>(unit === "metric" ? "78" : "172");

  const parsed = useMemo(() => {
    const a = Number(abdomen);
    const w = Number(weight);

    if (!Number.isFinite(a) || !Number.isFinite(w)) return { ok: false as const };

    if (unit === "metric") {
      return {
        ok: true as const,
        abdomenIn: cmToIn(a),
        weightLb: kgToLb(w),
        abdomenLabel: "cm",
        weightLabel: "kg",
      };
    }

    return {
      ok: true as const,
      abdomenIn: a,
      weightLb: w,
      abdomenLabel: "in",
      weightLabel: "lb",
    };
  }, [abdomen, weight, unit]);

  const result = useMemo(() => {
    if (!parsed.ok) return { bf: null as number | null, error: null as string | null };

    const bf = armyBodyFatPercent({
      sex,
      weightLb: parsed.weightLb,
      abdomenIn: parsed.abdomenIn,
    });

    if (bf === null || !Number.isFinite(bf)) {
      return {
        bf: null,
        error: "Those inputs don’t produce a valid result. Double-check units and values.",
      };
    }

    // clamp for sane display; the equation can output odd values if inputs are extreme
    return { bf: round1(clamp(bf, 2, 65)), error: null };
  }, [parsed, sex]);

  const label = useMemo(() => {
    if (result.bf === null) return null;
    return getLabel(sex, result.bf);
  }, [result.bf, sex]);

  const placeholders = useMemo(() => {
    return unit === "metric"
      ? { abdomen: "cm", weight: "kg" }
      : { abdomen: "in", weight: "lb" };
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
              <span className="label-text font-semibold">
                Abdomen circumference ({placeholders.abdomen})
              </span>
            </div>
            <input
              inputMode="decimal"
              className="input input-bordered"
              value={abdomen}
              onChange={(e) => setAbdomen(e.target.value)}
              placeholder={unit === "metric" ? "e.g. 85" : "e.g. 34"}
            />
            <div className="label">
              <span className="label-text-alt text-gray-500">
                Measure around the abdomen at the level of the navel, relaxed posture.
              </span>
            </div>
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text font-semibold">
                Body weight ({placeholders.weight})
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
                Weight is required for the Army equation.
              </span>
            </div>
          </label>
        </div>

        <div className="mt-6 rounded-2xl border bg-white p-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            This calculator uses the <strong>Army one-site</strong> method (abdomen + body weight).
            For best tracking, measure under the same conditions each time.
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

        <div className="mt-6 rounded-2xl border bg-base-100 p-5">
          <p className="text-gray-900 font-semibold text-lg">
            Want a visual estimate that matches appearance?
          </p>
          <p className="mt-2 text-gray-700 text-lg leading-relaxed">
            Tape formulas infer body fat from measurements. Photo-based estimation infers body fat from
            <strong> visible body composition cues</strong>.
          </p>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <a href="/estimate" className="btn btn-primary btn-lg text-white">
              Estimate from a photo →
            </a>
            <a href="/guides/body-fat-calculator-vs-estimator" className="btn btn-ghost btn-lg">
              Calculator vs estimator
            </a>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500 leading-relaxed">
          Not medical advice. These are estimates. For clinical precision, consider a lab method.
        </p>
      </div>
    </div>
  );
}
