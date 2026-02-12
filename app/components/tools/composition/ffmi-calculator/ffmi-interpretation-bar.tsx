// app/components/tools/composition/ffmi-calculator/ffmi-interpretation-bar.tsx
"use client";

import React, { useMemo } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// ✅ Same buckets + colors as the calculator (keep in sync)
const FFMI_BUCKETS: Array<{
  label: string;
  min: number;
  max: number;
  color: string;
}> = [
  { label: "Below Average", min: 0, max: 18, color: "#ef4444" },
  { label: "Average", min: 18, max: 20, color: "#f97316" },
  { label: "Above Average", min: 20, max: 22, color: "#fde047" },
  { label: "Excellent", min: 22, max: 24, color: "#22c55e" },
  { label: "Superior", min: 24, max: 26, color: "#10b981" },
  { label: "Suspicious", min: 26, max: 28, color: "#3b82f6" },
  { label: "Unlikely", min: 28, max: 100, color: "#7c3aed" },
];

function bucketFor(ffmi: number) {
  return (
    FFMI_BUCKETS.find((b) => ffmi >= b.min && ffmi < b.max) ?? FFMI_BUCKETS[0]
  );
}

function midpoint(b: { min: number; max: number }) {
  return (b.min + b.max) / 2;
}

/**
 * Smooth-gradient FFMI interpretation bar that spans full width.
 * ✅ Marker snaps to category MIDPOINTS (not raw value).
 * ✅ Marker is BLACK (high contrast).
 */
export default function FFMIInterpretationBar({
  ffmi,
  min = 16,
  max = 30,
}: {
  ffmi: number;
  min?: number;
  max?: number;
}) {
  const band = useMemo(() => bucketFor(ffmi), [ffmi]);

  // ✅ snap to category midpoint
  const snapped = useMemo(() => midpoint(band), [band]);

  // marker position across visible bar range (like your screenshot: 16..30)
  const pct = useMemo(() => {
    const v = clamp(snapped, min, max);
    return ((v - min) / (max - min)) * 100;
  }, [snapped, min, max]);

  return (
    <div className="w-full border-t border-black/5 bg-white/40">
      <div className="w-full px-6 pt-6 pb-5">
        {/* Bar wrapper (NOT clipped) */}
        <div className="relative">
          {/* Actual bar (clipped) */}
          <div className="relative h-12 rounded-full overflow-hidden border border-black/10 bg-base-200 shadow-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_18px_rgba(0,0,0,0.25)]">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right,
                  #ef4444 0%,
                  #ef4444 12%,

                  #f97316 18%,
                  #f97316 26%,

                  #fde047 32%,
                  #fde047 40%,

                  #22c55e 46%,
                  #22c55e 54%,

                  #10b981 60%,
                  #10b981 68%,

                  #3b82f6 74%,
                  #3b82f6 82%,

                  #7c3aed 88%,
                  #7c3aed 100%
                )`,
              }}
            />

            <div className="absolute inset-0 bg-white/15" />

            <div className="absolute inset-0 flex pointer-events-none opacity-35">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 border-r border-white/60 last:border-r-0"
                />
              ))}
            </div>
          </div>

          {/* ✅ Marker (NOT clipped) */}
          <div
            className="absolute -top-3"
            style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
            aria-label={`FFMI marker snapped to ${band.label} midpoint`}
            title={`${band.label}`}
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

        {/* Numeric ticks */}
        <div className="mt-4 flex justify-between text-[11px] text-gray-600">
          {[16, 18, 20, 22, 24, 26, 28, 30].map((v) => (
            <span key={v} className="tabular-nums">
              {v}
            </span>
          ))}
        </div>

        {/* Category labels */}
        <div className="mt-2 flex justify-between text-[11px] text-gray-500">
          <span>Below</span>
          <span>Average</span>
          <span>Above</span>
          <span>Excellent</span>
          <span>Superior</span>
          <span>Suspicious</span>
          <span>Unlikely</span>
        </div>

        {/* Optional: show what band you're in (tiny) */}
        <div className="mt-2 text-center text-[12px] font-semibold text-gray-700">
          <span
            className="inline-flex items-center gap-2"
            aria-label={`Category ${band.label}`}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: band.color }}
            />
            {band.label}
          </span>
        </div>
      </div>
    </div>
  );
}
