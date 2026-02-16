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
  clamp,
  cmToIn,
  cmToM,
  formatFeetInches,
  inToCm,
  kgToLb,
  lbToKg,
  round,
  safeDiv,
  type Sex,
  type Units,
} from "@/app/components/tools/body-weight/shared/math";
import { getMuscleMassPctRanges, getMuscleMassScale } from "./muscle-mass-ranges";

type RaceKey = "white-hispanic" | "black" | "asian";

const RACE_FACTORS: { key: RaceKey; label: string; factor: number }[] = [
  { key: "white-hispanic", label: "White / Hispanic", factor: 0 },
  { key: "black", label: "Black", factor: 1.1 },
  { key: "asian", label: "Asian", factor: -2.0 },
];

type Props = {
  onChange?: (payload: {
    sex: Sex;
    raceLabel: string;
    smmKg: number;
    muscleMassPct: number;
    muscleMassIndex: number;
  }) => void;
};

function computeSkeletalMuscleMassKg(params: {
  sex: Sex;
  ageYears: number;
  heightCm: number;
  weightKg: number;
  armCircCm: number;
  thighCircCm: number;
  calfCircCm: number;
  tricepsSkinfoldMm: number;
  thighSkinfoldMm: number;
  calfSkinfoldMm: number;
  raceFactor: number;
}) {
  const {
    sex,
    ageYears,
    heightCm,
    weightKg,
    armCircCm,
    thighCircCm,
    calfCircCm,
    tricepsSkinfoldMm,
    thighSkinfoldMm,
    calfSkinfoldMm,
    raceFactor,
  } = params;

  const tricepsCm = tricepsSkinfoldMm / 10;
  const thighCm = thighSkinfoldMm / 10;
  const calfCm = calfSkinfoldMm / 10;

  const correctedArmCm = clamp(armCircCm - Math.PI * tricepsCm, 1, 120);
  const correctedThighCm = clamp(thighCircCm - Math.PI * thighCm, 1, 160);
  const correctedCalfCm = clamp(calfCircCm - Math.PI * calfCm, 1, 120);

  const heightM = cmToM(heightCm);
  const sexFactor = sex === "male" ? 1 : 0;

  const smmKg =
    heightM *
      (0.00744 * Math.pow(correctedArmCm, 2) +
        0.00088 * Math.pow(correctedThighCm, 2) +
        0.00441 * Math.pow(correctedCalfCm, 2)) +
    2.4 * sexFactor -
    0.048 * ageYears +
    raceFactor +
    7.8;

  return {
    smmKg: clamp(smmKg, 0, weightKg),
    correctedArmCm,
    correctedThighCm,
    correctedCalfCm,
  };
}

