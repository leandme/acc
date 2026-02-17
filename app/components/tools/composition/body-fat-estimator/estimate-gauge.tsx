"use client";

import React from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function parsePercent(estimate: string): number | null {
  const m = estimate.match(/(\d+(\.\d+)?)/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

export default function EstimateGauge({
  estimate,
  label = "Body Fat Percentage",
  compact = false,
  variant,
}: {
  estimate: string;
  label?: string;
  compact?: boolean;
  variant?: "default" | "compact" | "export";
}) {
  const gaugeVariant = variant ?? (compact ? "compact" : "default");
  const isCompact = gaugeVariant === "compact";
  const isExport = gaugeVariant === "export";

  const p = parsePercent(estimate);

  const min = 0;
  const max = 60;
  const tickStep = 10;

  const t = p === null ? 0.5 : (clamp(p, min, max) - min) / (max - min);

  const geom = isExport
    ? {
        w: 500,
        h: 310,
        cx: 250,
        cy: 240,
        r: 195,
        stroke: 18,
      }
    : isCompact
    ? {
        w: 330,
        h: 208,
        cx: 165,
        cy: 166,
        r: 130,
        stroke: 13,
      }
    : {
        w: 360,
        h: 220,
        cx: 180,
        cy: 175,
        r: 140,
        stroke: 14,
      };

  const pad = 24;

  // Arc from left (180deg) to right (0deg).
  const startAngle = Math.PI;
  const endAngle = 0;
  const markerAngle = startAngle + (endAngle - startAngle) * t;
  const markerAngleDeg = (markerAngle * 180) / Math.PI;

  const startX = geom.cx - geom.r;
  const startY = geom.cy;
  const endX = geom.cx + geom.r;
  const endY = geom.cy;

  // Triangle dimensions
  const triW = isExport ? 20 : isCompact ? 15 : 16;
  const triH = isExport ? 16 : isCompact ? 13 : 14;

  const tickValues = Array.from({ length: (max - min) / tickStep + 1 }, (_, i) => min + i * tickStep);
  const ticks = tickValues.map((value) => {
    const tt = (value - min) / (max - min);
    const a = startAngle + (endAngle - startAngle) * tt;

    const cos = Math.cos(a);
    const sin = Math.sin(a);

    const rMid = geom.r;
    const tickOffset = isExport ? 8 : isCompact ? 5 : 6;
    const rOuter = rMid + tickOffset;
    const rInner = rMid - tickOffset;

    return {
      x1: geom.cx + cos * rInner,
      y1: geom.cy - sin * rInner,
      x2: geom.cx + cos * rOuter,
      y2: geom.cy - sin * rOuter,
      key: value,
    };
  });

  // Triangle is defined with its tip at (0,0). Put the tip on the arc edge.
  const cosM = Math.cos(markerAngle);
  const sinM = Math.sin(markerAngle);
  const markerRadius = geom.r + geom.stroke / 2 + 1;
  const mx = geom.cx + cosM * markerRadius;
  const my = geom.cy - sinM * markerRadius;

  // Local triangle points "up", so rotate to aim inward along the radius.
  const markerRotateDeg = 270 - markerAngleDeg;



  return (
    <div className="w-full flex justify-center">
      <div
        className={`relative w-full ${
          isExport
            ? "max-w-[36rem]"
            : isCompact
            ? "max-w-[20.5rem] sm:max-w-[22rem]"
            : "max-w-sm sm:max-w-md"
        }`}
      >
        <svg
          viewBox={`${-pad} ${-pad} ${geom.w + pad * 2} ${geom.h + pad * 2}`}
          className="w-full h-auto block"
        >

          <defs>
            <linearGradient id="bfGradient" x1="0" y1="0" x2="1" y2="0">
              {/* Essential / very low */}
              <stop offset="0%" stopColor="#3b82f6" />     {/* blue-500 */}
              <stop offset="12%" stopColor="#06b6d4" />    {/* cyan-500 (nice bridge) */}

              {/* Lean / athletic */}
              <stop offset="25%" stopColor="#22c55e" />    {/* green-500 */}

              {/* Average */}
              <stop offset="55%" stopColor="#facc15" />    {/* yellow-400 */}

              {/* Higher */}
              <stop offset="100%" stopColor="#ef4444" />   {/* red-500 */}
            </linearGradient>


            <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.18" />
            </filter>
          </defs>

          {/* Arc */}
          <path
            d={`M ${startX} ${startY} A ${geom.r} ${geom.r} 0 0 1 ${endX} ${endY}`}
            fill="none"
            stroke="url(#bfGradient)"
            strokeWidth={geom.stroke}
            strokeLinecap="round"
            filter="url(#softShadow)"
          />

          {/* Ticks every 10% */}
          {ticks.map((tick) => (
            <line
              key={tick.key}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke="#111827"
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={0.55}
            />
          ))}

          {/* Marker */}
          <g transform={`translate(${mx}, ${my}) rotate(${markerRotateDeg})`} filter="url(#softShadow)">
            <path d={`M 0 0 L ${-triW / 2} ${triH} L ${triW / 2} ${triH} Z`} fill="#111827" />
          </g>

        </svg>

        {/* Number + label inside the arc */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-end ${
            isExport ? "pb-20" : isCompact ? "pb-11 sm:pb-12" : "pb-14"
          }`}
        >
          <div className="text-center">
            <div className="flex items-start justify-center gap-1">
                <span
                  className={`font-extrabold tracking-tight leading-none ${
                    isExport
                      ? "text-[6.2rem]"
                      : isCompact
                      ? "text-5xl sm:text-6xl"
                      : "text-5xl sm:text-6xl"
                  }`}
                >
                  {estimate}
                </span>
                <span
                  className={`font-extrabold leading-none mt-1 text-gray-800 ${
                    isExport
                      ? "text-[2.5rem]"
                      : isCompact
                      ? "text-xl sm:text-2xl"
                      : "text-xl sm:text-2xl"
                  }`}
                >
                  %
                </span>
              </div>
            <div
              className={`text-gray-500 ${
                isExport
                  ? "mt-5 text-[2.3rem]"
                  : isCompact
                  ? "mt-3 text-sm sm:text-base"
                  : "mt-4 text-sm sm:text-lg"
              }`}
            >
              {label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
