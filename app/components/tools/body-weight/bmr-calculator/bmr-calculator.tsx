"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Gauge,
  InterpretationBar,
  SliderRow,
  UnitToggle,
  findRangeBucket,
} from "@/app/components/tools/body-weight/shared/ui";
import {
  formatFeetInches,
  inToCm,
  kgToLb,
  lbToKg,
  round,
  type Sex,
  type Units,
} from "@/app/components/tools/body-weight/shared/math";
import { mifflinStJeorBmr } from "@/app/components/tools/body-weight/shared/weight-projection";
import { BMR_PER_KG_RANGES } from "./bmr-ranges";

type EquationKey = "mifflin" | "harris-benedict";

type Props = {
  onChange?: (payload: {
    bmr: number;
    bmrPerKg: number;
    mifflinBmr: number;
    harrisBmr: number;
    equationLabel: string;
  }) => void;
};

function revisedHarrisBenedictBmr(params: {
  sex: Sex;
  ageYears: number;
  heightCm: number;
  weightKg: number;
}) {
  const { sex, ageYears, heightCm, weightKg } = params;
  if (sex === "male") {
    return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * ageYears;
  }

  return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * ageYears;
}

export default function BMRCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");
  const [equation, setEquation] = useState<EquationKey>("mifflin");
  const [ageYears, setAgeYears] = useState<number>(35);
  const [heightCm, setHeightCm] = useState<number>(177.8); // 5'10"
  const [weightKg, setWeightKg] = useState<number>(81.6); // 180 lb

  const heightIn = useMemo(() => Math.round(heightCm / 2.54), [heightCm]);
  const weightLb = useMemo(() => Math.round(kgToLb(weightKg)), [weightKg]);

  const mifflinBmr = useMemo(
    () =>
      mifflinStJeorBmr({
        sex,
        ageYears,
        heightCm,
        weightKg,
      }),
    [sex, ageYears, heightCm, weightKg],
  );

  const harrisBmr = useMemo(
    () =>
      revisedHarrisBenedictBmr({
        sex,
        ageYears,
        heightCm,
        weightKg,
      }),
    [sex, ageYears, heightCm, weightKg],
  );

  const bmr = equation === "mifflin" ? mifflinBmr : harrisBmr;
  const bmrPerKg = weightKg > 0 ? bmr / weightKg : 0;

  const rows = useMemo(
    () => [
      {
        key: "mifflin",
        label: "Mifflin-St Jeor",
        bmr: mifflinBmr,
      },
      {
        key: "harris-benedict",
        label: "Revised Harris-Benedict",
        bmr: harrisBmr,
      },
    ],
    [mifflinBmr, harrisBmr],
  );

  const category = useMemo(
    () => findRangeBucket(bmrPerKg, BMR_PER_KG_RANGES),
    [bmrPerKg],
  );

  useEffect(() => {
    onChange?.({
      bmr,
      bmrPerKg,
      mifflinBmr,
      harrisBmr,
      equationLabel: equation === "mifflin" ? "Mifflin-St Jeor" : "Revised Harris-Benedict",
    });
  }, [onChange, bmr, bmrPerKg, mifflinBmr, harrisBmr, equation]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="rounded-3xl bg-white/80 backdrop-blur border shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="p-8 bg-white min-w-0">
            <div className="flex items-center justify-between">
              <UnitToggle units={units} onChange={setUnits} />
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="font-semibold text-gray-900">Sex</div>
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

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="font-semibold text-gray-900">Equation</div>
              <select
                className="select select-bordered"
                value={equation}
                onChange={(e) => setEquation(e.target.value as EquationKey)}
                aria-label="Select equation"
              >
                <option value="mifflin">Mifflin-St Jeor</option>
                <option value="harris-benedict">Revised Harris-Benedict</option>
              </select>
            </div>

            <SliderRow
              label="Age"
              valueLabel={`${ageYears} years`}
              value={ageYears}
              min={18}
              max={80}
              step={1}
              onChange={setAgeYears}
            />

            {units === "imperial" ? (
              <>
                <SliderRow
                  label="Height"
                  valueLabel={formatFeetInches(heightIn)}
                  value={heightIn}
                  min={55}
                  max={84}
                  step={1}
                  onChange={(inches) => setHeightCm(inToCm(inches))}
                />
                <SliderRow
                  label="Weight"
                  valueLabel={`${weightLb} lbs`}
                  value={weightLb}
                  min={70}
                  max={450}
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
                  valueLabel={`${round(weightKg, 1)} kg`}
                  value={round(weightKg, 1)}
                  min={32}
                  max={205}
                  step={0.1}
                  onChange={setWeightKg}
                />
              </>
            )}
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge value={bmr} label="BMR" rimColor={category.color} min={900} max={2800} digits={0} />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Selected BMR</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(bmr)} kcal</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">BMR per kg</div>
                  <div className="text-lg font-semibold text-gray-900">{round(bmrPerKg, 1)} kcal/kg/day</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Mifflin-St Jeor</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(mifflinBmr)} kcal</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Revised Harris-Benedict</div>
                  <div className="text-lg font-semibold text-gray-900">{Math.round(harrisBmr)} kcal</div>
                </div>
              </div>

              <div className="mt-6 w-full overflow-hidden rounded-xl border bg-white">
                <table className="w-full text-left text-xs sm:text-sm border-separate border-spacing-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 font-semibold text-gray-700">Equation</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 text-right">BMR (kcal/day)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const isActive = row.key === equation;
                      return (
                        <tr key={row.key} className={isActive ? "bg-yellow-50" : "bg-white"}>
                          <td className={["px-3 py-2 text-gray-900", isActive ? "border-l-4 border-gray-900 font-semibold" : ""].join(" ")}>
                            {row.label}
                          </td>
                          <td
                            className={[
                              "px-3 py-2 text-right tabular-nums",
                              isActive ? "font-semibold border-r-4 border-gray-900 bg-white" : "text-gray-700",
                            ].join(" ")}
                          >
                            {Math.round(row.bmr)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <InterpretationBar
          value={bmrPerKg}
          ranges={BMR_PER_KG_RANGES}
          min={14}
          max={34}
          ticks={[14, 18, 22, 26, 30, 34]}
        />
      </div>
    </div>
  );
}
