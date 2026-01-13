"use client";

import { useMemo, useState } from "react";

type Unit = "metric" | "imperial";

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function inchesToCm(inches: number) {
  return inches * 2.54;
}

function feetInchesToInches(feet: number, inches: number) {
  return feet * 12 + inches;
}

function poundsToKg(lb: number) {
  return lb * 0.45359237;
}

// FFMI = LBM(kg) / (height(m)^2)
// LBM = weight * (1 - bodyFat)
// Normalized FFMI (Kouri) = FFMI + 6.1*(1.8 - height(m))
function computeFFMI({
  weightKg,
  heightCm,
  bodyFatPercent,
}: {
  weightKg: number;
  heightCm: number;
  bodyFatPercent: number;
}) {
  const heightM = heightCm / 100;
  if (heightM <= 0) return null;

  const bf = bodyFatPercent / 100;
  if (bf < 0 || bf >= 1) return null;

  const lbmKg = weightKg * (1 - bf);
  const ffmi = lbmKg / (heightM * heightM);
  const normalized = ffmi + 6.1 * (1.8 - heightM);

  return {
    lbmKg,
    fatMassKg: weightKg - lbmKg,
    ffmi,
    normalized,
  };
}

function ffmiCategory(ffmi: number) {
  // Simple, non-medical, gym-bro friendly buckets
  if (ffmi < 18) return "Below average";
  if (ffmi < 20) return "Average";
  if (ffmi < 22) return "Athletic";
  if (ffmi < 24) return "Very muscular";
  if (ffmi < 26) return "Elite / rare";
  return "Extreme (verify inputs)";
}

export default function FFMICalculator() {
  const [unit, setUnit] = useState<Unit>("imperial");

  // Metric
  const [heightCm, setHeightCm] = useState("175");
  const [weightKg, setWeightKg] = useState("78");
  const [bodyFatPct, setBodyFatPct] = useState("15");

  // Imperial
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("9");
  const [weightLb, setWeightLb] = useState("172");
  const [bodyFatPctImp, setBodyFatPctImp] = useState("15");

  const results = useMemo(() => {
    const toNum = (v: string) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    let hCm: number | null = null;
    let wKg: number | null = null;
    let bf: number | null = null;

    if (unit === "metric") {
      hCm = toNum(heightCm);
      wKg = toNum(weightKg);
      bf = toNum(bodyFatPct);
    } else {
      const ft = toNum(heightFt);
      const inch = toNum(heightIn);
      const w = toNum(weightLb);
      const b = toNum(bodyFatPctImp);
      if (ft == null || inch == null) return null;

      hCm = inchesToCm(feetInchesToInches(ft, inch));
      wKg = w == null ? null : poundsToKg(w);
      bf = b;
    }

    if (hCm == null || wKg == null || bf == null) return null;
    if (hCm <= 0 || wKg <= 0) return null;

    // body fat sanity
    if (bf <= 0 || bf >= 70) return null;

    const computed = computeFFMI({
      weightKg: wKg,
      heightCm: hCm,
      bodyFatPercent: bf,
    });

    if (!computed) return null;

    const ffmi = computed.ffmi;
    const normalized = computed.normalized;

    return {
      heightCm: hCm,
      weightKg: wKg,
      bodyFatPercent: bf,
      leanBodyMassKg: computed.lbmKg,
      fatMassKg: computed.fatMassKg,
      ffmi,
      normalized,
      category: ffmiCategory(ffmi),
    };
  }, [
    unit,
    heightCm,
    weightKg,
    bodyFatPct,
    heightFt,
    heightIn,
    weightLb,
    bodyFatPctImp,
  ]);

  return (
    <div className="w-full max-w-3xl rounded-2xl border bg-white p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">FFMI Calculator</h2>
          <p className="text-sm text-gray-600">
            Calculates FFMI and Normalized FFMI from height, weight, and body fat %.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            className={`btn btn-sm ${unit === "metric" ? "btn-primary text-white" : "btn-ghost"}`}
            onClick={() => setUnit("metric")}
            type="button"
          >
            Metric
          </button>
          <button
            className={`btn btn-sm ${unit === "imperial" ? "btn-primary text-white" : "btn-ghost"}`}
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

            <label className="form-control sm:col-span-2">
              <div className="label">
                <span className="label-text">Body fat %</span>
              </div>
              <input
                className="input input-bordered"
                value={bodyFatPct}
                onChange={(e) => setBodyFatPct(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 15"
              />
              <div className="label">
                <span className="label-text-alt text-gray-500">
                  Tip: use your photo estimate or Navy estimate for this.
                </span>
              </div>
            </label>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:col-span-2">
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

            <label className="form-control">
              <div className="label">
                <span className="label-text">Body fat %</span>
              </div>
              <input
                className="input input-bordered"
                value={bodyFatPctImp}
                onChange={(e) => setBodyFatPctImp(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 15"
              />
            </label>
          </>
        )}
      </div>

      {/* Results */}
      <div className="mt-6 rounded-xl bg-base-200 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-600">FFMI</p>
            <p className="text-3xl font-bold text-gray-900">
              {results == null ? "—" : round1(results.ffmi)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Normalized FFMI</p>
            <p className="text-3xl font-bold text-gray-900">
              {results == null ? "—" : round1(results.normalized)}
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-sm text-gray-600">Category</p>
            <p className="text-lg font-semibold text-gray-900">
              {results == null ? "—" : results.category}
            </p>
          </div>
        </div>

        {results != null && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4 border">
              <p className="text-xs text-gray-500">Lean Body Mass</p>
              <p className="text-lg font-semibold text-gray-900">
                {round1(results.leanBodyMassKg)} kg
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 border">
              <p className="text-xs text-gray-500">Fat Mass</p>
              <p className="text-lg font-semibold text-gray-900">
                {round1(results.fatMassKg)} kg
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 border">
              <p className="text-xs text-gray-500">Inputs used</p>
              <p className="text-sm text-gray-700">
                {round1(results.weightKg)} kg • {round1(results.heightCm)} cm •{" "}
                {round1(results.bodyFatPercent)}%
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <a href="/estimate" className="btn btn-primary text-white flex-1">
            Try photo estimate →
          </a>
          <a href="/body-fat-calculator" className="btn btn-outline flex-1">
            Use Navy calculator
          </a>
        </div>
      </div>
    </div>
  );
}
