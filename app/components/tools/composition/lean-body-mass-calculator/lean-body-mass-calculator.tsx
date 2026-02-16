"use client";

import React, { useEffect, useMemo, useState } from "react";
import LeanBodyMassInterpretationBar from "./lean-body-mass-interpretation-bar";
import { findLeanMassRange, type Gender } from "./lbm-ranges";

type Units = "imperial" | "metric";
type FormulaKey = "average" | "boer" | "james" | "hume";

type Props = {
  onChange?: (payload: {
    gender: Gender;
    leanMassPct: number;
    lbmKg: number;
    lbmi: number;
  }) => void;
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

function inToCm(inches: number) {
  return inches * 2.54;
}

function cmToM(cm: number) {
  return cm / 100;
}

function clampLbm(lbmKg: number, weightKg: number) {
  return clamp(lbmKg, 0, weightKg);
}

function boerLbmKg(gender: Gender, weightKg: number, heightCm: number) {
  if (gender === "female") {
    return 0.252 * weightKg + 0.473 * heightCm - 48.3;
  }

  return 0.407 * weightKg + 0.267 * heightCm - 19.2;
}

function jamesLbmKg(gender: Gender, weightKg: number, heightCm: number) {
  if (heightCm <= 0) return 0;

  const ratioSq = Math.pow(weightKg / heightCm, 2);

  if (gender === "female") {
    return 1.07 * weightKg - 148 * ratioSq;
  }

  return 1.1 * weightKg - 128 * ratioSq;
}

function humeLbmKg(gender: Gender, weightKg: number, heightCm: number) {
  if (gender === "female") {
    return 0.29569 * weightKg + 0.41813 * heightCm - 43.2933;
  }

  return 0.3281 * weightKg + 0.33929 * heightCm - 29.5336;
}

function computeLeanBodyMass(params: { gender: Gender; weightKg: number; heightCm: number }) {
  const { gender, weightKg, heightCm } = params;

  const boer = clampLbm(boerLbmKg(gender, weightKg, heightCm), weightKg);
  const james = clampLbm(jamesLbmKg(gender, weightKg, heightCm), weightKg);
  const hume = clampLbm(humeLbmKg(gender, weightKg, heightCm), weightKg);
  const average = (boer + james + hume) / 3;

  return {
    boer,
    james,
    hume,
    average,
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
  const pct = clamp((value - 50) / (98 - 50), 0, 1);
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

export default function LeanBodyMassCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [gender, setGender] = useState<Gender>("male");
  const [formula, setFormula] = useState<FormulaKey>("average");

  const [heightCm, setHeightCm] = useState<number>(178);
  const [weightKg, setWeightKg] = useState<number>(82);

  const results = useMemo(() => computeLeanBodyMass({ gender, weightKg, heightCm }), [gender, weightKg, heightCm]);

  const selectedLbmKg = useMemo(() => {
    if (formula === "boer") return results.boer;
    if (formula === "james") return results.james;
    if (formula === "hume") return results.hume;
    return results.average;
  }, [formula, results]);

  const leanMassPct = useMemo(() => {
    if (weightKg <= 0) return 0;
    return clamp((selectedLbmKg / weightKg) * 100, 0, 100);
  }, [selectedLbmKg, weightKg]);

  const fatMassKg = useMemo(() => clamp(weightKg - selectedLbmKg, 0, weightKg), [weightKg, selectedLbmKg]);
  const lbmi = useMemo(() => {
    const hM = cmToM(heightCm);
    if (hM <= 0) return 0;
    return selectedLbmKg / (hM * hM);
  }, [selectedLbmKg, heightCm]);

  useEffect(() => {
    onChange?.({
      gender,
      leanMassPct,
      lbmKg: selectedLbmKg,
      lbmi,
    });
  }, [onChange, gender, leanMassPct, selectedLbmKg, lbmi]);

  const category = useMemo(() => findLeanMassRange(gender, leanMassPct), [gender, leanMassPct]);

  const heightInUI = useMemo(() => Math.round(heightCm / 2.54), [heightCm]);
  const heightFtUI = useMemo(() => Math.floor(heightInUI / 12), [heightInUI]);
  const heightRemInUI = useMemo(() => heightInUI % 12, [heightInUI]);
  const weightLbUI = useMemo(() => Math.round(kgToLb(weightKg)), [weightKg]);

  const displayLbm = units === "metric" ? `${round(selectedLbmKg, 1)} kg` : `${round(kgToLb(selectedLbmKg), 1)} lbs`;
  const displayFatMass =
    units === "metric" ? `${round(fatMassKg, 1)} kg` : `${round(kgToLb(fatMassKg), 1)} lbs`;

  const formulaRows: Array<{ key: FormulaKey; label: string; lbmKg: number }> = [
    { key: "boer", label: "Boer", lbmKg: results.boer },
    { key: "james", label: "James", lbmKg: results.james },
    { key: "hume", label: "Hume", lbmKg: results.hume },
    { key: "average", label: "Average", lbmKg: results.average },
  ];

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
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                aria-label="Select gender"
              >
                <option value="male">Men</option>
                <option value="female">Women</option>
              </select>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="font-semibold text-gray-900">Formula</div>
              <select
                className="select select-bordered"
                value={formula}
                onChange={(e) => setFormula(e.target.value as FormulaKey)}
                aria-label="Select formula"
              >
                <option value="average">Average (Recommended)</option>
                <option value="boer">Boer</option>
                <option value="james">James</option>
                <option value="hume">Hume</option>
              </select>
            </div>

            {units === "imperial" ? (
              <>
                <SliderRow
                  label="Height"
                  valueLabel={`${heightFtUI} ft ${heightRemInUI} in`}
                  value={heightInUI}
                  min={55}
                  max={84}
                  step={1}
                  onChange={(inches) => setHeightCm(inToCm(inches))}
                />

                <SliderRow
                  label="Weight"
                  valueLabel={`${weightLbUI} lbs`}
                  value={weightLbUI}
                  min={80}
                  max={420}
                  step={1}
                  onChange={(lb) => setWeightKg(lbToKg(lb))}
                />
              </>
            ) : (
              <>
                <SliderRow
                  label="Height"
                  valueLabel={`${Math.round(heightCm)} cm`}
                  value={Math.round(heightCm)}
                  min={140}
                  max={214}
                  step={1}
                  onChange={setHeightCm}
                />

                <SliderRow
                  label="Weight"
                  valueLabel={`${Math.round(weightKg)} kg`}
                  value={Math.round(weightKg)}
                  min={36}
                  max={190}
                  step={1}
                  onChange={setWeightKg}
                />
              </>
            )}
          </div>

          <div className="p-8 bg-base-100 min-w-0">
            <div className="mt-7 flex items-center justify-center">
              <Gauge value={leanMassPct} label="LBM %" rimColor={category.color} />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Estimated Lean Mass</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{displayLbm}</div>
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Estimated Fat Mass</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{displayFatMass}</div>
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">Lean Mass %</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{round(leanMassPct, 1)}%</div>
              </div>

              <div className="rounded-2xl bg-base-200/60 p-4">
                <div className="text-sm text-gray-600">LBM Index</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{round(lbmi, 2)}</div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-base-200/60 p-4">
              <div className="text-sm text-gray-600">Category</div>
              <div className="mt-1 text-2xl font-bold" style={{ color: category.color }}>
                {category.label}
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Formula</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-700">LBM</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-700">Lean %</th>
                  </tr>
                </thead>
                <tbody>
                  {formulaRows.map((row) => {
                    const isSelected = formula === row.key;
                    const leanPctRow = weightKg > 0 ? (row.lbmKg / weightKg) * 100 : 0;

                    return (
                      <tr
                        key={row.key}
                        className={isSelected ? "bg-primary/10" : "bg-white"}
                      >
                        <td className={`px-3 py-2 ${isSelected ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                          {row.label}
                        </td>
                        <td className={`px-3 py-2 text-right tabular-nums ${isSelected ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                          {units === "metric" ? `${round(row.lbmKg, 1)} kg` : `${round(kgToLb(row.lbmKg), 1)} lbs`}
                        </td>
                        <td className={`px-3 py-2 text-right tabular-nums ${isSelected ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                          {round(leanPctRow, 1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <LeanBodyMassInterpretationBar leanMassPct={leanMassPct} gender={gender} />
      </div>
    </div>
  );
}
