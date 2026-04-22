"use client";

import { useState } from "react";
import BrocaIndexCalculator from "@/app/components/tools/body-weight/broca-index-calculator/broca-index-calculator";
import BrocaInterpretation from "@/app/components/tools/body-weight/broca-index-calculator/broca-interpretation";
import { round } from "@/app/components/tools/body-weight/shared/math";
import { MoreTools } from "../../template/more-tools";

export default function BrocaPageClient() {
  const [percentOfBroca, setPercentOfBroca] = useState<number | null>(null);
  const [brocaWeightKg, setBrocaWeightKg] = useState<number | null>(null);
  const [bmi, setBmi] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Broca Index Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Calculate classic Broca reference weight from height and compare current weight against that
          historical benchmark.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <BrocaIndexCalculator
              onChange={({ percentOfBroca, brocaWeightKg, bmi }) => {
                setPercentOfBroca(percentOfBroca);
                setBrocaWeightKg(brocaWeightKg);
                setBmi(bmi);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20" id="broca-interpretation">
          <BrocaInterpretation percentOfBroca={percentOfBroca} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Broca Formula</h2>
          <p className={pClass}>The classic Broca reference is:</p>
          <div className="rounded-2xl border bg-white p-6 text-sm sm:text-base text-gray-800 overflow-x-auto">
            <p className="font-mono">Broca Weight (kg) = Height (cm) - 100</p>
          </div>
          <p className={pClass}>
            This formula is historical and simple. It does not account for frame size, age, sex differences,
            or body composition, so it should be treated as a rough benchmark only.
          </p>
          {brocaWeightKg != null && bmi != null ? (
            <p className={pClass}>
              Current result: Broca weight <strong>{round(brocaWeightKg, 1)} kg</strong> with BMI context{" "}
              <strong>{round(bmi, 1)}</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use Broca Index Today</h2>
          <p className={pClass}>
            Use Broca as a quick historical reference, then validate with modern tools: the{" "}
            <a className="text-primary underline" href="/bmi-calculator">
              BMI Calculator
            </a>
            ,{" "}
            <a className="text-primary underline" href="/ideal-weight-calculator">
              Ideal Weight Calculator
            </a>
            , and{" "}
            <a className="text-primary underline" href="/weight-loss-calculator">
              Weight Loss Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            For calorie planning linked to these targets, use the{" "}
            <a className="text-primary underline" href="/tdee-calculator">
              TDEE Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/calorie-deficit-calculator">
              Calorie Deficit Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            If your goal is body-composition quality rather than scale-only targets, combine with the{" "}
            <a className="text-primary underline" href="/body-fat-calculator">
              Body Fat Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/ffmi-calculator">
              FFMI Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Review of ideal-body-weight formula history (includes Broca formula context):
              <a className="text-primary underline ml-1" href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4841935/">
                Variability in IBW Formulae (PMC)
              </a>
            </li>
            <li>
              CDC BMI category framework for modern screening context:
              <a className="text-primary underline ml-1" href="https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html">
                CDC BMI Categories
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <MoreTools
            heading="More Tools"
            columns={2}
            toolSlugs={[
              "ponderal-index-calculator",
              "bmi-calculator",
              "ideal-weight-calculator",
              "tdee-calculator",
              "calorie-deficit-calculator",
              "overweight-calculator",
              "weight-loss-calculator",
              "weight-loss-percentage-calculator",
            ]}
            excludeSlug="broca-index-calculator"
          />
        </div>
      </section>
    </main>
  );
}
