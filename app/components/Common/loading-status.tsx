"use client";

import React, { useEffect, useState } from "react";
import RippleLoader from "./loader";

const ROTATION_MS = 7000;

const STATUS_MESSAGES = [
  {
    title: "Analyzing your photo…",
    body: "We’re starting with a visual analysis of fat distribution and proportions.",
  },
  {
    title: "Cross-referencing proven body fat models…",
    body: "We compare visual markers against patterns derived from validated methods like DEXA and multi-frequency BIA to estimate body fat as accurately as possible from an image.",
  },
  {
    title: "Evaluating fat distribution and structure…",
    body: "We look at how fat and muscle are distributed across the torso, waist, limbs, and posture — not just one area — to avoid misleading single-angle estimates.",
  },
  {
    title: "Calibrating for lighting and perspective…",
    body: "Lighting, camera distance, and posture can affect appearance. We adjust for these factors to keep the estimate grounded and consistent.",
  },
  {
    title: "Finalizing your estimate…",
    body: "Adding optional details like height, weight, or more images can further improve precision — especially for tracking changes over time.",
  },
];


export default function LoadingStatus() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % STATUS_MESSAGES.length);
    }, ROTATION_MS);

    return () => clearInterval(id);
  }, []);

  const msg = STATUS_MESSAGES[index];

  return (
    <div className="flex flex-col items-center justify-center text-center gap-6">
      <RippleLoader />

      <div className="space-y-2">
        <p className="text-lg font-semibold text-gray-800">{msg.title}</p>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">{msg.body}</p>
      </div>
    </div>
  );
}
