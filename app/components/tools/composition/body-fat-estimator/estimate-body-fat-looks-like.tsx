"use client";

import React from "react";

type Props = {
  estimate?: number | null;
  className?: string;
};

type BodyFatVisual = {
  title: string;
  percent: number;
  description: string;
  imageSrc: string;
};

const BODY_FAT_VISUALS: BodyFatVisual[] = [
  {
    title: "Dead (0%)",
    percent: 0,
    description: "Theoretical only. No healthy human body-fat level appears like this in real life.",
    imageSrc: "/tools/body-fat-estimator/male-0-body-fat.jpg",
  },
  {
    title: "Essential (5%)",
    percent: 5,
    description: "Extremely lean, competition-level look with very pronounced definition and minimal subcutaneous fat.",
    imageSrc: "/tools/body-fat-estimator/male-5-body-fat.jpg",
  },
  {
    title: "Lean (10%)",
    percent: 10,
    description: "Very lean appearance with visible abs and clear muscle separation in normal lighting.",
    imageSrc: "/tools/body-fat-estimator/male-10-body-fat.jpg",
  },
  {
    title: "Fit (15%)",
    percent: 15,
    description: "Lean and athletic look with good waist definition and moderate ab visibility.",
    imageSrc: "/tools/body-fat-estimator/male-15-body-fat.jpg",
  },
  {
    title: "Average (20%)",
    percent: 20,
    description: "Average-fit look with some softness at rest, especially around the midsection.",
    imageSrc: "/tools/body-fat-estimator/male-20-body-fat.jpg",
  },
  {
    title: "Above Average (25%)",
    percent: 25,
    description: "Noticeable softness through waist and lower torso; definition is limited in most lighting.",
    imageSrc: "/tools/body-fat-estimator/male-25-body-fat.jpg",
  },
  {
    title: "High (30%)",
    percent: 30,
    description: "Higher body-fat appearance with visible softness through abdomen and reduced contour definition.",
    imageSrc: "/tools/body-fat-estimator/male-30-body-fat.jpg",
  },
  {
    title: "Very High (35%)",
    percent: 35,
    description: "Substantial overall softness with less visible muscular structure through torso and limbs.",
    imageSrc: "/tools/body-fat-estimator/male-35-body-fat.jpg",
  },
  {
    title: "Obese (40%)",
    percent: 40,
    description: "Very high body-fat presentation with significant softness and fuller body contours.",
    imageSrc: "/tools/body-fat-estimator/male-40-body-fat.jpg",
  },
  {
    title: "Morbidly Obese (45%)",
    percent: 45,
    description: "Markedly high body-fat appearance; shape tends to look rounder with minimal visible definition.",
    imageSrc: "/tools/body-fat-estimator/male-45-body-fat.jpg",
  },
];

const MIN_VISUAL_PERCENT = BODY_FAT_VISUALS[0]?.percent ?? 0;
const MAX_VISUAL_PERCENT = BODY_FAT_VISUALS[BODY_FAT_VISUALS.length - 1]?.percent ?? 45;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getClosestPercent(estimate: number) {
  const clamped = clamp(estimate, MIN_VISUAL_PERCENT, MAX_VISUAL_PERCENT);
  return BODY_FAT_VISUALS.reduce((closest, item) => {
    const currentDistance = Math.abs(item.percent - clamped);
    const closestDistance = Math.abs(closest.percent - clamped);
    return currentDistance < closestDistance ? item : closest;
  }, BODY_FAT_VISUALS[0]).percent;
}

export default function EstimateBodyFatLooksLike({ estimate = null, className = "" }: Props) {
  const selectedPercent =
    typeof estimate === "number" && Number.isFinite(estimate) ? getClosestPercent(estimate) : null;

  const heading =
    selectedPercent !== null
      ? `What ${selectedPercent}% Body Fat Looks Like`
      : "What Your Body Fat % Looks Like";

  return (
    <section className={`w-full max-w-5xl ${className}`}>
      <div className="p-5">
        <h2 className="text-3xl lg:text-4xl font-semibold text-center">{heading}</h2>
        <p className="mt-4 text-center text-lg text-gray-700">
          See what different body-fat percentages can look like, so you can quickly compare your result with realistic visual reference points.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {BODY_FAT_VISUALS.map((visual) => {
            const isActive = selectedPercent === visual.percent;

            return (
              <article
                key={visual.percent}
                className={[
                  "overflow-hidden rounded-2xl border bg-white shadow-sm",
                  isActive ? "ring-2 ring-gray-900 border-gray-900/40" : "border-gray-200",
                ].join(" ")}
              >
                <div className="bg-base-100 aspect-[3/4]">
                  <img
                    src={visual.imageSrc}
                    alt={`${visual.percent}% body fat visual reference`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>

                <div className="px-6 pt-4 pb-6">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xl lg:text-2xl font-semibold text-gray-900">{visual.title}</h4>
                    {isActive ? (
                      <span className="inline-flex rounded-full border border-gray-900/20 bg-gray-900/10 px-3 py-1 text-sm font-semibold text-gray-900">
                        Closest Match
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-lg text-gray-700 leading-relaxed">{visual.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
