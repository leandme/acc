"use client";

import { useState } from "react";
import type { Sex } from "@/app/components/tools/body-weight/shared/math";
import { round } from "@/app/components/tools/body-weight/shared/math";
import MuscularPotentialCalculator from "@/app/components/tools/composition/muscular-potential-calculator/muscular-potential-calculator";
import MuscularPotentialInterpretation from "@/app/components/tools/composition/muscular-potential-calculator/muscular-potential-interpretation";
import { MoreTools } from "../../template/more-tools";

export default function MuscularPotentialPageClient() {
  const [sex, setSex] = useState<Sex>("male");
  const [frameLabel, setFrameLabel] = useState<string | null>(null);
  const [utilizationPct, setUtilizationPct] = useState<number | null>(null);
  const [maxLeanMassKg, setMaxLeanMassKg] = useState<number | null>(null);
  const [currentLeanMassKg, setCurrentLeanMassKg] = useState<number | null>(null);
  const [maxWeightAtTargetBfKg, setMaxWeightAtTargetBfKg] = useState<number | null>(null);
  const [targetBodyFatPct, setTargetBodyFatPct] = useState<number | null>(null);
  const [normalizedCeilingFFMI, setNormalizedCeilingFFMI] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Muscular Potential Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate your modelled natural lean-mass ceiling using height, frame context, and body-fat inputs.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <MuscularPotentialCalculator
              onChange={(payload) => {
                setSex(payload.sex);
                setFrameLabel(payload.frameLabel);
                setUtilizationPct(payload.utilizationPct);
                setMaxLeanMassKg(payload.maxLeanMassKg);
                setCurrentLeanMassKg(payload.currentLeanMassKg);
                setMaxWeightAtTargetBfKg(payload.maxWeightAtTargetBfKg);
                setTargetBodyFatPct(payload.targetBodyFatPct);
                setNormalizedCeilingFFMI(payload.normalizedCeilingFFMI);
              }}
            />
          </div>
        </div>

        <div
          className="w-full max-w-3xl mx-auto mt-20 lg:mt-40"
          id="muscular-potential-interpretation"
        >
          <MuscularPotentialInterpretation utilizationPct={utilizationPct} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Muscular Potential Calculator Estimates</h2>
          <p className={pClass}>
            This tool estimates a modelled natural lean-mass ceiling by combining height-normalized FFMI
            limits with frame-size context from wrist-to-height ratio. It then compares your current lean
            mass to that ceiling.
          </p>
          {utilizationPct != null &&
          maxLeanMassKg != null &&
          currentLeanMassKg != null &&
          maxWeightAtTargetBfKg != null &&
          targetBodyFatPct != null &&
          normalizedCeilingFFMI != null &&
          frameLabel ? (
            <p className={pClass}>
              Current estimate ({sex === "male" ? "men" : "women"}, {frameLabel} frame):{" "}
              <strong>{round(utilizationPct, 1)}%</strong> of modelled potential. Current lean mass is{" "}
              <strong>{round(currentLeanMassKg, 1)} kg</strong> versus modelled ceiling{" "}
              <strong>{round(maxLeanMassKg, 1)} kg</strong>, with weight at{" "}
              <strong>{round(targetBodyFatPct, 1)}%</strong> BF estimated near{" "}
              <strong>{round(maxWeightAtTargetBfKg, 1)} kg</strong>. Ceiling normalized FFMI is{" "}
              <strong>{round(normalizedCeilingFFMI, 2)}</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Model Logic</h2>
          <p className={pClass}>The calculator uses a practical sequence:</p>
          <ol className="list-decimal pl-6 space-y-2 text-lg leading-relaxed">
            <li>Estimate current lean mass from body weight and body-fat percentage.</li>
            <li>Estimate frame-size context from height-to-wrist ratio.</li>
            <li>Apply a frame-adjusted normalized-FFMI ceiling and convert to lean-mass potential.</li>
            <li>Compare current lean mass against ceiling and estimate weight at chosen target body fat.</li>
          </ol>
          <p className={pClass}>
            This is a heuristic tool for planning and trend context, not a physiological hard limit.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use It In Practice</h2>
          <p className={pClass}>
            If utilization is low, the focus is usually building training quality and consistency. If
            utilization is high, realistic expectations should shift toward slower gains and better
            measurement precision.
          </p>
          <p className={pClass}>
            For direct FFMI comparison, use the{" "}
            <a className="text-primary underline" href="/ffmi-calculator">
              FFMI Calculator
            </a>
            . For frame context, use the{" "}
            <a className="text-primary underline" href="/body-frame-size-calculator">
              Body Frame Size Calculator
            </a>
            . For natural-vs-suspicious screening context, compare with the{" "}
            <a className="text-primary underline" href="/natty-or-not-calculator">
              Natty or Not Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            If you want an anthropometric bodybuilding model using wrist and ankle structure, compare with
            the{" "}
            <a className="text-primary underline" href="/casey-butt-calculator">
              Casey Butt Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            If you want a single composite score blending structure leverage and projected potential, use the{" "}
            <a className="text-primary underline" href="/bodybuilding-genetics-calculator">
              Bodybuilding Genetics Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Limitations</h2>
          <p className={pClass}>
            Model outputs are sensitive to body-fat error. Underestimating body fat can inflate lean-mass
            and potential-utilization outputs. Hydration, glycogen, and inconsistent measurement timing can
            also shift results.
          </p>
          <p className={pClass}>
            Genetics, training age, sport history, and injury history are not fully captured by simplified
            anthropometric models.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Kouri EM, et al. Fat-free mass index in users and nonusers of anabolic-androgenic steroids.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/7496846/">
                PubMed record
              </a>
            </li>
            <li>
              Cintineo HP, et al. Sport differences in fat-free mass index in NCAA athletes.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/35968800/">
                PubMed record
              </a>
            </li>
            <li>
              Helms ER, et al. Evidence-based recommendations for natural bodybuilding contest prep.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/23679146/">
                PubMed record
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <MoreTools
            heading="More Tools"
            columns={2}
            toolSlugs={[
              "ffmi-calculator",
              "natty-or-not-calculator",
              "casey-butt-calculator",
              "bodybuilding-genetics-calculator",
              "muscle-mass-calculator",
              "lean-body-mass-calculator",
              "body-frame-size-calculator",
              "body-fat-calculator",
              "rfm-calculator",
            ]}
            excludeSlug="muscular-potential-calculator"
          />
        </div>
      </section>
    </main>
  );
}
