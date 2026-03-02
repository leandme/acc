"use client";

import React, { useEffect, useMemo, useState } from "react";

type Units = "metric" | "imperial";

type Props = {
  bodyFat: number | null;
  units: Units;
  weight: number | null;
  onWeightChange: (weight: number | null) => void;
  className?: string;
};

type PacePlan = {
  key: "conservative" | "medium" | "aggressive";
  label: string;
  weeklyPct: number;
  color: string;
};

const KG_PER_LB = 0.45359237;

const PACE_PLANS: PacePlan[] = [
  { key: "conservative", label: "Conservative", weeklyPct: 0.4, color: "#16a34a" },
  { key: "medium", label: "Medium", weeklyPct: 0.7, color: "#2563eb" },
  { key: "aggressive", label: "Aggressive", weeklyPct: 1.0, color: "#ea580c" },
];

function toKg(value: number, units: Units) {
  return units === "metric" ? value : value * KG_PER_LB;
}

function fromKg(value: number, units: Units) {
  return units === "metric" ? value : value / KG_PER_LB;
}

function formatMass(kg: number, units: Units) {
  const value = fromKg(kg, units);
  const rounded = Number(value.toFixed(1));
  return `${rounded} ${units === "metric" ? "kg" : "lb"}`;
}

function formatWeeks(weeks: number) {
  if (!Number.isFinite(weeks) || weeks <= 0) return "0 weeks";
  if (weeks < 8) return `${Math.round(weeks)} weeks`;
  return `${weeks.toFixed(1)} weeks`;
}

function formatMonths(weeks: number) {
  if (!Number.isFinite(weeks) || weeks <= 0) return "0 months";
  return `${(weeks / 4.345).toFixed(1)} months`;
}

