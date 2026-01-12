"use client";

import { useMemo, useState } from "react";

type Sex = "male" | "female";
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

function lbToKg(lb: number) {
  return lb * 0.45359237;
}

function kgToLb(kg: number) {
  return kg * 2.2046226218;
}

function cmToM(cm: number) {
  return cm / 100;
}

// U.S. Navy body fat formula (using log10)
// Men: 86.010*log10(waist-neck) - 70.041*log10(height) + 36.76
// Women: 163.205*log10(waist+hip-neck) - 97.684*log10(height) - 78.387
function navyBodyFatPercent({
  sex,
  heightCm,
  neckCm,
  waistCm,
  hipCm,
}: {
  sex: Sex;
  heightCm: number;
  neckCm: number;
  waistCm: number;
  hipCm?: number;
}) {
  const log10 = (x: number) => Math.log(x) / Math.LN10;

  if (sex === "male") {
    const x = waistCm - neckCm;
    if (x <= 0) return null;
    return 86.01 * log10(x) - 70.041 * log10(heightCm) + 36.76;
  }

  const hip = hipCm ?? 0;
  const x = waistCm + hip - neckCm;
  if (x <= 0) return null;
  return 163.205 * log10(x) - 97.684 * log10(heightCm) - 78.387;
}

function categoryLabel(bf: number, sex: Sex) {
  // simple UX labels (don’t overpromise clinical accuracy)
  if (sex === "male") {
    if (bf < 6) return "Essential";
    if (bf < 14) return "Fitness";
    if (bf < 18) return "Average";
    if (bf < 25) return "Above average";
    return "High";
  } else {
    if (bf < 14) return "Essential";
    if (bf < 21) return "Fitness";
    if (bf < 25) return "Average";
    if (bf < 32) return "Above average";
    return "High";
  }
}

