"use client";

import { useState } from "react";
import FastingWeightLossCalculator from "@/app/components/tools/calories/fasting-weight-loss-calculator/fasting-weight-loss-calculator";
import FastingWeightLossInterpretation from "@/app/components/tools/calories/fasting-weight-loss-calculator/fasting-weight-loss-interpretation";
import { round } from "@/app/components/tools/body-weight/shared/math";
import { MoreTools } from "../../template/more-tools";

export default function FastingWeightLossPageClient() {
  const [weeklyLossPct, setWeeklyLossPct] = useState<number | null>(null);
  const [totalLossKg, setTotalLossKg] = useState<number | null>(null);
  const [endWeightKg, setEndWeightKg] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Fasting Weight Loss Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate projected weight change from an intermittent-fasting calorie pattern using adaptive
          energy-balance math.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <FastingWeightLossCalculator
              onChange={({ weeklyLossPct, totalLossKg, endWeightKg }) => {
                setWeeklyLossPct(weeklyLossPct);
                setTotalLossKg(totalLossKg);
                setEndWeightKg(endWeightKg);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20" id="fasting-weight-loss-interpretation">
          <FastingWeightLossInterpretation weeklyLossPct={weeklyLossPct} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How This Fasting Calculator Works</h2>
          <p className={pClass}>
            The model estimates daily energy expenditure from Mifflin-St Jeor BMR and activity level, then
            simulates day-by-day weight change across fasting and non-fasting intake days.
          </p>
          <p className={pClass}>
            Unlike a single static deficit formula, this projection recalculates expenditure as body weight
            changes, which reduces overestimation over longer timelines.
          </p>
          {weeklyLossPct != null && totalLossKg != null && endWeightKg != null ? (
            <p className={pClass}>
              Current projection: <strong>{round(totalLossKg, 1)} kg</strong> total change, ending around{" "}
              <strong>{round(endWeightKg, 1)} kg</strong>, at <strong>{round(weeklyLossPct, 2)}%</strong>
              body-weight change per week.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Practical Use</h2>
          <p className={pClass}>
            Use this as a planning tool, not a guarantee. Real outcomes are influenced by adherence,
            spontaneous intake changes, sleep, stress, medications, and fluid shifts.
          </p>
          <p className={pClass}>
            For non-fasting calorie setup, estimate maintenance with the{" "}
            <a className="text-primary underline" href="/tdee-calculator">
              TDEE Calculator
            </a>{" "}
            or the{" "}
            <a className="text-primary underline" href="/calorie-calculator">
              Calorie Calculator
            </a>
            , and set a target with the{" "}
            <a className="text-primary underline" href="/calorie-deficit-calculator">
              Calorie Deficit Calculator
            </a>
            . For meal-level intake estimates from food photos, use the{" "}
            <a className="text-primary underline" href="/calorie-counter">
              Calorie Counter
            </a>
            . For step-based walking output, add the{" "}
            <a className="text-primary underline" href="/steps-to-calories-calculator">
              Steps to Calories Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            If you want a quick protocol comparison (16:8, 18:6, OMAD, or 5:2), use the{" "}
            <a className="text-primary underline" href="/intermittent-fasting-calculator">
              Intermittent Fasting Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            If you prefer a non-fasting setup based on one daily calorie target, use the{" "}
            <a className="text-primary underline" href="/weight-loss-calculator">
              standard daily-intake timeline model
            </a>
            .
          </p>
          <p className={pClass}>
            To summarize progress after a phase, calculate net percentage change with the{" "}
            <a className="text-primary underline" href="/weight-loss-percentage-calculator">
              start-to-current percentage tracker
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              NIDDK overview of adult overweight and obesity management:
              <a className="text-primary underline ml-1" href="https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity">
                NIDDK Adult Overweight and Obesity
              </a>
            </li>
            <li>
              Mifflin-St Jeor resting metabolic rate equation (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/2305711/">
                A New Predictive Equation for Resting Energy Expenditure
              </a>
            </li>
            <li>
              Time-restricted eating trial in adults with overweight/obesity (JAMA Internal Medicine):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/32986097/">
                Effect of Time-Restricted Eating on Weight Loss
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
              "intermittent-fasting-calculator",
              "tdee-calculator",
              "calorie-deficit-calculator",
              "calorie-counter",
              "steps-to-calories-calculator",
              "bmr-calculator",
              "weight-loss-calculator",
              "weight-loss-percentage-calculator",
              "bmi-calculator",
              "ideal-weight-calculator",
              "overweight-calculator",
              "adjusted-body-weight-calculator",
            ]}
            excludeSlug="fasting-weight-loss-calculator"
          />
        </div>
      </section>
    </main>
  );
}
