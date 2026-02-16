"use client";

import { useMemo } from "react";
import { findFrameRange, getFrameRanges, rangeMidpoint, type Sex } from "./frame-ranges";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function FrameInterpretationBar({
  ratio,
  sex,
  min = 8.5,
  max = 12.2,
}: {
  ratio: number;
  sex: Sex;
  min?: number;
  max?: number;
}) {
  const ranges = useMemo(() => getFrameRanges(sex), [sex]);
  const band = useMemo(() => findFrameRange(sex, ratio), [sex, ratio]);
  const snapped = useMemo(() => rangeMidpoint(band.min, band.max), [band.min, band.max]);

  const pct = useMemo(() => {
    const v = clamp(snapped, min, max);
    return ((v - min) / (max - min)) * 100;
  }, [snapped, min, max]);

  const gradient = useMemo(
    () =>
      `linear-gradient(to right,
        #f97316 0%,
        #f97316 25%,
        #22c55e 50%,
        #3b82f6 100%
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
              {Array.from({ length: ranges.length }).map((_, i) => (
                <div key={i} className="flex-1 border-r border-white/60 last:border-r-0" />
              ))}
            </div>
          </div>

          <div
            className="absolute -top-3"
            style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
            aria-label={`Frame-size marker snapped to ${band.label} midpoint`}
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
          {[8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12].map((v) => (
            <span key={v} className="tabular-nums">
              {v.toFixed(1)}
            </span>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-3 text-[11px] text-gray-500">
          <span className="text-center">Large</span>
          <span className="text-center">Medium</span>
          <span className="text-center">Small</span>
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
