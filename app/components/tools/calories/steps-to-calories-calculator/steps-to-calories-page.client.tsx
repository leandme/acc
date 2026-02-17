"use client";

import { useState } from "react";
import StepsToCaloriesCalculator from "@/app/components/tools/calories/steps-to-calories-calculator/steps-to-calories-calculator";
import StepsToCaloriesInterpretation from "@/app/components/tools/calories/steps-to-calories-calculator/steps-to-calories-interpretation";
import { round } from "@/app/components/tools/body-weight/shared/math";
import { MoreTools } from "../../template/more-tools";

export default function StepsToCaloriesPageClient() {
  const [stepsPerDay, setStepsPerDay] = useState<number | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [activeCalories, setActiveCalories] = useState<number | null>(null);
  const [totalCalories, setTotalCalories] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Steps to Calories Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate calories burned from walking steps using your body weight and a stride length derived from your height.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <StepsToCaloriesCalculator
              onChange={({ stepsPerDay, distanceKm, durationMinutes, activeCalories, totalCalories }) => {
                setStepsPerDay(stepsPerDay);
                setDistanceKm(distanceKm);
                setDurationMinutes(durationMinutes);
                setActiveCalories(activeCalories);
                setTotalCalories(totalCalories);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40" id="steps-to-calories-interpretation">
          <StepsToCaloriesInterpretation stepsPerDay={stepsPerDay} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Steps to Calories Calculator Estimates</h2>
          <p className={pClass}>
            This calculator estimates walking energy expenditure from step count, body weight, and a
            height-based stride estimate. It outputs both active calories (above rest) and total calories
            (including resting metabolism during the walk) using a standard pace assumption.
          </p>
          {stepsPerDay != null &&
          distanceKm != null &&
          durationMinutes != null &&
          activeCalories != null &&
          totalCalories != null ? (
            <p className={pClass}>
              Current setup: <strong>{stepsPerDay.toLocaleString()} steps/day</strong>, about{" "}
              <strong>{round(distanceKm, 2)} km</strong> in <strong>{Math.round(durationMinutes)} minutes</strong>, for around{" "}
              <strong>{Math.round(activeCalories)} active kcal</strong> and{" "}
              <strong>{Math.round(totalCalories)} total kcal</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use This for Calorie Planning</h2>
          <p className={pClass}>
            Use this as a movement planning layer on top of your baseline maintenance estimate. If your
            daily steps increase, your calorie needs usually increase too. Keep intake targets synced with
            actual movement patterns.
          </p>
          <p className={pClass}>
            For full maintenance setup, run the{" "}
            <a className="text-primary underline" href="/tdee-calculator">
              TDEE Calculator
            </a>
            . Then convert maintenance into a goal intake with the{" "}
            <a className="text-primary underline" href="/calorie-deficit-calculator">
              Calorie Deficit Calculator
            </a>{" "}
            and timeline-check the pace in the{" "}
            <a className="text-primary underline" href="/weight-loss-calculator">
              Weight Loss Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Important Assumptions and Limits</h2>
          <p className={pClass}>
            Step-based calorie burn is an estimate. Real burn changes with terrain, incline, carrying load,
            walking economy, and device step-count error.
          </p>
          <p className={pClass}>
            Stride length is estimated automatically from the height you enter.
          </p>
          <p className={pClass}>
            Duration is estimated using a fixed walking pace assumption rather than a custom cadence input.
          </p>
          <p className={pClass}>
            Treat this as directional planning for weekly averages, not precise single-day accounting.
            Recalibrate with body-weight trend data every 2 to 4 weeks.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Compendium of Physical Activities update (MET values for walking):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/21681120/">
                2011 Compendium of Physical Activities
              </a>
            </li>
            <li>
              Practical adult steps/day indices:
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/21798015/">
                How Many Steps/Day Are Enough? for Adults
              </a>
            </li>
            <li>
              Step cadence and intensity thresholds:
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/31698337/">
                Walking Cadence and Intensity in Adults
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <MoreTools
            heading="More Tools"
            columns={2}
            toolSlugs={[
              "tdee-calculator",
              "calorie-deficit-calculator",
              "weight-loss-calculator",
              "intermittent-fasting-calculator",
              "fasting-weight-loss-calculator",
              "bmr-calculator",
              "bmi-calculator",
            ]}
            excludeSlug="steps-to-calories-calculator"
          />
        </div>
      </section>
    </main>
  );
}