export default function MuscleMassCalculator({ onChange }: Props) {
  const [units, setUnits] = useState<Units>("imperial");
  const [sex, setSex] = useState<Sex>("male");
  const [raceKey, setRaceKey] = useState<RaceKey>("white-hispanic");

  const [ageYears, setAgeYears] = useState<number>(35);
  const [heightCm, setHeightCm] = useState<number>(177.8); // 5'10"
  const [weightKg, setWeightKg] = useState<number>(81.6); // 180 lbs

  const [armCircCm, setArmCircCm] = useState<number>(34);
  const [thighCircCm, setThighCircCm] = useState<number>(56);
  const [calfCircCm, setCalfCircCm] = useState<number>(38);

  const [tricepsSkinfoldMm, setTricepsSkinfoldMm] = useState<number>(12);
  const [thighSkinfoldMm, setThighSkinfoldMm] = useState<number>(18);
  const [calfSkinfoldMm, setCalfSkinfoldMm] = useState<number>(12);

  const race = useMemo(
    () => RACE_FACTORS.find((r) => r.key === raceKey) ?? RACE_FACTORS[0],
    [raceKey],
  );

  const result = useMemo(
    () =>
      computeSkeletalMuscleMassKg({
        sex,
        ageYears,
        heightCm,
        weightKg,
        armCircCm,
        thighCircCm,
        calfCircCm,
        tricepsSkinfoldMm,
        thighSkinfoldMm,
        calfSkinfoldMm,
        raceFactor: race.factor,
      }),
    [
      sex,
      ageYears,
      heightCm,
      weightKg,
      armCircCm,
      thighCircCm,
      calfCircCm,
      tricepsSkinfoldMm,
      thighSkinfoldMm,
      calfSkinfoldMm,
      race.factor,
    ],
  );

  const smmKg = result.smmKg;
  const muscleMassPct = safeDiv(smmKg, weightKg) * 100;
  const muscleMassIndex = safeDiv(smmKg, Math.pow(cmToM(heightCm), 2));

  const ranges = useMemo(() => getMuscleMassPctRanges(sex), [sex]);
  const scale = useMemo(() => getMuscleMassScale(sex), [sex]);
  const category = useMemo(
    () => findRangeBucket(muscleMassPct, ranges),
    [muscleMassPct, ranges],
  );

  const raceRows = useMemo(() => {
    return RACE_FACTORS.map((item) => {
      const raceResult = computeSkeletalMuscleMassKg({
        sex,
        ageYears,
        heightCm,
        weightKg,
        armCircCm,
        thighCircCm,
        calfCircCm,
        tricepsSkinfoldMm,
        thighSkinfoldMm,
        calfSkinfoldMm,
        raceFactor: item.factor,
      });
      const racePct = safeDiv(raceResult.smmKg, weightKg) * 100;

      return {
        ...item,
        smmKg: raceResult.smmKg,
        pct: racePct,
        range: findRangeBucket(racePct, ranges),
      };
    });
  }, [
    sex,
    ageYears,
    heightCm,
    weightKg,
    armCircCm,
    thighCircCm,
    calfCircCm,
    tricepsSkinfoldMm,
    thighSkinfoldMm,
    calfSkinfoldMm,
    ranges,
  ]);

  useEffect(() => {
    onChange?.({
      sex,
      raceLabel: race.label,
      smmKg,
      muscleMassPct,
      muscleMassIndex,
    });
  }, [onChange, sex, race.label, smmKg, muscleMassPct, muscleMassIndex]);

  const heightIn = useMemo(() => Math.round(heightCm / 2.54), [heightCm]);
  const weightLb = useMemo(() => Math.round(kgToLb(weightKg)), [weightKg]);
  const armIn = useMemo(() => round(cmToIn(armCircCm), 1), [armCircCm]);
  const thighIn = useMemo(() => round(cmToIn(thighCircCm), 1), [thighCircCm]);
  const calfIn = useMemo(() => round(cmToIn(calfCircCm), 1), [calfCircCm]);

  const smmDisplay =
    units === "metric" ? `${round(smmKg, 1)} kg` : `${round(kgToLb(smmKg), 1)} lbs`;

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
              <div className="font-semibold text-gray-900">Race Factor</div>
              <select
                className="select select-bordered"
                value={raceKey}
                onChange={(e) => setRaceKey(e.target.value as RaceKey)}
                aria-label="Select race factor"
              >
                {RACE_FACTORS.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <SliderRow
              label="Age"
              valueLabel={`${ageYears} years`}
              value={ageYears}
              min={18}
              max={85}
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
                  min={80}
                  max={420}
                  step={1}
                  onChange={(lb) => setWeightKg(lbToKg(lb))}
                />
                <SliderRow
                  label="Upper-Arm Circumference"
                  valueLabel={`${armIn} in`}
                  value={armIn}
                  min={8}
                  max={22}
                  step={0.1}
                  onChange={(inches) => setArmCircCm(inToCm(inches))}
                />
                <SliderRow
                  label="Mid-Thigh Circumference"
                  valueLabel={`${thighIn} in`}
                  value={thighIn}
                  min={14}
                  max={35}
                  step={0.1}
                  onChange={(inches) => setThighCircCm(inToCm(inches))}
                />
                <SliderRow
                  label="Calf Circumference"
                  valueLabel={`${calfIn} in`}
                  value={calfIn}
                  min={10}
                  max={24}
                  step={0.1}
                  onChange={(inches) => setCalfCircCm(inToCm(inches))}
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
                  min={36}
                  max={190}
                  step={0.1}
                  onChange={setWeightKg}
                />
                <SliderRow
                  label="Upper-Arm Circumference"
                  valueLabel={`${round(armCircCm, 1)} cm`}
                  value={round(armCircCm, 1)}
                  min={20}
                  max={56}
                  step={0.1}
                  onChange={setArmCircCm}
                />
                <SliderRow
                  label="Mid-Thigh Circumference"
                  valueLabel={`${round(thighCircCm, 1)} cm`}
                  value={round(thighCircCm, 1)}
                  min={35}
                  max={90}
                  step={0.1}
                  onChange={setThighCircCm}
                />
                <SliderRow
                  label="Calf Circumference"
                  valueLabel={`${round(calfCircCm, 1)} cm`}
                  value={round(calfCircCm, 1)}
                  min={25}
                  max={60}
                  step={0.1}
                  onChange={setCalfCircCm}
                />
              </>
            )}

            <SliderRow
              label="Triceps Skinfold"
              valueLabel={`${Math.round(tricepsSkinfoldMm)} mm`}
              value={tricepsSkinfoldMm}
              min={3}
              max={45}
              step={1}
              onChange={setTricepsSkinfoldMm}
            />
            <SliderRow
              label="Thigh Skinfold"
              valueLabel={`${Math.round(thighSkinfoldMm)} mm`}
              value={thighSkinfoldMm}
              min={4}
              max={60}
              step={1}
              onChange={setThighSkinfoldMm}
            />
            <SliderRow
              label="Calf Skinfold"
              valueLabel={`${Math.round(calfSkinfoldMm)} mm`}
              value={calfSkinfoldMm}
              min={3}
              max={40}
              step={1}
              onChange={setCalfSkinfoldMm}
            />
          </div>

          <div className="bg-base-100 min-w-0">
            <div className="p-8 min-h-[420px] flex flex-col items-center justify-center text-center">
              <Gauge
                value={muscleMassPct}
                label="Skeletal Muscle %"
                rimColor={category.color}
                min={scale.min}
                max={scale.max}
                digits={1}
              />

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-sm font-semibold text-gray-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                {category.label}
              </div>

              <p className="mt-3 text-sm text-gray-600 max-w-[320px] leading-relaxed">{category.note}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Estimated SMM</div>
                  <div className="text-lg font-semibold text-gray-900">{smmDisplay}</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Skeletal Muscle %</div>
                  <div className="text-lg font-semibold text-gray-900">{round(muscleMassPct, 1)}%</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Muscle Mass Index</div>
                  <div className="text-lg font-semibold text-gray-900">{round(muscleMassIndex, 2)} kg/m2</div>
                </div>
                <div className="rounded-xl bg-base-200/60 p-3">
                  <div className="text-xs text-gray-600">Selected Race Factor</div>
                  <div className="text-lg font-semibold text-gray-900">{race.label}</div>
                </div>
              </div>

              <div className="mt-6 w-full overflow-hidden rounded-xl border bg-white">
                <table className="w-full text-left text-xs sm:text-sm border-separate border-spacing-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 font-semibold text-gray-700">Race Factor</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 text-right">SMM (kg)</th>
                      <th className="px-3 py-2 font-semibold text-gray-700 text-right">SMM %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {raceRows.map((row) => {
                      const isActive = row.key === raceKey;
                      return (
                        <tr key={row.key} className={row.range.rowClass}>
                          <td
                            className={[
                              "px-3 py-2 text-gray-900",
                              isActive ? "border-l-4 border-gray-900 font-semibold" : "",
                            ].join(" ")}
                          >
                            {row.label}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums text-gray-700">
                            {round(row.smmKg, 1)}
                          </td>
                          <td
                            className={[
                              "px-3 py-2 text-right tabular-nums",
                              isActive ? "font-semibold border-r-4 border-gray-900 bg-white" : "text-gray-700",
                            ].join(" ")}
                          >
                            {round(row.pct, 1)}
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
          value={muscleMassPct}
          ranges={ranges}
          min={scale.min}
          max={scale.max}
          ticks={scale.ticks}
        />
      </div>
    </div>
  );
}
