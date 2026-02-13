"use client";

import { useMemo } from "react";

type Bucket = {
  label: string;
  min: number;
  max: number;
  color: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const BUCKETS: Bucket[] = [
  { label: "Low", min: 0, max: 80, color: "#3b82f6" },
  { label: "Moderate", min: 80, max: 130, color: "#22c55e" },
  { label: "Obesity", min: 130, max: 170, color: "#fde047" },
  { label: "High", min: 170, max: 220, color: "#f59e0b" },
  { label: "Very High", min: 220, max: 1000, color: "#ef4444" },
];

function bucketFor(value: number) {
  return BUCKETS.find((b) => value >= b.min && value < b.max) ?? BUCKETS[BUCKETS.length - 1];
}

function midpoint(bucket: Bucket) {
  return (bucket.min + bucket.max) / 2;
}

export default function VisceralFatInterpretationBar({
  value,
  min = 0,
  max = 300,
}: {
  value: number;
  min?: number;
  max?: number;
}) {
  const band = useMemo(() => bucketFor(value), [value]);
  const snapped = useMemo(() => midpoint(band), [band]);

  const pct = useMemo(() => {
    const v = clamp(snapped, min, max);
    return ((v - min) / (max - min)) * 100;
  }, [snapped, min, max]);

  const gradient = useMemo(
    () =>
      `linear-gradient(to right,
        #3b82f6 0%,
        #3b82f6 20%,
        #22c55e 40%,
        #fde047 58%,
        #f59e0b 76%,
        #ef4444 100%
      )`,
    []
  );

  return (
    <div className="w-full border-t border-black/5 bg-white/40">
      <div className="w-full px-6 pt-6 pb-5">
        <div className="relative">
          <div className="relative h-12 rounded-full overflow-hidden border border-black/10 bg-base-200 shadow-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_18px_rgba(0,0,0,0.25)]">
            <div className="absolute inset-0" style={{ background: gradient }} />
            <div className="absolute inset-0 bg-white/15" />
            <div className="absolute inset-0 flex pointer-events-none opacity-35">
              {Array.from({ length: BUCKETS.length }).map((_, i) => (
                <div key={i} className="flex-1 border-r border-white/60 last:border-r-0" />
              ))}
            </div>
          </div>

          <div
            className="absolute -top-3"
            style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
            aria-label={`Visceral fat marker snapped to ${band.label} midpoint`}
            title={band.label}
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
          {[0, 50, 100, 130, 170, 220, 300].map((v) => (
            <span key={v} className="tabular-nums">
              {v}
            </span>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-5 text-[11px] text-gray-500">
          {BUCKETS.map((b) => (
            <span key={b.label} className="text-center">
              {b.label}
            </span>
          ))}
        </div>

        <div className="mt-2 text-center text-[12px] font-semibold text-gray-700">
          <span className="inline-flex items-center gap-2" aria-label={`Category ${band.label}`}>
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: band.color }} />
            {band.label}
          </span>
        </div>
      </div>
    </div>
  );
}
