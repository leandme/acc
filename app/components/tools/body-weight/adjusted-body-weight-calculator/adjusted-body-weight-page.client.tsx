"use client";

import { useState } from "react";
import AdjustedBodyWeightCalculator from "@/app/components/tools/body-weight/adjusted-body-weight-calculator/adjusted-body-weight-calculator";
import AdjustedBodyWeightInterpretation from "@/app/components/tools/body-weight/adjusted-body-weight-calculator/adjusted-body-weight-interpretation";
import { round } from "@/app/components/tools/body-weight/shared/math";
import { MoreTools } from "../../template/more-tools";

export default function AdjustedBodyWeightPageClient() {
  const [percentOfIbw, setPercentOfIbw] = useState<number | null>(null);
  const [adjustedBodyWeightKg, setAdjustedBodyWeightKg] = useState<number | null>(null);
  const [dosingWeightKg, setDosingWeightKg] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Adjusted Body Weight Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Calculate Devine ideal body weight (IBW), adjusted body weight (AdjBW), and percent of IBW for
          dosing-oriented scenarios.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <AdjustedBodyWeightCalculator
              onChange={({ percentOfIbw, adjustedBodyWeightKg, dosingWeightKg }) => {
                setPercentOfIbw(percentOfIbw);
                setAdjustedBodyWeightKg(adjustedBodyWeightKg);
                setDosingWeightKg(dosingWeightKg);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20" id="adjusted-body-weight-interpretation">
          <AdjustedBodyWeightInterpretation percentOfIbw={percentOfIbw} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Formula Used</h2>
          <p className={pClass}>This calculator uses:</p>
          <div className="rounded-2xl border bg-white p-6 text-sm sm:text-base text-gray-800 overflow-x-auto">
            <p className="font-mono">IBW (Devine) = 50 + 2.3 x (height in - 60) for men</p>
            <p className="font-mono mt-1">IBW (Devine) = 45.5 + 2.3 x (height in - 60) for women</p>
            <p className="font-mono mt-3">AdjBW = IBW + 0.4 x (Actual BW - IBW)</p>
          </div>
          <p className={pClass}>
            Many hospital dosing workflows apply AdjBW when actual body weight is at or above 120% of
            IBW, though medication-specific protocols can differ.
          </p>
          {adjustedBodyWeightKg != null && dosingWeightKg != null ? (
            <p className={pClass}>
              Current result: AdjBW <strong>{round(adjustedBodyWeightKg, 1)} kg</strong> and suggested
              dosing weight <strong>{round(dosingWeightKg, 1)} kg</strong> based on the 120% IBW rule.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Use With Caution</h2>
          <p className={pClass}>
            This calculator is educational and does not replace medication-specific clinical guidance.
            Drug properties, renal function, age, and diagnosis can change the appropriate dosing weight
            method.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Stanford antimicrobial obesity dosing guide (Devine + AdjBW usage):
              <a className="text-primary underline ml-1" href="https://med.stanford.edu/content/dam/sm/bugsanddrugs/documents/clinical-pathways/SHC-ABX-Obesity-Dosing-Guide.pdf">
                Stanford Obesity Dosing Guide
              </a>
            </li>
            <li>
              Review of ideal body weight formula history and use:
              <a className="text-primary underline ml-1" href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4841935/">
                Variability in IBW Formulae (PMC)
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <MoreTools
            heading="More Tools"
            columns={2}
            toolSlugs={[
              "ideal-weight-calculator",
              "bmi-calculator",
              "overweight-calculator",
              "tdee-calculator",
              "calorie-deficit-calculator",
              "weight-loss-calculator",
              "weight-loss-percentage-calculator",
              "broca-index-calculator",
            ]}
            excludeSlug="adjusted-body-weight-calculator"
          />
        </div>
      </section>
    </main>
  );
}
