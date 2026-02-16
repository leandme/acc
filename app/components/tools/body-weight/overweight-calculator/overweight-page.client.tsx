"use client";

import { useState } from "react";
import OverweightCalculator from "@/app/components/tools/body-weight/overweight-calculator/overweight-calculator";
import OverweightInterpretation from "@/app/components/tools/body-weight/overweight-calculator/overweight-interpretation";
import { round } from "@/app/components/tools/body-weight/shared/math";
import { MoreTools } from "../../template/more-tools";

export default function OverweightPageClient() {
  const [bmi, setBmi] = useState<number | null>(null);
  const [overweightKg, setOverweightKg] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Overweight Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Check BMI category and estimate how far current weight sits above the upper healthy-BMI boundary.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <OverweightCalculator
              onChange={({ bmi, overweightKg }) => {
                setBmi(bmi);
                setOverweightKg(overweightKg);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40" id="overweight-interpretation">
          <OverweightInterpretation bmi={bmi} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Overweight Calculator Does</h2>
          <p className={pClass}>
            This tool uses your height and weight to compute BMI and map it to standard adult BMI
            categories. It also calculates how much weight sits above the BMI 24.9 cutoff at your current
            height.
          </p>
          {bmi != null && overweightKg != null ? (
            <p className={pClass}>
              Current result: <strong>BMI {round(bmi, 1)}</strong>
              {overweightKg > 0 ? (
                <>
                  {" "}with <strong>{round(overweightKg, 1)} kg</strong> above the BMI 24.9 boundary.
                </>
              ) : (
                <> and currently not above the BMI 24.9 boundary.</>
              )}
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Important Interpretation Notes</h2>
          <p className={pClass}>
            BMI is a screening tool, not a diagnosis. It does not directly measure fat mass, lean mass, or
            fat distribution. Two people with the same BMI can have very different body composition.
          </p>
          <p className={pClass}>
            For better context, combine BMI with waist-based tools and composition-focused tools such as the{" "}
            <a className="text-primary underline" href="/bri-calculator">
              BRI Calculator
            </a>
            ,{" "}
            <a className="text-primary underline" href="/body-fat-calculator">
              Body Fat Calculator
            </a>
            , and{" "}
            <a className="text-primary underline" href="/lean-body-mass-calculator">
              Lean Body Mass Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Related Tools</h2>
          <p className={pClass}>
            For direct BMI calculation and trend context, use the{" "}
            <a className="text-primary underline" href="/bmi-calculator">
              BMI Calculator
            </a>
            . For healthy-weight targets, pair this with the{" "}
            <a className="text-primary underline" href="/ideal-weight-calculator">
              Ideal Weight Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              CDC adult BMI categories:
              <a className="text-primary underline ml-1" href="https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html">
                CDC BMI Categories
              </a>
            </li>
            <li>
              CDC BMI as a screening measure:
              <a className="text-primary underline ml-1" href="https://www.cdc.gov/bmi/about/index.html">
                About Adult BMI
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <MoreTools
            heading="More Tools"
            columns={2}
            toolSlugs={[
              "bmi-calculator",
              "ideal-weight-calculator",
              "weight-loss-calculator",
              "weight-loss-percentage-calculator",
              "ponderal-index-calculator",
              "broca-index-calculator",
              "body-fat-calculator",
              "bri-calculator",
            ]}
            excludeSlug="overweight-calculator"
          />
        </div>
      </section>
    </main>
  );
}
