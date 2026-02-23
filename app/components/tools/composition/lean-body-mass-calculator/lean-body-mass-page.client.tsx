"use client";

import { useState } from "react";
import LeanBodyMassCalculator from "@/app/components/tools/composition/lean-body-mass-calculator/lean-body-mass-calculator";
import LeanBodyMassInterpretation from "@/app/components/tools/composition/lean-body-mass-calculator/lean-body-mass-interpretation";
import { MoreTools } from "../../template/more-tools";

type Gender = "male" | "female";

export default function LeanBodyMassCalculatorPageClient() {
  const [gender, setGender] = useState<Gender>("male");
  const [leanMassPct, setLeanMassPct] = useState<number | null>(null);
  const [lbmKg, setLbmKg] = useState<number | null>(null);
  const [lbmi, setLbmi] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Lean Body Mass Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate lean body mass with Boer, James, and Hume equations using your height, weight, and
          sex.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <LeanBodyMassCalculator
              onChange={({ gender, leanMassPct, lbmKg, lbmi }) => {
                setGender(gender);
                setLeanMassPct(leanMassPct);
                setLbmKg(lbmKg);
                setLbmi(lbmi);
              }}
            />
          </div>
        </div>

        <div id="lean-body-mass-interpretation" className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <LeanBodyMassInterpretation gender={gender} leanMassPct={leanMassPct} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Lean Body Mass Calculator Shows</h2>
          <p className={pClass}>
            Lean body mass (LBM) is everything in your body except fat: muscle, organs, bone, and body
            water. This calculator estimates your LBM from height and weight using three commonly cited
            formulas and shows both absolute lean mass and lean-mass percentage.
          </p>
          <p className={pClass}>
            Use these numbers to track trend direction over time. Absolute values can vary by formula,
            hydration status, and how closely your body matches the assumptions in each equation.
          </p>
          {lbmKg != null && leanMassPct != null && lbmi != null ? (
            <p className={pClass}>
              Current estimate: <strong>{lbmKg.toFixed(1)} kg</strong> lean mass,
              <strong> {leanMassPct.toFixed(1)}%</strong> lean mass percentage, and
              <strong> LBMI {lbmi.toFixed(2)}</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Formulas Used</h2>
          <p className={pClass}>This tool calculates three standard LBM equations and provides an average:</p>
          <div className="rounded-2xl border bg-white p-6 text-sm sm:text-base text-gray-800 overflow-x-auto">
            <p className="font-semibold">Boer</p>
            <p className="mt-1 font-mono">Men: LBM = 0.407 x weight(kg) + 0.267 x height(cm) - 19.2</p>
            <p className="mt-1 font-mono">Women: LBM = 0.252 x weight(kg) + 0.473 x height(cm) - 48.3</p>

            <p className="mt-4 font-semibold">James</p>
            <p className="mt-1 font-mono">Men: LBM = 1.10 x weight(kg) - 128 x (weight/height)^2</p>
            <p className="mt-1 font-mono">Women: LBM = 1.07 x weight(kg) - 148 x (weight/height)^2</p>

            <p className="mt-4 font-semibold">Hume</p>
            <p className="mt-1 font-mono">Men: LBM = 0.32810 x weight(kg) + 0.33929 x height(cm) - 29.5336</p>
            <p className="mt-1 font-mono">Women: LBM = 0.29569 x weight(kg) + 0.41813 x height(cm) - 43.2933</p>
          </div>
          <p className={pClass}>
            The formula table in the results panel highlights your selected method so you can compare how
            each equation shifts the estimate.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Interpret Your Result</h2>
          <p className={pClass}>
            Higher lean body mass can reflect more muscle and generally a lower fat share, but context
            matters. Height, frame size, and training history all affect what is realistic.
            For frame-only context, run the{" "}
            <a className="text-primary underline" href="/body-frame-size-calculator">
              Body Frame Size Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            For weekly tracking, use the same conditions and compare trend movement rather than chasing a
            perfect one-time value.
          </p>
          <p className={pClass}>
            If you want a skeletal-muscle-specific estimate from circumferences and skinfolds, use the{" "}
            <a className="text-primary underline" href="/muscle-mass-calculator">
              Muscle Mass Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            If you want to compare your height-adjusted muscularity to practical natural ceilings, run the{" "}
            <a className="text-primary underline" href="/natty-or-not-calculator">
              Natty or Not Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            For a composite structure-and-potential score, use the{" "}
            <a className="text-primary underline" href="/bodybuilding-genetics-calculator">
              Bodybuilding Genetics Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            If you want body-fat context alongside this result, use the{" "}
            <a className="text-primary underline" href="/body-fat-calculator">
              Body Fat Calculator
            </a>{" "}
            or the{" "}
            <a className="text-primary underline" href="/rfm-calculator">
              RFM Calculator
            </a>
            . For waist-centered roundness, add the{" "}
            <a className="text-primary underline" href="/bri-calculator">
              BRI Calculator
            </a>
            , and for hip-height adiposity use the{" "}
            <a className="text-primary underline" href="/bai-calculator">
              BAI Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Lean Body Mass vs FFMI</h2>
          <p className={pClass}>
            Lean body mass is an absolute amount (kg or lbs). FFMI adjusts lean mass for height so
            muscularity comparisons are fairer across different body sizes.
          </p>
          <p className={pClass}>
            After estimating LBM, use the{" "}
            <a className="text-primary underline" href="/ffmi-calculator">
              FFMI Calculator
            </a>{" "}
            if you want a height-normalized muscularity score.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Boer P. Estimated lean body mass as an index for normalization of body fluid volumes
              in humans.
              <a
                className="text-primary underline ml-1"
                href="https://pubmed.ncbi.nlm.nih.gov/6496691/"
              >
                PubMed record
              </a>
            </li>
            <li>
              Janmahasatian S, et al. Quantification of lean bodyweight.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/16176118/">
                PubMed record
              </a>
            </li>
            <li>
              Pai MP. Drug dosing based on weight and body size in obese adults.
              <a
                className="text-primary underline ml-1"
                href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4841935/"
              >
                Free full text (PMC)
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <MoreTools
            heading="More Tools"
            columns={2}
            toolSlugs={[
              "muscle-mass-calculator",
              "ffmi-calculator",
              "natty-or-not-calculator",
              "bodybuilding-genetics-calculator",
              "body-frame-size-calculator",
              "bai-calculator",
              "bri-calculator",
              "body-fat-calculator",
              "rfm-calculator",
              "visceral-fat-calculator",
            ]}
            excludeSlug="lean-body-mass-calculator"
          />
        </div>
      </section>
    </main>
  );
}
