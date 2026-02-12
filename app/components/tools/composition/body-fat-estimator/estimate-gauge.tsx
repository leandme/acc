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
}: {
  estimate: string;
  label?: string;
}) {
  const p = parsePercent(estimate);

  const min = 0;
  const max = 60;

  const t = p === null ? 0.5 : (clamp(p, min, max) - min) / (max - min); // 0..1

  const geom = {
    w: 360,
    h: 220,
    cx: 180,
    cy: 175,
    r: 140,
    stroke: 14,
  };

  const pad = 24;

  // Arc from left (180°) to right (0°)
  const startAngle = Math.PI;
  const endAngle = 0;
  const angle = startAngle + (endAngle - startAngle) * t;

  const startX = geom.cx - geom.r;
  const startY = geom.cy;
  const endX = geom.cx + geom.r;
  const endY = geom.cy;

  // Triangle dimensions
  const triW = 16;
  const triH = 14;

  const tickValues = [10, 20, 30, 40, 50];

const tickSteps = 6; // 0..6 gives 7 marks including ends
const ticks = Array.from({ length: tickSteps + 1 }, (_, i) => {
  const tt = i / tickSteps; // 0..1 evenly spaced
  const a = startAngle + (endAngle - startAngle) * tt;

  const cos = Math.cos(a);
  const sin = Math.sin(a);

  const rMid = geom.r;
  const rOuter = rMid + 6;
  const rInner = rMid - 6;

  return {
    x1: geom.cx + cos * rInner,
    y1: geom.cy - sin * rInner,
    x2: geom.cx + cos * rOuter,
    y2: geom.cy - sin * rOuter,
    key: i,
  };
});

// --- Marker at 12 o'clock (top center) ---
const ttMarker = t; // your computed t from estimate

const aMarker = startAngle + (endAngle - startAngle) * ttMarker;

const cosM = Math.cos(aMarker);
const sinM = Math.sin(aMarker);

// position on the OUTER edge of the stroke
const rMarkerBase = geom.r + geom.stroke / 2;

// push the marker OUTWARD (increase this)
const markerOffset = 14; // try 10–20
const rMarker = rMarkerBase + markerOffset;

const mx = geom.cx + cosM * rMarker;
const my = geom.cy - sinM * rMarker;

// rotate triangle so it points inward (toward the center)
const markerRotateDeg = (aMarker * 180) / Math.PI + 90;

const essentialMax = 6;   // essential fat
const leanMax = 14;       // lean / athletic
const averageMax = 25;    // average
const highMax = 40;       // high

const toPct = (v: number) => ((v - min) / (max - min)) * 100;



  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-sm sm:max-w-md">
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

            {/* Ticks every 10% (with halo so they show on gradient) */}
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

{/* Marker (black arrow) at 12 o'clock */}
<g transform={`translate(${mx}, ${my}) rotate(${markerRotateDeg})`} filter="url(#softShadow)">
  {/* Triangle points "down" in its local coords; rotation handles direction */}
  <path
    d={`M 0 0 L ${-triW / 2} ${triH} L ${triW / 2} ${triH} Z`}
    fill="#111827"
  />
</g>

        </svg>

                        {/* Number + label inside the arc */}
                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-14">
                        <div className="text-center">
                            <div className="flex items-start justify-center gap-1">
                <span className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none">
                    {estimate}
                </span>
                <span className="text-xl sm:text-2xl font-extrabold leading-none mt-1 text-gray-800">
                    %
                </span>
                </div>
            <div className="mt-4 text-sm sm:text-lg text-gray-500">{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
