"use client";

import React, { useMemo } from "react";

type Accuracy = "low" | "medium" | "high";

type Props = {
  accuracy?: Accuracy | null;
  improvements?: string[] | null;
  className?: string;

  // ✅ NEW
  onImproveAccuracy?: () => void;
  improveCtaLabel?: string;
};

function toUpper(acc: Accuracy) {
  return acc.toUpperCase() as "LOW" | "MEDIUM" | "HIGH";
}

function getBadgeClasses(acc: Accuracy) {
  switch (acc) {
    case "low":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "high":
      return "bg-green-100 text-green-800 border-green-200";
  }
}

function getCopy(acc: Accuracy) {
  if (acc === "low") {
    return {
      lead:
        "This estimate is more sensitive to photo quality than usual. A few quick tweaks can noticeably improve accuracy.",
      bullets: [
        "Use bright, even lighting (window light or a well-lit room).",
        "Step back a bit and keep the camera at mid-torso height to reduce wide-angle distortion.",
        "Include at least two angles: front + side (a back angle helps even more).",
        "Include the full body down to mid-thigh (legs matter for fat distribution).",
      ],
    };
  }

  if (acc === "medium") {
    return {
      lead:
        "This estimate is probably in the right ballpark. A couple of improvements can make it more consistent and easier to compare over time.",
      bullets: [
        "Add a side photo (and back if you can) to capture fat distribution more reliably.",
        "Make sure the waist and lower abdomen are clearly visible.",
        "Include a shot that shows thighs/glutes—those areas can change the read a lot.",
        "Optional: add height + weight to tighten the estimate and reduce guesswork.",
      ],
    };
  }

  return {
    lead:
      "This estimate is based on a high-quality photo and should be fairly reliable as a visual reference. Keep the same approach for clean progress tracking.",
    bullets: [
      "Include front + side angles when possible—small changes show up more clearly across views.",
      "Optional: add height + weight to further tighten the estimate (especially if you’re tracking changes).",
      "Try to keep the full body visible (including thighs) so fat distribution is captured consistently.",
    ],
  };
}

export default function EstimateAccuracy({
  accuracy = "medium",
  improvements = null,
  className = "",
  onImproveAccuracy,
  improveCtaLabel = "Improve Accuracy →",
}: Props) {
  const acc: Accuracy =
    accuracy === "low" || accuracy === "medium" || accuracy === "high"
      ? accuracy
      : "medium";

  const badgeText = useMemo(() => toUpper(acc), [acc]);
  const badgeClasses = useMemo(() => getBadgeClasses(acc), [acc]);
  const copy = useMemo(() => getCopy(acc), [acc]);

  const items = useMemo(() => {
    const cleaned =
      (improvements ?? [])
        .map((s) => (typeof s === "string" ? s.trim() : ""))
        .filter(Boolean) ?? [];

    return cleaned.length > 0 ? cleaned : copy.bullets;
  }, [improvements, copy.bullets]);

  const lead = useMemo(() => {
    const hasModelTips =
      (improvements ?? []).some((s) => typeof s === "string" && s.trim().length > 0);

    return hasModelTips ? "How to improve accuracy next time:" : copy.lead;
  }, [improvements, copy.lead]);

  return (
    <section className={`w-full max-w-3xl ${className}`}>
      <div className="p-5">
        <h2 className="text-3xl lg:text-4xl font-semibold text-center flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <span>How Accurate is My Estimate?</span>

          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-base font-semibold tracking-wide ${badgeClasses}`}
          >
            {badgeText}
          </span>
        </h2>

        <p className="mt-4 text-gray-700 text-lg leading-relaxed">{lead}</p>

        <ol className="mt-6 list-decimal pl-6 text-gray-700 space-y-2 text-lg">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            className="btn btn-primary btn-lg text-white"
            onClick={onImproveAccuracy}
          >
            {improveCtaLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
