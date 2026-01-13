// app/components/BMICalculator.tsx
"use client";

import { useMemo, useState } from "react";

type Unit = "metric" | "imperial";

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function lbsToKg(lbs: number) {
  return lbs * 0.45359237;
}

function inchesToM(inches: number) {
  return inches * 0.0254;
}

function feetInchesToInches(feet: number, inches: number) {
  return feet * 12 + inches;
}

function bmiCategory(bmi: number) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy weight";
  if (bmi < 30) return "Overweight";
  return "Obesity";
}

// Healthy BMI range is typically 18.5–24.9
function healthyWeightRangeKg(heightM: number) {
  const low = 18.5 * heightM * heightM;
  const high = 24.9 * heightM * heightM;
  return { low, high };
}

export default function BMICalculator() {
  const [unit, setUnit] = useState<Unit>("imperial"); // default imperial
  const [heightCm, setHeightCm] = useState<string>("175");
  const [weightKg, setWeightKg] = useState<string>("78");

  const [heightFt, setHeightFt] = useState<string>("5");
  const [heightIn, setHeightIn] = useState<string>("9");
  const [weightLb, setWeightLb] = useState<string>("172");

  const computed = useMemo(() => {
    const toNum = (v: string) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    let hM: number | null = null;
    let wKg: number | null = null;

    if (unit === "metric") {
      const h = toNum(heightCm);
      const w = toNum(weightKg);
      if (h == null || w == null) return null;
      if (h <= 0 || w <= 0) return null;

      hM = h / 100;
      wKg = w;
    } else {
      const ft = toNum(heightFt);
      const inch = toNum(heightIn);
      const w = toNum(weightLb);
      if (ft == null || inch == null || w == null) return null;
      if (ft < 0 || inch < 0 || w <= 0) return null;

      const totalIn = feetInchesToInches(ft, inch);
      if (totalIn <= 0) return null;

      hM = inchesToM(totalIn);
      wKg = lbsToKg(w);
    }

    const bmi = wKg / (hM * hM);
    if (!Number.isFinite(bmi)) return null;

    const bmiClamped = Math.max(10, Math.min(80, bmi));
    const bmiRounded = round1(bmiClamped);

    const category = bmiCategory(bmiRounded);
    const range = healthyWeightRangeKg(hM);
    const lowKg = range.low;
    const highKg = range.high;

    // Convert healthy weight range to current unit
    const low =
      unit === "metric" ? round1(lowKg) : round1(lowKg / 0.45359237);
    const high =
      unit === "metric" ? round1(highKg) : round1(highKg / 0.45359237);

    return {
      bmi: bmiRounded,
      category,
      healthyLow: low,
      healthyHigh: high,
      unitLabel: unit === "metric" ? "kg" : "lb",
    };
  }, [unit, heightCm, weightKg, heightFt, heightIn, weightLb]);

  return (
    <div className="w-full max-w-3xl rounded-2xl border bg-white p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Calculate your BMI
          </h2>
          <p className="text-sm text-gray-600">
            BMI uses height and weight only (it’s not a body fat % measurement).
          </p>
        </div>

        <div className="flex gap-2">
          <button
            className={`btn btn-sm ${
              unit === "metric" ? "btn-primary text-white" : "btn-ghost"
            }`}
            onClick={() => setUnit("metric")}
            type="button"
          >
            Metric
          </button>
          <button
            className={`btn btn-sm ${
              unit === "imperial" ? "btn-primary text-white" : "btn-ghost"
            }`}
            onClick={() => setUnit("imperial")}
            type="button"
          >
            Imperial
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {unit === "metric" ? (
          <>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Height (cm)</span>
              </div>
              <input
                className="input input-bordered"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 175"
              />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Weight (kg)</span>
              </div>
              <input
                className="input input-bordered"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 78"
              />
            </label>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Height (ft)</span>
                </div>
                <input
                  className="input input-bordered"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                  inputMode="numeric"
                  placeholder="5"
                />
              </label>

              <label className="form-control">
                <div className="label">
                  <span className="label-text">Height (in)</span>
                </div>
                <input
                  className="input input-bordered"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                  inputMode="numeric"
                  placeholder="9"
                />
              </label>
            </div>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Weight (lb)</span>
              </div>
              <input
                className="input input-bordered"
                value={weightLb}
                onChange={(e) => setWeightLb(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 172"
              />
            </label>
          </>
        )}
      </div>

      <div className="mt-6 rounded-xl bg-base-200 p-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-gray-600">Your BMI</p>
          <p className="text-3xl font-bold text-gray-900">
            {computed == null ? "—" : computed.bmi}
          </p>
          {computed != null && (
            <p className="mt-1 text-sm text-gray-700">
              Category: <span className="font-semibold">{computed.category}</span>
            </p>
          )}
          {computed != null && (
            <p className="mt-1 text-sm text-gray-600">
              Healthy weight range for your height:{" "}
              <span className="font-semibold">
                {computed.healthyLow}–{computed.healthyHigh} {computed.unitLabel}
              </span>
            </p>
          )}
        </div>

        <a href="/estimate" className="btn btn-primary text-white">
          Try photo estimate →
        </a>
      </div>
    </div>
  );
}
