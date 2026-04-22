"use client";

import { useState } from "react";
import WeightLossPercentageCalculator from "@/app/components/tools/body-weight/weight-loss-percentage-calculator/weight-loss-percentage-calculator";
import WeightLossPercentageInterpretation from "@/app/components/tools/body-weight/weight-loss-percentage-calculator/weight-loss-percentage-interpretation";
import { round } from "@/app/components/tools/body-weight/shared/math";
import { MoreTools } from "../../template/more-tools";

export default function WeightLossPercentagePageClient() {
  const [weightLossPct, setWeightLossPct] = useState<number | null>(null);
  const [weightChangeKg, setWeightChangeKg] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Weight Loss Percentage Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Calculate how much body weight you have lost as a percentage of your starting weight.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <WeightLossPercentageCalculator
              onChange={({ weightLossPct, weightChangeKg }) => {
                setWeightLossPct(weightLossPct);
                setWeightChangeKg(weightChangeKg);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20" id="weight-loss-percentage-interpretation">
          <WeightLossPercentageInterpretation value={weightLossPct} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Calculator Shows</h2>
          <p className={pClass}>
            This tool calculates percentage change from a starting body weight:
            <strong> ((starting - current) / starting) x 100</strong>.
          </p>
          <p className={pClass}>
            It is useful for progress reviews because percentage-based change is easier to compare across
            different starting weights.
          </p>
          {weightLossPct != null && weightChangeKg != null ? (
            <p className={pClass}>
              Current result: <strong>{round(weightLossPct, 1)}%</strong> ({round(weightChangeKg, 1)} kg net
              change).
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Interpret Weight Loss Percentage</h2>
          <p className={pClass}>
            Public health guidance often treats a 5-10% reduction in body weight as a meaningful first
            target for improving blood pressure, blood glucose, and lipid markers.
          </p>
          <p className={pClass}>
            Larger reductions can be appropriate depending on baseline status and medical context, but the
            key is sustainability. Pair percentage change with training performance, energy levels, and
            adherence.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              NIDDK guidance on weight-management goals:
              <a className="text-primary underline ml-1" href="https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity">
                NIDDK Adult Overweight and Obesity
              </a>
            </li>
            <li>
              CDC obesity and healthy-weight resources:
              <a className="text-primary underline ml-1" href="https://www.cdc.gov/healthy-weight-growth/losing-weight/index.html">
                CDC Losing Weight
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
              "bmr-calculator",
              "intermittent-fasting-calculator",
              "weight-loss-calculator",
              "fasting-weight-loss-calculator",
              "bmi-calculator",
              "ideal-weight-calculator",
              "overweight-calculator",
              "adjusted-body-weight-calculator",
              "ponderal-index-calculator",
            ]}
            excludeSlug="weight-loss-percentage-calculator"
          />
        </div>
      </section>
    </main>
  );
}
