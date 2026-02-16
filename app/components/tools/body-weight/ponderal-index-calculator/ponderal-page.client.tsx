"use client";

import { useMemo, useState } from "react";
import PonderalIndexCalculator from "@/app/components/tools/body-weight/ponderal-index-calculator/ponderal-index-calculator";
import PonderalInterpretation from "@/app/components/tools/body-weight/ponderal-index-calculator/ponderal-interpretation";
import { buildPonderalRanges } from "@/app/components/tools/body-weight/ponderal-index-calculator/ponderal-ranges";
import type { RangeBucket } from "@/app/components/tools/body-weight/shared/ui";
import { round } from "@/app/components/tools/body-weight/shared/math";
import { MoreTools } from "../../template/more-tools";

export default function PonderalPageClient() {
  const [ponderalIndex, setPonderalIndex] = useState<number | null>(null);
  const [equivalentBmi, setEquivalentBmi] = useState<number | null>(null);
  const defaultRanges = useMemo(() => buildPonderalRanges(1.75), []);
  const [ranges, setRanges] = useState<RangeBucket[]>(defaultRanges);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Ponderal Index Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Calculate Ponderal Index (Rohrer index) and convert it to height-adjusted BMI-equivalent categories.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <PonderalIndexCalculator
              onChange={({ ponderalIndex, equivalentBmi, ranges }) => {
                setPonderalIndex(ponderalIndex);
                setEquivalentBmi(equivalentBmi);
                setRanges(ranges);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40" id="ponderal-interpretation">
          <PonderalInterpretation ponderalIndex={ponderalIndex} ranges={ranges} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What Is Ponderal Index?</h2>
          <p className={pClass}>
            Ponderal Index (PI) is calculated as weight (kg) divided by height cubed (m3). Compared with BMI,
            PI scales weight by an additional power of height and can be useful in certain anthropometric
            comparisons.
          </p>
          {ponderalIndex != null && equivalentBmi != null ? (
            <p className={pClass}>
              Current result: PI <strong>{round(ponderalIndex, 2)}</strong>, equivalent BMI{" "}
              <strong>{round(equivalentBmi, 1)}</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Why Height-Adjusted PI Ranges Matter</h2>
          <p className={pClass}>
            Unlike BMI cutoffs, PI boundaries change with height when you map to equivalent adult BMI
            categories. This calculator updates interpretation ranges using your current height so the
            classification remains comparable.
          </p>
          <p className={pClass}>
            For direct BMI outputs, use the{" "}
            <a className="text-primary underline" href="/bmi-calculator">
              BMI Calculator
            </a>
            . For broader weight targets, pair with the{" "}
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
              Rohrer/Ponderal index discussion in anthropometric literature:
              <a className="text-primary underline ml-1" href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3295875/">
                PMC Review Including Rohrer Index Context
              </a>
            </li>
            <li>
              CDC adult BMI category reference (used for equivalent mapping):
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
              "bmi-calculator",
              "overweight-calculator",
              "ideal-weight-calculator",
              "broca-index-calculator",
              "weight-loss-calculator",
              "weight-loss-percentage-calculator",
            ]}
            excludeSlug="ponderal-index-calculator"
          />
        </div>
      </section>
    </main>
  );
}
