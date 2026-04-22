"use client";

import { useState } from "react";
import WeightLossCalculator from "@/app/components/tools/body-weight/weight-loss-calculator/weight-loss-calculator";
import WeightLossInterpretation from "@/app/components/tools/body-weight/weight-loss-calculator/weight-loss-interpretation";
import { round } from "@/app/components/tools/body-weight/shared/math";
import { MoreTools } from "../../template/more-tools";

export default function WeightLossPageClient() {
  const [daysToTarget, setDaysToTarget] = useState<number | null>(null);
  const [weeklyLossPct, setWeeklyLossPct] = useState<number | null>(null);
  const [projected12WeekLossKg, setProjected12WeekLossKg] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  const timelineLabel =
    daysToTarget == null
      ? "Target not reachable at current intake"
      : daysToTarget === 0
      ? "Already at or below target"
      : `${round(daysToTarget / 7, 1)} weeks`;

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Weight Loss Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate how long it may take to reach a target weight from calorie intake, activity, and adaptive
          expenditure changes.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <WeightLossCalculator
              onChange={({ daysToTarget, weeklyLossPct, projected12WeekLossKg }) => {
                setDaysToTarget(daysToTarget);
                setWeeklyLossPct(weeklyLossPct);
                setProjected12WeekLossKg(projected12WeekLossKg);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20" id="weight-loss-interpretation">
          <WeightLossInterpretation weeklyLossPct={weeklyLossPct} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Weight Loss Calculator Estimates</h2>
          <p className={pClass}>
            This tool projects timeline-to-target using a daily simulation model. Energy expenditure is
            recalculated as body weight changes, which is more realistic than static "same deficit forever"
            assumptions.
          </p>
          {weeklyLossPct != null && projected12WeekLossKg != null ? (
            <p className={pClass}>
              Current projection: <strong>{timelineLabel}</strong> to target, with roughly{" "}
              <strong>{round(projected12WeekLossKg, 1)} kg</strong> change over 12 weeks and{" "}
              <strong>{round(weeklyLossPct, 2)}%</strong> body-weight change per week.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Why This Is Still an Estimate</h2>
          <p className={pClass}>
            Real outcomes depend on adherence, stress, sleep, fluid shifts, medications, and changing
            activity. Use this for planning and scenario testing, then recalibrate every 2-4 weeks.
          </p>
          <p className={pClass}>
            If you need to set calorie targets first, estimate maintenance in the{" "}
            <a className="text-primary underline" href="/tdee-calculator">
              TDEE Calculator
            </a>{" "}
            or the{" "}
            <a className="text-primary underline" href="/calorie-calculator">
              Calorie Calculator
            </a>
            , and convert that to an intake target in the{" "}
            <a className="text-primary underline" href="/calorie-deficit-calculator">
              Calorie Deficit Calculator
            </a>
            . If movement is a major part of your plan, estimate daily walking output with the{" "}
            <a className="text-primary underline" href="/steps-to-calories-calculator">
              Steps to Calories Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            If you use fasting windows with different intake on fasting vs feeding days, use the{" "}
            <a className="text-primary underline" href="/fasting-weight-loss-calculator">
              fasting-specific intake projection
            </a>
            {" "}or compare popular fasting protocols quickly with the{" "}
            <a className="text-primary underline" href="/intermittent-fasting-calculator">
              Intermittent Fasting Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            To summarize completed progress, calculate net percentage change in the{" "}
            <a className="text-primary underline" href="/weight-loss-percentage-calculator">
              start-to-current weight change calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              NIDDK Body Weight Planner (dynamic model context):
              <a className="text-primary underline ml-1" href="https://www.niddk.nih.gov/bwp">
                NIDDK Body Weight Planner
              </a>
            </li>
            <li>
              Mifflin-St Jeor equation (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/2305711/">
                A New Predictive Equation for Resting Energy Expenditure
              </a>
            </li>
            <li>
              Dynamic energy-balance research challenging static 3,500 kcal assumptions:
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
              "calorie-calculator",
              "tdee-calculator",
              "calorie-deficit-calculator",
              "steps-to-calories-calculator",
              "bmr-calculator",
              "intermittent-fasting-calculator",
              "fasting-weight-loss-calculator",
              "weight-loss-percentage-calculator",
              "bmi-calculator",
              "ideal-weight-calculator",
              "overweight-calculator",
              "adjusted-body-weight-calculator",
            ]}
            excludeSlug="weight-loss-calculator"
          />
        </div>
      </section>
    </main>
  );
}
