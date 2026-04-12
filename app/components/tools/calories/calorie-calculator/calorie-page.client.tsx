"use client";

import { useState } from "react";
import { round } from "@/app/components/tools/body-weight/shared/math";
import CalorieCalculator from "./calorie-calculator";
import CalorieInterpretation from "./calorie-interpretation";
import { MoreTools } from "../../template/more-tools";

export default function CalorieCalculatorPageClient() {
  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [targetCalories, setTargetCalories] = useState<number | null>(null);
  const [adjustmentPct, setAdjustmentPct] = useState<number | null>(null);
  const [activityFactor, setActivityFactor] = useState<number | null>(null);
  const [activityLabel, setActivityLabel] = useState<string | null>(null);
  const [goalLabel, setGoalLabel] = useState<string | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Calorie Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate how many calories you need per day for maintenance, fat loss, or lean gain using your
          profile and activity level.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <CalorieCalculator
              onChange={({ bmr, tdee, targetCalories, adjustmentPct, activityFactor, activityLabel, goalLabel }) => {
                setBmr(bmr);
                setTdee(tdee);
                setTargetCalories(targetCalories);
                setAdjustmentPct(adjustmentPct);
                setActivityFactor(activityFactor);
                setActivityLabel(activityLabel);
                setGoalLabel(goalLabel);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40" id="calorie-calculator-interpretation">
          <CalorieInterpretation adjustmentPct={adjustmentPct} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How This Calorie Calculator Works</h2>
          <p className={pClass}>
            This calorie calculator first estimates your BMR (resting energy use), then scales it by
            activity level to estimate maintenance calories (TDEE). It then applies your selected intake
            adjustment to generate a practical daily calorie target.
          </p>
          {bmr != null && tdee != null && targetCalories != null && adjustmentPct != null && activityFactor != null && activityLabel && goalLabel ? (
            <p className={pClass}>
              Current estimate: BMR <strong>{Math.round(bmr)} kcal/day</strong>, maintenance{" "}
              <strong>{Math.round(tdee)} kcal/day</strong> at <strong>{activityLabel}</strong> (
              {round(activityFactor, 2)}x), with a <strong>{adjustmentPct > 0 ? "+" : ""}{round(adjustmentPct, 1)}%</strong>{" "}
              adjustment for <strong>{goalLabel}</strong>, which gives about{" "}
              <strong>{Math.round(targetCalories)} kcal/day</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How Many Calories Do You Need?</h2>
          <p className={pClass}>
            Most people do best starting with a moderate target and adjusting from 2 to 4 weeks of trend
            data. If weekly body-weight trend is moving too fast or too slow, change intake in small steps
            (for example 100 to 200 kcal/day), then reassess.
          </p>
          <p className={pClass}>
            For maintenance-only estimation, compare with the{" "}
            <a className="text-primary underline" href="/tdee-calculator">
              TDEE Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/bmr-calculator">
              BMR Calculator
            </a>
            . For weekly fat-loss pacing, use the{" "}
            <a className="text-primary underline" href="/calorie-deficit-calculator">
              Calorie Deficit Calculator
            </a>
            . If you want grams of protein, carbs, and fat from your target calories, use the{" "}
            <a className="text-primary underline" href="/macro-calculator">
              Macro Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            You can also cross-check real intake with the{" "}
            <a className="text-primary underline" href="/calorie-counter">
              Calorie Counter
            </a>{" "}
            for meal-photo estimates, and model movement output with the{" "}
            <a className="text-primary underline" href="/steps-to-calories-calculator">
              Steps to Calories Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/calories-burned-calculator">
              Calories Burned Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Practical Setup Tips</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Choose the smallest calorie change that still drives measurable progress.</li>
            <li>Keep protein and resistance training stable when running a deficit.</li>
            <li>Track weekly averages, not single-day scale changes.</li>
            <li>Recalculate targets after meaningful body-weight change.</li>
            <li>Use consistent weigh-in conditions (same time of day, similar hydration).</li>
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Important Limits</h2>
          <p className={pClass}>
            Equation-based calorie needs are estimates, not direct measurements. Real energy expenditure can
            differ due to lean mass, non-exercise activity, sleep, stress, medication effects, and adaptive
            metabolic changes over time.
          </p>
          <p className={pClass}>
            Use this tool for planning and iteration, then calibrate with objective trend data. If you use
            fasting windows with variable intake days, compare with the{" "}
            <a className="text-primary underline" href="/intermittent-fasting-calculator">
              Intermittent Fasting Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/fasting-weight-loss-calculator">
              Fasting Weight Loss Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Mifflin-St Jeor resting energy equation (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/2305711/">
                A New Predictive Equation for Resting Energy Expenditure
              </a>
            </li>
            <li>
              Revised Harris-Benedict equation (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/6741850/">
                The Harris Benedict Equation Reevaluated
              </a>
            </li>
            <li>
              Dietary Reference Intakes for energy requirements (NCBI):
              <a className="text-primary underline ml-1" href="https://www.ncbi.nlm.nih.gov/books/NBK56068/">
                Dietary Reference Intakes for Energy
              </a>
            </li>
            <li>
              Dynamic energy-balance model and limitations of static calorie rules (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/21872751/">
                Why Is the 3500 kcal per Pound Weight Loss Rule Wrong?
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
              "bmr-calculator",
              "calorie-deficit-calculator",
              "macro-calculator",
              "weight-loss-calculator",
              "intermittent-fasting-calculator",
              "fasting-weight-loss-calculator",
              "steps-to-calories-calculator",
              "calories-burned-calculator",
              "calorie-counter",
            ]}
            excludeSlug="calorie-calculator"
          />
        </div>
      </section>
    </main>
  );
}
