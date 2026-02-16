"use client";

import { useState } from "react";
import BMRCalculator from "@/app/components/tools/body-weight/bmr-calculator/bmr-calculator";
import BMRInterpretation from "@/app/components/tools/body-weight/bmr-calculator/bmr-interpretation";
import { round } from "@/app/components/tools/body-weight/shared/math";
import { MoreTools } from "../../template/more-tools";

export default function BMRPageClient() {
  const [bmr, setBmr] = useState<number | null>(null);
  const [bmrPerKg, setBmrPerKg] = useState<number | null>(null);
  const [mifflinBmr, setMifflinBmr] = useState<number | null>(null);
  const [harrisBmr, setHarrisBmr] = useState<number | null>(null);
  const [equationLabel, setEquationLabel] = useState<string | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">BMR Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate basal metabolic rate (BMR) with standard resting-energy equations.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <BMRCalculator
              onChange={({ bmr, bmrPerKg, mifflinBmr, harrisBmr, equationLabel }) => {
                setBmr(bmr);
                setBmrPerKg(bmrPerKg);
                setMifflinBmr(mifflinBmr);
                setHarrisBmr(harrisBmr);
                setEquationLabel(equationLabel);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40" id="bmr-interpretation">
          <BMRInterpretation bmrPerKg={bmrPerKg} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This BMR Calculator Estimates</h2>
          <p className={pClass}>
            BMR is estimated energy use at rest before daily movement and planned exercise are added.
          </p>
          {bmr != null && equationLabel ? (
            <p className={pClass}>
              Current result: <strong>{Math.round(bmr)} kcal/day</strong> using{" "}
              <strong>{equationLabel}</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How BMR Relates to TDEE</h2>
          <p className={pClass}>
            BMR is not maintenance calories. To estimate maintenance, multiply by activity level in the{" "}
            <a className="text-primary underline" href="/tdee-calculator">
              TDEE Calculator
            </a>
            . From there, build a practical intake with the{" "}
            <a className="text-primary underline" href="/calorie-deficit-calculator">
              Calorie Deficit Calculator
            </a>
            .
          </p>
          {mifflinBmr != null && harrisBmr != null ? (
            <p className={pClass}>
              Equation comparison: Mifflin <strong>{Math.round(mifflinBmr)} kcal</strong> vs Revised
              Harris-Benedict <strong>{Math.round(harrisBmr)} kcal</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Why BMR Is an Estimate</h2>
          <p className={pClass}>
            True resting expenditure varies with age, lean mass, hormones, medications, illness, and sleep.
            Use equation output as a starting point and calibrate from trend data over time.
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
              NIDDK adult weight-management guidance:
              <a className="text-primary underline ml-1" href="https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity">
                NIDDK Adult Overweight and Obesity
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
              "bmi-calculator",
              "ideal-weight-calculator",
            ]}
            excludeSlug="bmr-calculator"
          />
        </div>
      </section>
    </main>
  );
}
