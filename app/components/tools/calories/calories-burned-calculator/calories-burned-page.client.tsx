"use client";

import { useState } from "react";
import { round } from "@/app/components/tools/body-weight/shared/math";
import CaloriesBurnedCalculator from "@/app/components/tools/calories/calories-burned-calculator/calories-burned-calculator";
import CaloriesBurnedInterpretation from "@/app/components/tools/calories/calories-burned-calculator/calories-burned-interpretation";
import { MoreTools } from "../../template/more-tools";

export default function CaloriesBurnedPageClient() {
  const [activityLabel, setActivityLabel] = useState<string | null>(null);
  const [met, setMet] = useState<number | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [sessionsPerWeek, setSessionsPerWeek] = useState<number | null>(null);
  const [activeCalories, setActiveCalories] = useState<number | null>(null);
  const [totalCalories, setTotalCalories] = useState<number | null>(null);
  const [weeklyActiveCalories, setWeeklyActiveCalories] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Calories Burned Calculator – Select Any Activity</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate calories burned for walking, running, cycling, HIIT, strength training, and many other
          activities using MET-based energy equations.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <CaloriesBurnedCalculator
              onChange={({
                activityLabel,
                met,
                durationMinutes,
                sessionsPerWeek,
                activeCalories,
                totalCalories,
                weeklyActiveCalories,
              }) => {
                setActivityLabel(activityLabel);
                setMet(met);
                setDurationMinutes(durationMinutes);
                setSessionsPerWeek(sessionsPerWeek);
                setActiveCalories(activeCalories);
                setTotalCalories(totalCalories);
                setWeeklyActiveCalories(weeklyActiveCalories);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20" id="calories-burned-interpretation">
          <CaloriesBurnedInterpretation activeCalories={activeCalories} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Calories Burned Calculator Estimates</h2>
          <p className={pClass}>
            This tool estimates session calorie burn from three inputs: activity MET value, body weight,
            and duration. It reports both total calories and active calories above resting metabolism.
          </p>
          {activityLabel &&
          met != null &&
          durationMinutes != null &&
          activeCalories != null &&
          totalCalories != null &&
          weeklyActiveCalories != null &&
          sessionsPerWeek != null ? (
            <p className={pClass}>
              Current setup: <strong>{activityLabel}</strong> (MET {met}) for{" "}
              <strong>{durationMinutes} minutes</strong>, about{" "}
              <strong>{Math.round(activeCalories)} active kcal</strong> and{" "}
              <strong>{Math.round(totalCalories)} total kcal</strong> per session, with{" "}
              <strong>{Math.round(weeklyActiveCalories)} active kcal/week</strong> across{" "}
              <strong>{sessionsPerWeek} sessions</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Formula Used</h2>
          <p className={pClass}>Calculations follow standard MET energy equations:</p>
          <div className="rounded-2xl border bg-white p-6 text-sm sm:text-base text-gray-800 overflow-x-auto">
            <p className="font-mono">Total kcal = MET x body weight (kg) x duration (hours)</p>
            <p className="font-mono mt-2">Active kcal = (MET - 1) x body weight (kg) x duration (hours)</p>
          </div>
          <p className={pClass}>
            MET values are representative activity benchmarks and can vary with pace, technique, terrain,
            and fitness level.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use This for Planning</h2>
          <p className={pClass}>
            Use this as your movement-expenditure layer, then align intake targets with your actual training
            week. For maintenance setup, run the{" "}
            <a className="text-primary underline" href="/tdee-calculator">
              TDEE Calculator
            </a>
            {" "}or the{" "}
            <a className="text-primary underline" href="/calorie-calculator">
              Calorie Calculator
            </a>
            . For intake targeting, use the{" "}
            <a className="text-primary underline" href="/calorie-deficit-calculator">
              Calorie Deficit Calculator
            </a>{" "}
            and convert calories into macros in the{" "}
            <a className="text-primary underline" href="/macro-calculator">
              Macro Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            If your primary movement target is step count, compare this with the{" "}
            <a className="text-primary underline" href="/steps-to-calories-calculator">
              Steps to Calories Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Compendium of Physical Activities update (MET values):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/21681120/">
                2011 Compendium of Physical Activities
              </a>
            </li>
            <li>
              CDC physical activity guidelines:
              <a className="text-primary underline ml-1" href="https://www.cdc.gov/physical-activity-basics/guidelines/index.html">
                Physical Activity Guidelines for Americans
              </a>
            </li>
            <li>
              NIH/NIDDK dynamic energy-balance context:
              <a className="text-primary underline ml-1" href="https://www.niddk.nih.gov/bwp">
                NIDDK Body Weight Planner
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <MoreTools
            heading="More Tools"
            columns={2}
            toolSlugs={[
              "calorie-calculator",
              "steps-to-calories-calculator",
              "tdee-calculator",
              "calorie-deficit-calculator",
              "macro-calculator",
              "bmr-calculator",
              "weight-loss-calculator",
              "intermittent-fasting-calculator",
              "calorie-counter",
            ]}
            excludeSlug="calories-burned-calculator"
          />
        </div>
      </section>
    </main>
  );
}
