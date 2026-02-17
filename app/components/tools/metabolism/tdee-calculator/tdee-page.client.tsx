"use client";

import { useState } from "react";
import TDEECalculator from "@/app/components/tools/metabolism/tdee-calculator/tdee-calculator";
import TDEEInterpretation from "@/app/components/tools/metabolism/tdee-calculator/tdee-interpretation";
import { round } from "@/app/components/tools/body-weight/shared/math";
import { MoreTools } from "../../template/more-tools";

export default function TDEEPageClient() {
  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [activityFactor, setActivityFactor] = useState<number | null>(null);
  const [activityLabel, setActivityLabel] = useState<string | null>(null);
  const [mildCutCalories, setMildCutCalories] = useState<number | null>(null);
  const [leanGainCalories, setLeanGainCalories] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">TDEE Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate total daily energy expenditure (TDEE) from BMR equation choice and activity multiplier.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <TDEECalculator
              onChange={({ bmr, tdee, activityFactor, activityLabel, mildCutCalories, leanGainCalories }) => {
                setBmr(bmr);
                setTdee(tdee);
                setActivityFactor(activityFactor);
                setActivityLabel(activityLabel);
                setMildCutCalories(mildCutCalories);
                setLeanGainCalories(leanGainCalories);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40" id="tdee-interpretation">
          <TDEEInterpretation activityFactor={activityFactor} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This TDEE Calculator Estimates</h2>
          <p className={pClass}>
            TDEE is your estimated maintenance intake: the calories needed to hold body weight roughly
            steady at your current activity level.
          </p>
          {bmr != null && tdee != null && activityFactor != null && activityLabel ? (
            <p className={pClass}>
              Current estimate: BMR <strong>{Math.round(bmr)} kcal/day</strong> and TDEE{" "}
              <strong>{Math.round(tdee)} kcal/day</strong> at <strong>{activityLabel}</strong> activity
              ({round(activityFactor, 2)}x).
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use TDEE for Goal Calories</h2>
          <p className={pClass}>
            TDEE is a starting anchor, not a fixed truth. For weight-loss planning, convert this into a
            target intake with the{" "}
            <a className="text-primary underline" href="/calorie-deficit-calculator">
              Calorie Deficit Calculator
            </a>{" "}
            and timeline-check with the{" "}
            <a className="text-primary underline" href="/weight-loss-calculator">
              Weight Loss Calculator
            </a>
            . To model calorie output from a walking step target, use the{" "}
            <a className="text-primary underline" href="/steps-to-calories-calculator">
              Steps to Calories Calculator
            </a>
            . If you want meal-level intake estimates from photos, use the{" "}
            <a className="text-primary underline" href="/calorie-estimator">
              Calorie Estimator
            </a>{" "}
            and compare weekly average intake against this maintenance target.
          </p>
          {mildCutCalories != null && leanGainCalories != null ? (
            <p className={pClass}>
              At your current setup, a mild cut starts near <strong>{Math.round(mildCutCalories)} kcal/day</strong>
              , while a small surplus starts near <strong>{Math.round(leanGainCalories)} kcal/day</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Why Real Maintenance Can Differ</h2>
          <p className={pClass}>
            Equation-based TDEE can be off because movement, sleep, stress, adaptive thermogenesis,
            measurement error, and adherence all change real expenditure. Recalibrate with 2 to 4 weeks of
            trend data before making aggressive changes.
          </p>
          <p className={pClass}>
            For resting-only energy needs, use the{" "}
            <a className="text-primary underline" href="/bmr-calculator">
              BMR Calculator
            </a>{" "}
            and then layer activity on top.
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
              IOM/DRI chapter on energy requirements (NCBI Bookshelf):
              <a className="text-primary underline ml-1" href="https://www.ncbi.nlm.nih.gov/books/NBK56068/">
                Dietary Reference Intakes for Energy
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <MoreTools
            heading="More Tools"
            columns={2}
            toolSlugs={[
              "bmr-calculator",
              "calorie-deficit-calculator",
              "calorie-estimator",
              "steps-to-calories-calculator",
              "weight-loss-calculator",
              "intermittent-fasting-calculator",
              "fasting-weight-loss-calculator",
              "bmi-calculator",
              "ideal-weight-calculator",
            ]}
            excludeSlug="tdee-calculator"
          />
        </div>
      </section>
    </main>
  );
}