export default function BodyFatCalculator() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [sex, setSex] = useState<Sex>("male");

  // metric inputs
  const [heightCm, setHeightCm] = useState<string>("175");
  const [weightKg, setWeightKg] = useState<string>("70");
  const [neckCm, setNeckCm] = useState<string>("38");
  const [waistCm, setWaistCm] = useState<string>("80");
  const [hipCm, setHipCm] = useState<string>("95"); // women

  // imperial inputs
  const [heightFt, setHeightFt] = useState<string>("5");
  const [heightIn, setHeightIn] = useState<string>("9");
  const [weightLb, setWeightLb] = useState<string>("154");
  const [neckIn, setNeckIn] = useState<string>("15");
  const [waistIn, setWaistIn] = useState<string>("32");
  const [hipIn, setHipIn] = useState<string>("38");

  const computed = useMemo(() => {
    const toNum = (v: string) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    let hCm: number | null = null;
    let wKg: number | null = null;
    let nCm: number | null = null;
    let wstCm: number | null = null;
    let hipsCm: number | null = null;

    if (unit === "metric") {
      hCm = toNum(heightCm);
      wKg = toNum(weightKg);
      nCm = toNum(neckCm);
      wstCm = toNum(waistCm);
      hipsCm = toNum(hipCm);
    } else {
      const ft = toNum(heightFt);
      const inch = toNum(heightIn);
      const lb = toNum(weightLb);
      const nIn = toNum(neckIn);
      const wIn = toNum(waistIn);
      const hiIn = toNum(hipIn);

      if (ft == null || inch == null) return null;

      hCm = inchesToCm(feetInchesToInches(ft, inch));
      wKg = lb == null ? null : lbToKg(lb);
      nCm = nIn == null ? null : inchesToCm(nIn);
      wstCm = wIn == null ? null : inchesToCm(wIn);
      hipsCm = hiIn == null ? null : inchesToCm(hiIn);
    }

    if (hCm == null || nCm == null || wstCm == null) return null;
    if (hCm <= 0 || nCm <= 0 || wstCm <= 0) return null;

    const bfRaw = navyBodyFatPercent({
      sex,
      heightCm: hCm,
      neckCm: nCm,
      waistCm: wstCm,
      hipCm: sex === "female" ? hipsCm ?? 0 : undefined,
    });

    if (bfRaw == null || !Number.isFinite(bfRaw)) return null;

    const bf = round1(Math.max(2, Math.min(70, bfRaw)));
    const hasWeight = wKg != null && wKg > 0;

    const bmi = hasWeight ? wKg! / (cmToM(hCm) * cmToM(hCm)) : null;

    const fatMassKg = hasWeight ? (wKg! * bf) / 100 : null;
    const leanMassKg = fatMassKg != null ? wKg! - fatMassKg : null;

    return {
      heightCm: hCm,
      weightKg: hasWeight ? wKg! : null,
      bf,
      category: categoryLabel(bf, sex),
      bmi: bmi != null ? round1(bmi) : null,
      fatMassKg: fatMassKg != null ? round1(fatMassKg) : null,
      leanMassKg: leanMassKg != null ? round1(leanMassKg) : null,
    };
  }, [
    unit,
    sex,
    heightCm,
    weightKg,
    neckCm,
    waistCm,
    hipCm,
    heightFt,
    heightIn,
    weightLb,
    neckIn,
    waistIn,
    hipIn,
  ]);

  const showLb = unit === "imperial";

  return (
    <div className="w-full max-w-3xl rounded-2xl border bg-white p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Calculate your body fat %
          </h2>
          <p className="text-sm text-gray-600">
            Uses the U.S. Navy formula (tape measurements).
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

      <div className="mt-6 flex gap-2">
        <button
          className={`btn btn-sm flex-1 ${
            sex === "male" ? "btn-primary text-white" : "btn-outline"
          }`}
          onClick={() => setSex("male")}
          type="button"
        >
          Male
        </button>
        <button
          className={`btn btn-sm flex-1 ${
            sex === "female" ? "btn-primary text-white" : "btn-outline"
          }`}
          onClick={() => setSex("female")}
          type="button"
        >
          Female
        </button>
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
                placeholder="e.g. 70"
              />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Neck (cm)</span>
              </div>
              <input
                className="input input-bordered"
                value={neckCm}
                onChange={(e) => setNeckCm(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 38"
              />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Waist (cm)</span>
              </div>
              <input
                className="input input-bordered"
                value={waistCm}
                onChange={(e) => setWaistCm(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 80"
              />
            </label>

            {sex === "female" && (
              <label className="form-control sm:col-span-2">
                <div className="label">
                  <span className="label-text">Hips (cm)</span>
                </div>
                <input
                  className="input input-bordered"
                  value={hipCm}
                  onChange={(e) => setHipCm(e.target.value)}
                  inputMode="decimal"
                  placeholder="e.g. 95"
                />
              </label>
            )}
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
                placeholder="e.g. 154"
              />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Neck (in)</span>
              </div>
              <input
                className="input input-bordered"
                value={neckIn}
                onChange={(e) => setNeckIn(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 15"
              />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Waist (in)</span>
              </div>
              <input
                className="input input-bordered"
                value={waistIn}
                onChange={(e) => setWaistIn(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 32"
              />
            </label>

            {sex === "female" && (
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Hips (in)</span>
                </div>
                <input
                  className="input input-bordered"
                  value={hipIn}
                  onChange={(e) => setHipIn(e.target.value)}
                  inputMode="decimal"
                  placeholder="e.g. 38"
                />
              </label>
            )}
          </>
        )}
      </div>

      {/* Results */}
      <div className="mt-6 rounded-2xl border bg-base-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">Body Fat (U.S. Navy Method)</p>
            <p className="text-4xl font-extrabold text-gray-900">
              {computed?.bf == null ? "—" : `${computed.bf}%`}
            </p>

            {computed?.category && (
              <p className="mt-1 text-sm text-gray-700">
                Category:{" "}
                <span className="font-semibold">{computed.category}</span>
              </p>
            )}
          </div>

          <a href="/estimate" className="btn btn-primary text-white">
            Try photo estimate →
          </a>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-4 border">
            <p className="text-xs text-gray-500">Body Fat Mass</p>
            <p className="text-lg font-semibold text-gray-900">
              {computed?.fatMassKg == null
                ? "Add weight to compute"
                : showLb
                ? `${round1(kgToLb(computed.fatMassKg))} lb`
                : `${computed.fatMassKg} kg`}
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 border">
            <p className="text-xs text-gray-500">Lean Body Mass</p>
            <p className="text-lg font-semibold text-gray-900">
              {computed?.leanMassKg == null
                ? "Add weight to compute"
                : showLb
                ? `${round1(kgToLb(computed.leanMassKg))} lb`
                : `${computed.leanMassKg} kg`}
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 border">
            <p className="text-xs text-gray-500">BMI</p>
            <p className="text-lg font-semibold text-gray-900">
              {computed?.bmi == null ? "Add weight to compute" : computed.bmi}
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 border">
            <p className="text-xs text-gray-500">Notes</p>
            <p className="text-sm text-gray-700">
              Tape placement and posture can shift results. Track trends using the same setup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
