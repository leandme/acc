"use client";

import { useState } from "react";
import MacroCalculator from "@/app/components/tools/calories/macro-calculator/macro-calculator";
import MacroInterpretation from "@/app/components/tools/calories/macro-calculator/macro-interpretation";
import { round } from "@/app/components/tools/body-weight/shared/math";
import { MoreTools } from "../../template/more-tools";

export default function MacroPageClient() {
  const [tdee, setTdee] = useState<number | null>(null);
  const [targetCalories, setTargetCalories] = useState<number | null>(null);
  const [adjustmentPct, setAdjustmentPct] = useState<number | null>(null);
  const [presetLabel, setPresetLabel] = useState<string | null>(null);
  const [proteinG, setProteinG] = useState<number | null>(null);
  const [carbsG, setCarbsG] = useState<number | null>(null);
  const [fatG, setFatG] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Macro Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Set macro targets from estimated maintenance calories, calorie adjustment, and macro split presets.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <MacroCalculator
              onChange={({ tdee, targetCalories, adjustmentPct, presetLabel, proteinG, carbsG, fatG }) => {
                setTdee(tdee);
                setTargetCalories(targetCalories);
                setAdjustmentPct(adjustmentPct);
                setPresetLabel(presetLabel);
                setProteinG(proteinG);
                setCarbsG(carbsG);
                setFatG(fatG);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20" id="macro-interpretation">
          <MacroInterpretation adjustmentPct={adjustmentPct} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Macro Calculator Does</h2>
          <p className={pClass}>
            This calculator estimates maintenance calories from your profile and activity level, then applies
            your selected calorie adjustment to generate macro targets in grams.
          </p>
          {tdee != null &&
          targetCalories != null &&
          adjustmentPct != null &&
          presetLabel &&
          proteinG != null &&
          carbsG != null &&
          fatG != null ? (
            <p className={pClass}>
              Current setup: maintenance <strong>{Math.round(tdee)} kcal/day</strong>, target{" "}
              <strong>{Math.round(targetCalories)} kcal/day</strong> ({adjustmentPct > 0 ? "+" : ""}
              {Math.round(adjustmentPct)}%), preset <strong>{presetLabel}</strong>, with about{" "}
              <strong>{Math.round(proteinG)} g protein</strong>,{" "}
              <strong>{Math.round(carbsG)} g carbs</strong>, and{" "}
              <strong>{Math.round(fatG)} g fat</strong> per day.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use It for Planning</h2>
          <p className={pClass}>
            Start with a conservative calorie adjustment and a macro split you can follow consistently. Then
            calibrate from your 2 to 4 week body-weight trend.
          </p>
          <p className={pClass}>
            For maintenance estimates, compare against the{" "}
            <a className="text-primary underline" href="/tdee-calculator">
              TDEE Calculator
            </a>
            {" "}or the{" "}
            <a className="text-primary underline" href="/calorie-calculator">
              Calorie Calculator
            </a>
            . For weekly pace planning, pair this with the{" "}
            <a className="text-primary underline" href="/calorie-deficit-calculator">
              Calorie Deficit Calculator
            </a>{" "}
            and the{" "}
            <a className="text-primary underline" href="/weight-loss-calculator">
              Weight Loss Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            If you track meal photos for intake verification, use the{" "}
            <a className="text-primary underline" href="/calorie-counter">
              Calorie Counter
            </a>{" "}
            and compare your weekly average against this macro target.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Important Limits</h2>
          <p className={pClass}>
            Macro percentages are planning defaults, not medical prescriptions. Food quality, adherence,
            training load, and recovery all affect outcomes.
          </p>
          <p className={pClass}>
            If you train at high volume, prioritize adequate protein and carbohydrate intake around sessions.
          </p>
          <p className={pClass}>
            For activity-driven calorie output from walking targets, compare with the{" "}
            <a className="text-primary underline" href="/steps-to-calories-calculator">
              Steps to Calories Calculator
            </a>
            {" "}or the{" "}
            <a className="text-primary underline" href="/calories-burned-calculator">
              Calories Burned Calculator
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
              Dietary Reference Intakes (NCBI Bookshelf) for macronutrient ranges:
              <a className="text-primary underline ml-1" href="https://www.ncbi.nlm.nih.gov/books/NBK56068/">
                Dietary Reference Intakes for Energy, Carbohydrate, Fat, and Protein
              </a>
            </li>
            <li>
              International Society of Sports Nutrition position stand on protein and exercise:
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/28642676/">
                ISSN Position Stand: Protein and Exercise
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
              "calorie-deficit-calculator",
              "tdee-calculator",
              "bmr-calculator",
              "calorie-counter",
              "steps-to-calories-calculator",
              "calories-burned-calculator",
              "weight-loss-calculator",
              "intermittent-fasting-calculator",
              "fasting-weight-loss-calculator",
            ]}
            excludeSlug="macro-calculator"
          />
        </div>
      </section>
    </main>
  );
}
