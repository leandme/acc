"use client";

import React from "react";

type Gender = "male" | "female";

type Props = {
  estimate?: number | null;
  gender?: Gender;
  className?: string;
};

type BodyFatVisual = {
  title: string;
  percent: number;
  description: string;
};

type BodyFatVisualCard = BodyFatVisual & {
  imageSrc: string;
};

const BODY_FAT_VISUALS: BodyFatVisual[] = [
  {
    title: "Dead (0%)",
    percent: 0,
    description: "Theoretical only. No healthy human body-fat level appears like this in real life.",
  },
  {
    title: "Essential (5%)",
    percent: 5,
    description: "Extremely lean, competition-level look with very pronounced definition and minimal subcutaneous fat.",
  },
  {
    title: "Lean (10%)",
    percent: 10,
    description: "Very lean appearance with visible abs and clear muscle separation in normal lighting.",
  },
  {
    title: "Fit (15%)",
    percent: 15,
    description: "Lean and athletic look with good waist definition and moderate ab visibility.",
  },
  {
    title: "Average (20%)",
    percent: 20,
    description: "Average-fit look with some softness at rest, especially around the midsection.",
  },
  {
    title: "Above Average (25%)",
    percent: 25,
    description: "Noticeable softness through waist and lower torso; definition is limited in most lighting.",
  },
  {
    title: "High (30%)",
    percent: 30,
    description: "Higher body-fat appearance with visible softness through abdomen and reduced contour definition.",
  },
  {
    title: "Very High (35%)",
    percent: 35,
    description: "Substantial overall softness with less visible muscular structure through torso and limbs.",
  },
  {
    title: "Obese (40%)",
    percent: 40,
    description: "Very high body-fat presentation with significant softness and fuller body contours.",
  },
  {
    title: "Morbidly Obese (45%)",
    percent: 45,
    description: "Markedly high body-fat appearance; shape tends to look rounder with minimal visible definition.",
  },
];

const MALE_IMAGE_BY_PERCENT: Record<number, string> = {
  0: "/tools/body-fat-estimator/male-0-body-fat.jpg",
  5: "/tools/body-fat-estimator/male-5-body-fat.jpg",
  10: "/tools/body-fat-estimator/male-10-body-fat.jpg",
  15: "/tools/body-fat-estimator/male-15-body-fat.jpg",
  20: "/tools/body-fat-estimator/male-20-body-fat.jpg",
  25: "/tools/body-fat-estimator/male-25-body-fat.jpg",
  30: "/tools/body-fat-estimator/male-30-body-fat.jpg",
  35: "/tools/body-fat-estimator/male-35-body-fat.jpg",
  40: "/tools/body-fat-estimator/male-40-body-fat.jpg",
  45: "/tools/body-fat-estimator/male-45-body-fat.jpg",
};

const FEMALE_IMAGE_BY_PERCENT: Partial<Record<number, string>> = {
  10: "/tools/body-fat-estimator/female-10-body-fat.jpg",
  15: "/tools/body-fat-estimator/female-15-body-fat.jpg",
  20: "/tools/body-fat-estimator/female-20-body-fat.jpg",
  25: "/tools/body-fat-estimator/female-25-body-fat.jpg",
  30: "/tools/body-fat-estimator/female-30-body-fat.jpg",
  35: "/tools/body-fat-estimator/female-35-body-fat.jpg",
  40: "/tools/body-fat-estimator/female-40-body-fat.jpg",
};

const FEMALE_AVAILABLE_PERCENTS = Object.keys(FEMALE_IMAGE_BY_PERCENT)
  .map((value) => Number(value))
  .filter((value) => Number.isFinite(value))
  .sort((a, b) => a - b);

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

function getClosestAvailablePercent(target: number, available: number[]) {
  if (available.length === 0) return null;
  return available.reduce((closest, current) => {
    return Math.abs(current - target) < Math.abs(closest - target) ? current : closest;
  }, available[0]);
}

function getImageForPercent(gender: Gender, percent: number) {
  if (gender === "male") {
    return MALE_IMAGE_BY_PERCENT[percent];
  }

  const exactFemaleMatch = FEMALE_IMAGE_BY_PERCENT[percent];
  if (exactFemaleMatch) {
    return exactFemaleMatch;
  }

  const closestFemalePercent = getClosestAvailablePercent(percent, FEMALE_AVAILABLE_PERCENTS);
  if (closestFemalePercent !== null) {
    return FEMALE_IMAGE_BY_PERCENT[closestFemalePercent] ?? MALE_IMAGE_BY_PERCENT[percent];
  }

  return MALE_IMAGE_BY_PERCENT[percent];
}

function getVisualCards(gender: Gender): BodyFatVisualCard[] {
  return BODY_FAT_VISUALS.map((item) => ({
    ...item,
    imageSrc: getImageForPercent(gender, item.percent),
  }));
}

export default function EstimateBodyFatLooksLike({
  estimate = null,
  gender = "male",
  className = "",
}: Props) {
  const visuals = React.useMemo(() => getVisualCards(gender), [gender]);

  const selectedPercent =
    typeof estimate === "number" && Number.isFinite(estimate) ? getClosestPercent(estimate) : null;

  const heading =
    selectedPercent !== null
      ? `What ${selectedPercent}% Body Fat Looks Like`
      : "What Your Body Fat % Looks Like";

  return (
    <section className={`w-full max-w-5xl ${className}`}>
      <div className="p-5">
        <h2 className="text-3xl lg:text-4xl font-semibold text-center flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <span>{heading}</span>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-base font-semibold tracking-wide text-gray-700">
            {gender === "female" ? "WOMEN" : "MEN"}
          </span>
        </h2>
        <p className="mt-4 text-center text-lg text-gray-700">
          See what different body-fat percentages can look like, so you can quickly compare your result with realistic visual reference points.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {visuals.map((visual) => {
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
                    alt={`${gender} ${visual.percent}% body fat visual reference`}
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
