"use client";

import { useState } from "react";
import IdealWeightCalculator from "@/app/components/tools/body-weight/ideal-weight-calculator/ideal-weight-calculator";
import IdealWeightInterpretation from "@/app/components/tools/body-weight/ideal-weight-calculator/ideal-weight-interpretation";
import { round } from "@/app/components/tools/body-weight/shared/math";
import { MoreTools } from "../../template/more-tools";

export default function IdealWeightPageClient() {
  const [percentOfTarget, setPercentOfTarget] = useState<number | null>(null);
  const [devineKg, setDevineKg] = useState<number | null>(null);
  const [healthyMinKg, setHealthyMinKg] = useState<number | null>(null);
  const [healthyMaxKg, setHealthyMaxKg] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">
          Ideal Weight Calculator
        </h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate healthy-weight range from BMI and compare current weight against Devine ideal body
          weight reference.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <IdealWeightCalculator
              onChange={({ percentOfTarget, devineKg, healthyMinKg, healthyMaxKg }) => {
                setPercentOfTarget(percentOfTarget);
                setDevineKg(devineKg);
                setHealthyMinKg(healthyMinKg);
                setHealthyMaxKg(healthyMaxKg);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40" id="ideal-weight-interpretation">
          <IdealWeightInterpretation percentOfTarget={percentOfTarget} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Ideal Weight Calculator Includes</h2>
          <p className={pClass}>
            This page shows two common reference outputs:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Healthy BMI range for your height (18.5 to 24.9)</li>
            <li>Devine ideal body weight (IBW) reference from height and sex</li>
          </ul>
          {devineKg != null && healthyMinKg != null && healthyMaxKg != null ? (
            <p className={pClass}>
              Current targets: Devine IBW <strong>{round(devineKg, 1)} kg</strong> and healthy BMI range{" "}
              <strong>
                {round(healthyMinKg, 1)}-{round(healthyMaxKg, 1)} kg
              </strong>
              .
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Why There Is No Single Perfect Number</h2>
          <p className={pClass}>
            "Ideal" weight is a reference concept, not a diagnosis. Body composition, frame size, muscle
            mass, and health markers can shift what is realistic and useful for a given person.
          </p>
          <p className={pClass}>
            Use these outputs as planning anchors, then monitor trend quality using waist, performance,
            bloodwork, and adherence.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use This With Other Tools</h2>
          <p className={pClass}>
            Pair this with the{" "}
            <a className="text-primary underline" href="/weight-loss-calculator">
              Weight Loss Calculator
            </a>{" "}
            to estimate timeline to a target and the{" "}
            <a className="text-primary underline" href="/bmi-calculator">
              BMI Calculator
            </a>{" "}
            for direct category screening.
          </p>
          <p className={pClass}>
            To plan calories around that target, estimate maintenance in the{" "}
            <a className="text-primary underline" href="/tdee-calculator">
              TDEE Calculator
            </a>{" "}
            and set intake in the{" "}
            <a className="text-primary underline" href="/calorie-deficit-calculator">
              Calorie Deficit Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            For medication-dosing contexts where adjusted weight is used, see the{" "}
            <a className="text-primary underline" href="/adjusted-body-weight-calculator">
              Adjusted Body Weight Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              CDC BMI categories and healthy range context:
              <a className="text-primary underline ml-1" href="https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html">
                CDC BMI Categories
              </a>
            </li>
            <li>
              Review discussing historical ideal-body-weight formulas including Devine:
              <a className="text-primary underline ml-1" href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4841935/">
                Journal of the American College of Clinical Pharmacy (PMC)
              </a>
            </li>
            <li>
              Clinical dosing guide using Devine IBW equations:
              <a className="text-primary underline ml-1" href="https://med.stanford.edu/content/dam/sm/bugsanddrugs/documents/clinical-pathways/SHC-ABX-Obesity-Dosing-Guide.pdf">
                Stanford Antimicrobial Dosing Guide in Obesity
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
              "overweight-calculator",
              "tdee-calculator",
              "calorie-deficit-calculator",
              "weight-loss-calculator",
              "weight-loss-percentage-calculator",
              "adjusted-body-weight-calculator",
              "broca-index-calculator",
              "ponderal-index-calculator",
            ]}
            excludeSlug="ideal-weight-calculator"
          />
        </div>
      </section>
    </main>
  );
}
