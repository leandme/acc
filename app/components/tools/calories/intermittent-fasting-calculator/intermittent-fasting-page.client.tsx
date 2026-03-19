"use client";

import { useState } from "react";
import IntermittentFastingCalculator from "@/app/components/tools/calories/intermittent-fasting-calculator/intermittent-fasting-calculator";
import IntermittentFastingInterpretation from "@/app/components/tools/calories/intermittent-fasting-calculator/intermittent-fasting-interpretation";
import { round } from "@/app/components/tools/body-weight/shared/math";
import { MoreTools } from "../../template/more-tools";

export default function IntermittentFastingPageClient() {
  const [weeklyLossPct, setWeeklyLossPct] = useState<number | null>(null);
  const [totalLossKg, setTotalLossKg] = useState<number | null>(null);
  const [endWeightKg, setEndWeightKg] = useState<number | null>(null);
  const [averageDailyIntakeKcal, setAverageDailyIntakeKcal] = useState<number | null>(null);
  const [averageDailyDeficitKcal, setAverageDailyDeficitKcal] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [protocolLabel, setProtocolLabel] = useState<string | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Intermittent Fasting Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate daily expenditure, fasting-adjusted calorie intake, and projected weekly weight-change
          pace for popular intermittent fasting protocols.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <IntermittentFastingCalculator
              onChange={({
                tdee,
                averageDailyIntakeKcal,
                averageDailyDeficitKcal,
                weeklyLossPct,
                totalLossKg,
                endWeightKg,
                protocolLabel,
              }) => {
                setTdee(tdee);
                setAverageDailyIntakeKcal(averageDailyIntakeKcal);
                setAverageDailyDeficitKcal(averageDailyDeficitKcal);
                setWeeklyLossPct(weeklyLossPct);
                setTotalLossKg(totalLossKg);
                setEndWeightKg(endWeightKg);
                setProtocolLabel(protocolLabel);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40" id="intermittent-fasting-interpretation">
          <IntermittentFastingInterpretation weeklyLossPct={weeklyLossPct} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Intermittent Fasting Calculator Estimates</h2>
          <p className={pClass}>
            This tool estimates your resting energy needs, scales them to daily expenditure (TDEE), then
            models intake under fasting protocols to project likely weekly body-weight change.
          </p>
          {tdee != null &&
          averageDailyIntakeKcal != null &&
          averageDailyDeficitKcal != null &&
          weeklyLossPct != null &&
          protocolLabel ? (
            <p className={pClass}>
              Current setup: <strong>{protocolLabel}</strong>, estimated maintenance{" "}
              <strong>{Math.round(tdee)} kcal/day</strong>, estimated fasting-adjusted intake{" "}
              <strong>{Math.round(averageDailyIntakeKcal)} kcal/day</strong>, and average deficit{" "}
              <strong>{Math.round(averageDailyDeficitKcal)} kcal/day</strong> (
              <strong>{round(weeklyLossPct, 2)}%</strong> body weight per week).
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use This for Planning</h2>
          <p className={pClass}>
            Use this as a scenario planner: compare protocols, then pick the least aggressive setup you can
            sustain with stable sleep, training performance, and adherence.
          </p>
          {totalLossKg != null && endWeightKg != null ? (
            <p className={pClass}>
              With your current inputs, projected change is <strong>{round(totalLossKg, 1)} kg</strong>,
              ending near <strong>{round(endWeightKg, 1)} kg</strong> over the selected timeline.
            </p>
          ) : null}
          <p className={pClass}>
            For a day-by-day projection based on fasting vs non-fasting days, compare this with the{" "}
            <a className="text-primary underline" href="/fasting-weight-loss-calculator">
              Fasting Weight Loss Calculator
            </a>
            . For non-fasting setups, use the{" "}
            <a className="text-primary underline" href="/calorie-deficit-calculator">
              Calorie Deficit Calculator
            </a>
            {" "}or the{" "}
            <a className="text-primary underline" href="/calorie-calculator">
              Calorie Calculator
            </a>
            . To estimate real meal intake by photo on feeding days, use the{" "}
            <a className="text-primary underline" href="/calorie-scanner">
              Calorie Scanner
            </a>
            . To estimate walking output from your daily step target, add the{" "}
            <a className="text-primary underline" href="/steps-to-calories-calculator">
              Steps to Calories Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Important Assumptions and Limits</h2>
          <p className={pClass}>
            Protocol-based intake reduction is an estimate, not a guarantee. Real outcomes vary with
            appetite compensation, food choices, adherence, and fluid shifts.
          </p>
          <p className={pClass}>
            If progress stalls, calibrate with 2 to 4 weeks of measured trend data and adjust intake or
            activity in smaller steps.
          </p>
          <p className={pClass}>
            For underlying maintenance assumptions, run the{" "}
            <a className="text-primary underline" href="/tdee-calculator">
              TDEE Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/bmr-calculator">
              BMR Calculator
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
              Time-restricted eating trial in adults with overweight/obesity (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/32986097/">
                Effect of Time-Restricted Eating on Weight Loss
              </a>
            </li>
            <li>
              Calorie restriction with or without time-restricted eating (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/36279639/">
                Calorie Restriction with or without Time-Restricted Eating in Weight Loss
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
              "fasting-weight-loss-calculator",
              "weight-loss-calculator",
              "calorie-deficit-calculator",
              "calorie-scanner",
              "steps-to-calories-calculator",
              "tdee-calculator",
              "bmr-calculator",
              "weight-loss-percentage-calculator",
              "bmi-calculator",
            ]}
            excludeSlug="intermittent-fasting-calculator"
          />
        </div>
      </section>
    </main>
  );
}