function weeksToGoal(weightKg: number, fatToLoseKg: number, weeklyPct: number) {
  if (fatToLoseKg <= 0 || weightKg <= 0 || weeklyPct <= 0) return 0;
  const weeklyLossKg = weightKg * (weeklyPct / 100);
  if (weeklyLossKg <= 0) return 0;
  return fatToLoseKg / weeklyLossKg;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatDateFromWeeks(weeks: number) {
  const days = Math.max(0, Math.round(weeks * 7));
  const eta = new Date();
  eta.setDate(eta.getDate() + days);
  return eta.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function addWeeks(base: Date, weeks: number) {
  const next = new Date(base);
  next.setDate(next.getDate() + Math.max(0, Math.round(weeks * 7)));
  return next;
}

export default function EstimateGoalPlanner({
  bodyFat,
  units,
  weight,
  onWeightChange,
  className = "",
}: Props) {
  const hasBodyFat = typeof bodyFat === "number";
  const hasWeight = typeof weight === "number" && Number.isFinite(weight) && weight > 0;
  const currentBf = hasBodyFat ? bodyFat : null;
  const minTarget = 0;
  const maxTarget = 30;

  const [targetBodyFat, setTargetBodyFat] = useState(20);
  const [goalWeightInput, setGoalWeightInput] = useState("");
  const [paceIndex, setPaceIndex] = useState(1);

  useEffect(() => {
    if (!hasBodyFat) return;
    const candidate = clamp(Number((bodyFat - 3).toFixed(1)), 8, 20);
    const defaultTarget = Math.min(candidate, Number(bodyFat.toFixed(1)));
    setTargetBodyFat(defaultTarget);
  }, [hasBodyFat, bodyFat]);

  if (!hasBodyFat) return null;

  const normalizedTarget = clamp(targetBodyFat, minTarget, maxTarget);
  const minWeight = units === "metric" ? 36 : 80;
  const maxWeight = units === "metric" ? 190 : 420;
  const defaultWeight = units === "metric" ? 75 : 165;
  const weightSliderValue = hasWeight ? clamp(weight!, minWeight, maxWeight) : defaultWeight;
  const weightLabel = `${Number(weightSliderValue.toFixed(1))} ${units === "metric" ? "kg" : "lb"}`;

  const weightKg = hasWeight ? toKg(weight!, units) : null;
  const leanMassKg = weightKg !== null ? weightKg * (1 - bodyFat / 100) : null;
  const targetWeightKg =
    leanMassKg !== null ? leanMassKg / (1 - normalizedTarget / 100) : null;
  const fatToLoseKg =
    targetWeightKg !== null && weightKg !== null ? Math.max(weightKg - targetWeightKg, 0) : null;

  const goalWeightValue = Number(goalWeightInput);
  const hasGoalWeight = hasWeight && Number.isFinite(goalWeightValue) && goalWeightValue > 0;
  const defaultGoalWeight = hasWeight
    ? clamp(Number((weightSliderValue * 0.9).toFixed(1)), minWeight, maxWeight)
    : units === "metric"
      ? 75
      : 165;
  const goalWeightSliderValue = hasGoalWeight
    ? clamp(goalWeightValue, minWeight, maxWeight)
    : defaultGoalWeight;
  const goalWeightLabel = `${Number(goalWeightSliderValue.toFixed(1))} ${
    units === "metric" ? "kg" : "lb"
  }`;
  const goalWeightKg = hasGoalWeight ? toKg(goalWeightValue, units) : null;
  const projectedBfAtGoalWeight =
    goalWeightKg !== null && leanMassKg !== null
      ? clamp(((goalWeightKg - leanMassKg) / goalWeightKg) * 100, 3, 60)
      : null;
  const selectedPace = PACE_PLANS[clamp(paceIndex, 0, PACE_PLANS.length - 1)] ?? PACE_PLANS[1];
  const today = useMemo(() => new Date(), []);

  const selectedPlan = useMemo(() => {
    if (weightKg === null || fatToLoseKg === null) return null;
    return {
      ...selectedPace,
      weeks: weeksToGoal(weightKg, fatToLoseKg, selectedPace.weeklyPct),
    };
  }, [weightKg, fatToLoseKg, selectedPace]);

  const chart = useMemo(() => {
    if (!selectedPlan || currentBf === null) return null;

    const chartW = 920;
    const chartH = 420;
    const padLeft = 74;
    const padRight = 28;
    const padTop = 24;
    const padBottom = 78;
    const drawableW = chartW - padLeft - padRight;
    const drawableH = chartH - padTop - padBottom;

    const paceWeeks = Math.max(selectedPlan.weeks, 0);
    const maxWeeks = Math.max(paceWeeks, 1);
    const goalBf = paceWeeks <= 0 ? currentBf : normalizedTarget;
    const minY = Math.max(0, Math.min(currentBf, goalBf) - 2);
    const maxY = Math.min(50, Math.max(currentBf, goalBf) + 2);
    const ySpan = maxY - minY || 1;

    const xForWeek = (week: number) => padLeft + (week / maxWeeks) * drawableW;
    const yForBf = (bf: number) => padTop + ((maxY - bf) / ySpan) * drawableH;

    const steps = 42;
    const points: Array<{ x: number; y: number }> = [];

    for (let i = 0; i <= steps; i += 1) {
      const week = (maxWeeks * i) / steps;
      const progress = paceWeeks <= 0 ? 0 : clamp(week / paceWeeks, 0, 1);
      const bf = currentBf + (goalBf - currentBf) * progress;
      points.push({ x: xForWeek(week), y: yForBf(bf) });
    }

    const path = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(" ");

    const xTickCount = 6;
    const xTicks = Array.from({ length: xTickCount }, (_, i) => {
      const week = (maxWeeks * i) / (xTickCount - 1);
      const date = addWeeks(today, week);
      return {
        week,
        x: xForWeek(week),
        dateLabel: formatShortDate(date),
      };
    });

    const yTickCount = 6;
    const yTicks = Array.from({ length: yTickCount }, (_, i) => {
      const bf = maxY - ((maxY - minY) * i) / (yTickCount - 1);
      return { bf, y: yForBf(bf) };
    });

    return {
      chartW,
      chartH,
      padLeft,
      padRight,
      padTop,
      padBottom,
      path,
      points,
      xTicks,
      yTicks,
      maxWeeks,
      todayLabel: formatDateFromWeeks(0),
      targetLabel: formatDateFromWeeks(selectedPlan.weeks),
    };
  }, [selectedPlan, currentBf, normalizedTarget, today]);

  return (
    <section className={`w-full max-w-3xl ${className}`}>
      <div className="p-5">
        <h2 className="text-3xl lg:text-4xl font-semibold text-center">
          {hasWeight ? "Goal Planner" : "Unlock Goal Planner"}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          {hasWeight
            ? "Plan from your current estimate to a target body-fat level with an expected timeline at different pacing options."
            : "Add your weight to unlock target-weight planning, fat-to-lose estimates, and timeline projections."}
        </p>

        <div className="mt-8 rounded-2xl bg-white p-5">
          <label className="form-control w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Target Body Fat (%)</span>
              <span className="text-2xl font-semibold text-gray-900 whitespace-nowrap">
                {normalizedTarget.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min={minTarget}
              max={maxTarget}
              step="0.1"
              value={normalizedTarget}
              onChange={(e) => setTargetBodyFat(Number(e.target.value))}
              className="range range-primary mt-3"
            />
          </label>

          <div className="form-control mt-5 w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">
                Weight ({units === "metric" ? "kg" : "lb"})
              </span>
              <span className="text-2xl font-semibold text-gray-900 whitespace-nowrap">
                {weightLabel}
              </span>
            </div>
            <input
              type="range"
              className="range range-primary mt-3"
              min={minWeight}
              max={maxWeight}
              step={0.1}
              value={weightSliderValue}
              onChange={(e) => onWeightChange(Number(e.target.value))}
            />
          </div>

          <div className="form-control mt-5 w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">
                Goal Weight ({units === "metric" ? "kg" : "lb"})
              </span>
              <span className="text-2xl font-semibold text-gray-900 whitespace-nowrap">
                {goalWeightLabel}
              </span>
            </div>
            <input
              type="range"
              className="range range-primary mt-3"
              min={minWeight}
              max={maxWeight}
              step="0.1"
              value={goalWeightSliderValue}
              onChange={(e) => setGoalWeightInput(e.target.value)}
            />
          </div>
        </div>

        {hasWeight ? (
          <>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">Target Weight</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {targetWeightKg !== null ? formatMass(targetWeightKg, units) : "-"}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">Fat To Lose</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {fatToLoseKg !== null ? formatMass(fatToLoseKg, units) : "-"}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">Lean Mass</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {leanMassKg !== null ? formatMass(leanMassKg, units) : "-"}
                </p>
              </div>
            </div>

            {hasGoalWeight && projectedBfAtGoalWeight !== null ? (
              <div className="mt-5 rounded-2xl bg-blue-50 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-blue-700">
                  Projected at Goal Weight
                </p>
                <p className="mt-2 text-xl font-semibold text-blue-900">
                  At {goalWeightSliderValue.toFixed(1)} {units === "metric" ? "kg" : "lb"}, estimated body fat would be about{" "}
                  {projectedBfAtGoalWeight.toFixed(1)}% (assuming lean mass is maintained).
                </p>
              </div>
            ) : null}

            <div className="mt-8 rounded-2xl bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">Timeline Pace</p>
                <p className="text-sm text-gray-600">{selectedPace.weeklyPct.toFixed(1)}% body weight/week</p>
              </div>

              <div className="mt-2 text-2xl font-semibold text-gray-900">{selectedPace.label}</div>

              <input
                type="range"
                min={0}
                max={PACE_PLANS.length - 1}
                step={1}
                value={paceIndex}
                onChange={(e) => setPaceIndex(Number(e.target.value))}
                className="range range-primary mt-4"
              />

              <div className="mt-2 flex justify-between text-xs sm:text-sm">
                {PACE_PLANS.map((pace, idx) => (
                  <span
                    key={pace.key}
                    className={idx === paceIndex ? "font-semibold text-gray-900" : "text-gray-500"}
                  >
                    {pace.label}
                  </span>
                ))}
              </div>
            </div>

            {chart && selectedPlan ? (
              <div className="mt-8 rounded-2xl bg-white p-4 sm:p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">Estimated Timeline</p>
                <p className="mt-1 text-sm text-gray-600">Start: Today ({chart.todayLabel})</p>

                <svg
                  viewBox={`0 0 ${chart.chartW} ${chart.chartH}`}
                  className="mt-4 w-full h-auto"
                  role="img"
                  aria-label="Estimated body-fat timeline"
                >
                  {chart.yTicks.map((tick, idx) => (
                    <line
                      key={`y-grid-${idx}`}
                      x1={chart.padLeft}
                      y1={tick.y}
                      x2={chart.chartW - chart.padRight}
                      y2={tick.y}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  ))}

                  {chart.xTicks.map((tick, idx) => (
                    <line
                      key={`x-grid-${idx}`}
                      x1={tick.x}
                      y1={chart.padTop}
                      x2={tick.x}
                      y2={chart.chartH - chart.padBottom}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}

                  <line
                    x1={chart.padLeft}
                    y1={chart.chartH - chart.padBottom}
                    x2={chart.chartW - chart.padRight}
                    y2={chart.chartH - chart.padBottom}
                    stroke="#9ca3af"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={chart.padLeft}
                    y1={chart.padTop}
                    x2={chart.padLeft}
                    y2={chart.chartH - chart.padBottom}
                    stroke="#9ca3af"
                    strokeWidth="1.5"
                  />

                  {chart.yTicks.map((tick, idx) => (
                    <text
                      key={`y-label-${idx}`}
                      x={chart.padLeft - 10}
                      y={tick.y + 4}
                      textAnchor="end"
                      fontSize="11"
                      fill="#6b7280"
                    >
                      {tick.bf.toFixed(1)}%
                    </text>
                  ))}

                  {chart.xTicks.map((tick, idx) => (
                    <text
                      key={`x-label-${idx}`}
                      x={tick.x}
                      y={chart.chartH - chart.padBottom + 20}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#6b7280"
                    >
                      {idx === 0 ? "Today" : tick.dateLabel}
                    </text>
                  ))}

                  <text
                    x={24}
                    y={chart.chartH / 2}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                    transform={`rotate(-90 24 ${chart.chartH / 2})`}
                  >
                    Body Fat (%)
                  </text>
                  <text
                    x={(chart.padLeft + (chart.chartW - chart.padRight)) / 2}
                    y={chart.chartH - 10}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    Date
                  </text>

                  <path
                    d={chart.path}
                    fill="none"
                    stroke={selectedPlan.color}
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <circle cx={chart.points[0].x} cy={chart.points[0].y} r="4.5" fill={selectedPlan.color} />
                  <circle
                    cx={chart.points[chart.points.length - 1].x}
                    cy={chart.points[chart.points.length - 1].y}
                    r="4.5"
                    fill={selectedPlan.color}
                  />

                  <text
                    x={chart.points[0].x + 8}
                    y={chart.points[0].y - 10}
                    fontSize="11"
                    fill={selectedPlan.color}
                  >
                    Today
                  </text>
                </svg>

                <div className="mt-5 rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: selectedPlan.color }}
                      />
                      <p className="text-sm font-semibold text-gray-900">{selectedPlan.label}</p>
                    </div>
                    <p className="text-sm text-gray-600">{selectedPlan.weeklyPct.toFixed(1)}% / week</p>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">
                    {formatWeeks(selectedPlan.weeks)} ({formatMonths(selectedPlan.weeks)})
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Target date: {chart.targetLabel}</p>
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}
