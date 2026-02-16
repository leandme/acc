"use client";

import React, { useMemo } from "react";
import { clamp, round, type Units } from "./math";

export type RangeBucket = {
  key: string;
  label: string;
  min: number;
  max: number;
  rowClass: string;
  color: string;
  note: string;
  shortLabel?: string;
};

export const STANDARD_BUCKET_COLORS = {
  red: { row: "bg-red-50", dot: "#ef4444" },
  orange: { row: "bg-orange-50", dot: "#f97316" },
  yellow: { row: "bg-yellow-50", dot: "#fde047" },
  green: { row: "bg-green-50", dot: "#22c55e" },
  teal: { row: "bg-emerald-50", dot: "#10b981" },
  blue: { row: "bg-blue-50", dot: "#3b82f6" },
  purple: { row: "bg-violet-50", dot: "#7c3aed" },
};

export function findRangeBucket(value: number, ranges: RangeBucket[]) {
  return ranges.find((r) => value >= r.min && value < r.max) ?? ranges[ranges.length - 1];
}

export function rangeMidpoint(range: Pick<RangeBucket, "min" | "max">, fallbackMax: number) {
  if (!Number.isFinite(range.max)) {
    return Math.min(range.min + 0.08 * (fallbackMax - range.min), fallbackMax);
  }

  return (range.min + range.max) / 2;
}

function buildGradient(ranges: RangeBucket[], min: number, max: number) {
  if (!ranges.length) {
    return "linear-gradient(to right, #9ca3af 0%, #9ca3af 100%)";
  }

  if (max <= min) {
    return `linear-gradient(to right, ${ranges[0].color} 0%, ${ranges[0].color} 100%)`;
  }

  const blendWindowPct = 1.5;
  const stops: string[] = [`${ranges[0].color} 0%`];
  let lastPct = 0;

  for (let i = 0; i < ranges.length - 1; i += 1) {
    const boundaryValue = Number.isFinite(ranges[i].max) ? ranges[i].max : max;
    const boundaryPct = clamp(((boundaryValue - min) / (max - min)) * 100, 0, 100);

    const left = clamp(boundaryPct - blendWindowPct, lastPct, 100);
    const right = clamp(boundaryPct + blendWindowPct, left, 100);

    stops.push(`${ranges[i].color} ${left}%`);
    stops.push(`${ranges[i + 1].color} ${right}%`);

    lastPct = right;
  }

  stops.push(`${ranges[ranges.length - 1].color} 100%`);

  return `linear-gradient(to right, ${stops.join(", ")})`;
}

export function UnitToggle({
  units,
  onChange,
}: {
  units: Units;
  onChange: (units: Units) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm font-semibold ${units === "imperial" ? "text-primary" : "text-gray-500"}`}>
        Imperial
      </span>
      <input
        type="checkbox"
        className="toggle toggle-primary"
        checked={units === "metric"}
        onChange={(e) => onChange(e.target.checked ? "metric" : "imperial")}
        aria-label="Toggle imperial or metric units"
      />
      <span className={`text-sm font-semibold ${units === "metric" ? "text-primary" : "text-gray-500"}`}>
        Metric
      </span>
    </div>
  );
}

export function SliderRow(props: {
  label: string;
  valueLabel: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  helper?: React.ReactNode;
}) {
  const { label, valueLabel, value, min, max, step = 1, onChange, helper } = props;

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

export function Gauge({
  value,
  label,
  rimColor,
  min,
  max,
  digits = 1,
}: {
  value: number;
  label: string;
  rimColor: string;
  min: number;
  max: number;
  digits?: number;
}) {
  const pct = clamp((value - min) / (max - min), 0, 1);
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
          <div className="text-5xl font-bold text-gray-900">{round(value, digits)}</div>
          <div className="text-sm font-semibold text-gray-700">{label}</div>
        </div>
      </div>
    </div>
  );
}

export function InterpretationBar({
  value,
  ranges,
  min,
  max,
  ticks,
}: {
  value: number;
  ranges: RangeBucket[];
  min: number;
  max: number;
  ticks: number[];
}) {
  const active = useMemo(() => findRangeBucket(value, ranges), [value, ranges]);

  const snappedValue = useMemo(() => rangeMidpoint(active, max), [active, max]);

  const markerPct = useMemo(() => {
    const v = clamp(snappedValue, min, max);
    return ((v - min) / (max - min)) * 100;
  }, [snappedValue, min, max]);

  const gradient = useMemo(() => buildGradient(ranges, min, max), [ranges, min, max]);

  return (
    <div className="w-full border-t border-black/5 bg-white/40">
      <div className="w-full px-6 pt-6 pb-5">
        <div className="relative">
          <div className="relative h-12 rounded-full overflow-hidden border border-black/10 bg-base-200 shadow-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_18px_rgba(0,0,0,0.25)]">
            <div className="absolute inset-0" style={{ background: gradient }} />

            <div className="absolute inset-0 bg-white/15" />
          </div>

          <div
            className="absolute -top-3"
            style={{ left: `${markerPct}%`, transform: "translateX(-50%)" }}
            aria-label={`Current category ${active.label}`}
            title={active.label}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderTop: "14px solid #111827",
                filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.25))",
              }}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-between text-[11px] text-gray-600">
          {ticks.map((tick) => (
            <span key={tick} className="tabular-nums">
              {tick}
            </span>
          ))}
        </div>

        <div className="mt-2 flex justify-between gap-2 text-[11px] text-gray-500">
          {ranges.map((range) => (
            <span key={range.key} className="text-center flex-1 leading-tight">
              {range.shortLabel ?? range.label}
            </span>
          ))}
        </div>

        <div className="mt-2 text-center text-[12px] font-semibold text-gray-700">
          <span className="inline-flex items-center gap-2" aria-label={`Category ${active.label}`}>
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: active.color }} />
            {active.label}
          </span>
        </div>
      </div>
    </div>
  );
}
