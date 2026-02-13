"use client";

import { useMemo } from "react";

type Sex = "male" | "female";

type Bucket = {
  label: string;
  min: number;
  max: number;
  color: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const MALE_BUCKETS: Bucket[] = [
  { label: "Essential", min: 0, max: 6, color: "#3b82f6" },
  { label: "Athletic", min: 6, max: 14, color: "#22c55e" },
  { label: "Fitness", min: 14, max: 18, color: "#fde047" },
  { label: "Average", min: 18, max: 25, color: "#f59e0b" },
  { label: "High", min: 25, max: 100, color: "#ef4444" },
];

const FEMALE_BUCKETS: Bucket[] = [
  { label: "Essential", min: 0, max: 14, color: "#3b82f6" },
  { label: "Athletic", min: 14, max: 21, color: "#22c55e" },
  { label: "Fitness", min: 21, max: 25, color: "#fde047" },
  { label: "Average", min: 25, max: 32, color: "#f59e0b" },
  { label: "High", min: 32, max: 100, color: "#ef4444" },
];

function getBuckets(sex: Sex) {
  return sex === "female" ? FEMALE_BUCKETS : MALE_BUCKETS;
}

function bucketFor(sex: Sex, value: number) {
  const buckets = getBuckets(sex);
  return buckets.find((b) => value >= b.min && value < b.max) ?? buckets[buckets.length - 1];
}

function midpoint(bucket: Bucket) {
  return (bucket.min + bucket.max) / 2;
}

export default function RFMInterpretationBar({
  rfm,
  sex,
  min = 5,
  max = 45,
}: {
  rfm: number;
  sex: Sex;
  min?: number;
  max?: number;
}) {
  const buckets = useMemo(() => getBuckets(sex), [sex]);
  const band = useMemo(() => bucketFor(sex, rfm), [sex, rfm]);
  const snapped = useMemo(() => midpoint(band), [band]);

  const pct = useMemo(() => {
    const v = clamp(snapped, min, max);
    return ((v - min) / (max - min)) * 100;
  }, [snapped, min, max]);

  const gradient = useMemo(
    () =>
      `linear-gradient(to right,
        #3b82f6 0%,
        #3b82f6 15%,
        #22c55e 35%,
        #fde047 55%,
        #f59e0b 75%,
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
              {Array.from({ length: buckets.length }).map((_, i) => (
                <div key={i} className="flex-1 border-r border-white/60 last:border-r-0" />
              ))}
            </div>
          </div>

          <div
            className="absolute -top-3"
            style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
            aria-label={`RFM marker snapped to ${band.label} midpoint`}
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
          {[5, 10, 15, 20, 25, 30, 35, 40, 45].map((v) => (
            <span key={v} className="tabular-nums">
              {v}
            </span>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-5 text-[11px] text-gray-500">
          {buckets.map((b) => (
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
