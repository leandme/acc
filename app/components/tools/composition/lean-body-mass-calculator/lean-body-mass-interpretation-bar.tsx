"use client";

import { useMemo } from "react";
import {
  findLeanMassRange,
  getLeanMassRanges,
  leanMassRangeMidpoint,
  type Gender,
} from "./lbm-ranges";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function LeanBodyMassInterpretationBar({
  leanMassPct,
  gender,
  min = 50,
  max = 98,
}: {
  leanMassPct: number;
  gender: Gender;
  min?: number;
  max?: number;
}) {
  const rows = useMemo(() => getLeanMassRanges(gender), [gender]);
  const band = useMemo(() => findLeanMassRange(gender, leanMassPct), [gender, leanMassPct]);
  const snapped = useMemo(() => leanMassRangeMidpoint(band), [band]);

  const pct = useMemo(() => {
    const v = clamp(snapped, min, max);
    return ((v - min) / (max - min)) * 100;
  }, [snapped, min, max]);

  return (
    <div className="w-full border-t border-black/5 bg-white/40">
      <div className="w-full px-6 pt-6 pb-5">
        <div className="relative">
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
              {Array.from({ length: rows.length }).map((_, i) => (
                <div key={i} className="flex-1 border-r border-white/60 last:border-r-0" />
              ))}
            </div>
          </div>

          <div
            className="absolute -top-3"
            style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
            aria-label={`Lean body mass marker snapped to ${band.label}`}
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
          {[50, 56, 62, 68, 74, 80, 86, 92, 98].map((v) => (
            <span key={v} className="tabular-nums">
              {v}
            </span>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 text-[11px] text-gray-500">
          {rows.map((row) => (
            <span key={row.key} className="text-center">
              {row.label}
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
