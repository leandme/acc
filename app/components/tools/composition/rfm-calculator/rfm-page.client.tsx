"use client";

import { useState } from "react";
import RFMCalculator from "@/app/components/tools/composition/rfm-calculator/rfm-calculator";
import RFMInterpretation from "@/app/components/tools/composition/rfm-calculator/rfm-interpretation";
import { MoreTools } from "../../template/more-tools";

type Gender = "male" | "female";

export default function RFMCalculatorPageClient() {
  const [gender, setGender] = useState<Gender>("male");
  const [rfm, setRfm] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">RFM Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate body fat percentage with Relative Fat Mass (RFM) using your height, waist, and sex.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <RFMCalculator
              onChange={({ gender, rfm }) => {
                setGender(gender);
                setRfm(rfm);
              }}
            />
          </div>
        </div>

        <div id="rfm-interpretation" className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20">
          <RFMInterpretation gender={gender} rfm={rfm} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What Is Relative Fat Mass (RFM)?</h2>
          <p className={pClass}>
            Relative Fat Mass is a body-fat estimate based on height and waist circumference. Unlike methods
            that require neck, hip, or weight inputs, RFM is intentionally simple and relies on a
            waist-to-height relationship adjusted by sex.
          </p>
          <p className={pClass}>
            The output here is shown as a whole-number percentage so it is easier to compare week-to-week.
            Use it as a trend tool, not a medical diagnosis.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>RFM Formula Used</h2>
          <p className={pClass}>This calculator uses the classic equations:</p>
          <div className="rounded-2xl border bg-white p-6 text-sm sm:text-base text-gray-800 overflow-x-auto">
            <p className="font-semibold">Men</p>
            <p className="mt-1 font-mono">RFM = 64 - 20 x (height / waist)</p>
            <p className="mt-4 font-semibold">Women</p>
            <p className="mt-1 font-mono">RFM = 76 - 20 x (height / waist)</p>
          </div>
          <p className={pClass}>
            Height and waist must be in the same units. The ratio makes the formula unit-consistent for
            inches or centimeters.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Measure Waist For Better Consistency</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Measure at the same point each time (usually around navel level).</li>
            <li>Keep the tape level and snug without compressing skin.</li>
            <li>Measure after a normal exhale and avoid stomach bracing.</li>
            <li>Take 2 to 3 readings and use the average.</li>
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use This Result</h2>
          <p className={pClass}>
            RFM is best used to track direction over time. If measurements are consistent, the trend can
            show whether your body-fat level is moving up or down even if the exact percentage is imperfect.
          </p>
          <p className={pClass}>
            For practical tracking, pair RFM with waist logs, progress photos, and performance markers.
            If you also want a height/weight-based lean-mass estimate, run the{" "}
            <a className="text-primary underline" href="/lean-body-mass-calculator">
              Lean Body Mass Calculator
            </a>
            . For an anthropometric skeletal muscle estimate, compare with the{" "}
            <a className="text-primary underline" href="/muscle-mass-calculator">
              Muscle Mass Calculator
            </a>
            . For waist-height roundness context, use the{" "}
            <a className="text-primary underline" href="/bri-calculator">
              BRI Calculator
            </a>
            . For hip-adjusted waist context, use the{" "}
            <a className="text-primary underline" href="/waist-to-hip-ratio-calculator">
              Waist to Hip Ratio Calculator
            </a>
            . For waist-height screening context, use the{" "}
            <a className="text-primary underline" href="/waist-to-height-ratio-calculator">
              Waist to Height Ratio Calculator
            </a>
            . For hip-height adiposity context, use the{" "}
            <a className="text-primary underline" href="/bai-calculator">
              BAI Calculator
            </a>
            . For caliper-based body-fat measurements, use the{" "}
            <a className="text-primary underline" href="/skinfold-body-fat-calculator">
              Skinfold Body Fat Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            For deeper context, read{" "}
            <a className="text-primary underline" href="/guides/why-body-fat-calculators-are-inaccurate">Why Body Fat Calculators Are Inaccurate</a>{" "}
            and{" "}
            <a className="text-primary underline" href="/guides/body-fat-calculator-vs-estimator">Body Fat Calculator vs Body Fat Estimator</a>.
          </p>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <MoreTools
            heading="More Tools"
            columns={2}
            toolSlugs={[
              "estimate",
              "body-fat-calculator",
              "bai-calculator",
              "bri-calculator",
              "waist-to-height-ratio-calculator",
              "skinfold-body-fat-calculator",
              "muscle-mass-calculator",
              "lean-body-mass-calculator",
              "body-frame-size-calculator",
              "army-body-fat-calculator",
              "ffmi-calculator",
            ]}
            excludeSlug="rfm-calculator"
          />
        </div>
      </section>
    </main>
  );
}
