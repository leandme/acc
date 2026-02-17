"use client";

import { useState } from "react";
import BMICalculator from "@/app/components/tools/body-weight/bmi-calculator/bmi-calculator";
import BMIInterpretation from "@/app/components/tools/body-weight/bmi-calculator/bmi-interpretation";
import { round } from "@/app/components/tools/body-weight/shared/math";
import { MoreTools } from "../../template/more-tools";

export default function BMIPageClient() {
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [healthyMinWeightKg, setHealthyMinWeightKg] = useState<number | null>(null);
  const [healthyMaxWeightKg, setHealthyMaxWeightKg] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">BMI Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Calculate body mass index (BMI), view adult category ranges, and estimate healthy-BMI weight range
          for your height.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <BMICalculator
              onChange={({ bmi, category, healthyMinWeightKg, healthyMaxWeightKg }) => {
                setBmi(bmi);
                setCategory(category);
                setHealthyMinWeightKg(healthyMinWeightKg);
                setHealthyMaxWeightKg(healthyMaxWeightKg);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40" id="bmi-interpretation">
          <BMIInterpretation bmi={bmi} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This BMI Calculator Shows</h2>
          <p className={pClass}>
            BMI is calculated as weight (kg) divided by height squared (m2). It is a quick screening metric
            used in public health and clinical workflows.
          </p>
          {bmi != null && category && healthyMinWeightKg != null && healthyMaxWeightKg != null ? (
            <p className={pClass}>
              Current result: <strong>BMI {round(bmi, 1)}</strong> ({category}). Healthy-BMI range at this
              height is <strong>{round(healthyMinWeightKg, 1)}-{round(healthyMaxWeightKg, 1)} kg</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>If You Searched for an Overweight Calculator</h2>
          <p className={pClass}>
            BMI is best for general screening. If your intent is planning around how much weight sits above
            the healthy range, use the{" "}
            <a className="text-primary underline" href="/overweight-calculator">
              BMI-based overweight calculator
            </a>{" "}
            for a direct kg-above-threshold result.
          </p>
          <p className={pClass}>
            A practical sequence is: screen with BMI, quantify current gap above healthy range, then map a
            timeline using the{" "}
            <a className="text-primary underline" href="/weight-loss-calculator">
              target-weight timeline calculator
            </a>
            . For calorie targets behind that plan, run the{" "}
            <a className="text-primary underline" href="/tdee-calculator">
              TDEE Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/calorie-deficit-calculator">
              Calorie Deficit Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Limits of BMI</h2>
          <p className={pClass}>
            BMI does not directly measure fat, muscle, or fat distribution. Athletes and highly trained
            individuals can be misclassified despite low body fat.
          </p>
          <p className={pClass}>
            For body-composition context, compare with a{" "}
            <a className="text-primary underline" href="/body-fat-calculator">
              tape-based body fat estimate
            </a>
            ,{" "}
            <a className="text-primary underline" href="/waist-to-hip-ratio-calculator">
              waist-to-hip ratio risk check
            </a>
            ,{" "}
            <a className="text-primary underline" href="/waist-to-height-ratio-calculator">
              waist-to-height ratio screen
            </a>
            ,{" "}
            <a className="text-primary underline" href="/bri-calculator">
              waist-to-height roundness check
            </a>
            , and{" "}
            <a className="text-primary underline" href="/ffmi-calculator">
              height-normalized muscularity score (FFMI)
            </a>
            .
          </p>
          <p className={pClass}>
            For a deeper breakdown, read our guide on{" "}
            <a className="text-primary underline" href="/guides/bmi-vs-body-fat">
              when BMI helps and when body-fat percentage is more useful
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              CDC BMI calculation and interpretation:
              <a className="text-primary underline ml-1" href="https://www.cdc.gov/bmi/about/index.html">
                About Adult BMI
              </a>
            </li>
            <li>
              CDC adult BMI categories:
              <a className="text-primary underline ml-1" href="https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html">
                BMI Categories
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <MoreTools
            heading="More Tools"
            columns={2}
            toolSlugs={[
              "overweight-calculator",
              "ideal-weight-calculator",
              "tdee-calculator",
              "calorie-deficit-calculator",
              "weight-loss-calculator",
              "weight-loss-percentage-calculator",
              "waist-to-hip-ratio-calculator",
              "waist-to-height-ratio-calculator",
              "ponderal-index-calculator",
              "broca-index-calculator",
              "body-fat-calculator",
              "bri-calculator",
            ]}
            excludeSlug="bmi-calculator"
          />
        </div>
      </section>
    </main>
  );
}
