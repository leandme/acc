"use client";

import { useState } from "react";
import type { Sex } from "@/app/components/tools/body-weight/shared/math";
import { round } from "@/app/components/tools/body-weight/shared/math";
import BodybuildingGeneticsCalculator from "@/app/components/tools/composition/bodybuilding-genetics-calculator/bodybuilding-genetics-calculator";
import BodybuildingGeneticsInterpretation from "@/app/components/tools/composition/bodybuilding-genetics-calculator/bodybuilding-genetics-interpretation";
import { MoreTools } from "../../template/more-tools";

export default function BodybuildingGeneticsPageClient() {
  const [sex, setSex] = useState<Sex>("male");
  const [geneticsScore, setGeneticsScore] = useState<number | null>(null);
  const [structureScore, setStructureScore] = useState<number | null>(null);
  const [potentialScore, setPotentialScore] = useState<number | null>(null);
  const [currentExecutionScore, setCurrentExecutionScore] = useState<number | null>(null);
  const [potentialNormalizedFFMI, setPotentialNormalizedFFMI] = useState<number | null>(null);
  const [currentNormalizedFFMI, setCurrentNormalizedFFMI] = useState<number | null>(null);
  const [potentialWeightKg, setPotentialWeightKg] = useState<number | null>(null);
  const [targetBodyFatPct, setTargetBodyFatPct] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Bodybuilding Genetics Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate a modelled genetics score for muscular development from frame structure and projected
          FFMI potential.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <BodybuildingGeneticsCalculator
              onChange={(payload) => {
                setSex(payload.sex);
                setGeneticsScore(payload.geneticsScore);
                setStructureScore(payload.structureScore);
                setPotentialScore(payload.potentialScore);
                setCurrentExecutionScore(payload.currentExecutionScore);
                setPotentialNormalizedFFMI(payload.potentialNormalizedFFMI);
                setCurrentNormalizedFFMI(payload.currentNormalizedFFMI);
                setPotentialWeightKg(payload.potentialWeightKg);
                setTargetBodyFatPct(payload.targetBodyFatPct);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20" id="bodybuilding-genetics-interpretation">
          <BodybuildingGeneticsInterpretation geneticsScore={geneticsScore} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Bodybuilding Genetics Calculator Estimates</h2>
          <p className={pClass}>
            This calculator gives a practical, modelled genetics score for bodybuilding-oriented muscular
            development. It combines frame structure and potential muscularity estimates rather than using
            one single metric.
          </p>
          {geneticsScore != null &&
          structureScore != null &&
          potentialScore != null &&
          currentExecutionScore != null &&
          potentialNormalizedFFMI != null &&
          currentNormalizedFFMI != null &&
          potentialWeightKg != null &&
          targetBodyFatPct != null ? (
            <p className={pClass}>
              Current estimate ({sex === "male" ? "men" : "women scaled estimate"}): genetics score{" "}
              <strong>{round(geneticsScore, 1)}</strong> with structure score{" "}
              <strong>{round(structureScore, 1)}</strong>, potential score{" "}
              <strong>{round(potentialScore, 1)}</strong>, and execution score{" "}
              <strong>{round(currentExecutionScore, 1)}</strong>. Projected potential normalized FFMI is{" "}
              <strong>{round(potentialNormalizedFFMI, 2)}</strong> and projected body weight at{" "}
              <strong>{round(targetBodyFatPct, 1)}%</strong> body fat is{" "}
              <strong>{round(potentialWeightKg, 1)} kg</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Scoring Model</h2>
          <p className={pClass}>The composite model uses three layers:</p>
          <ol className="list-decimal pl-6 space-y-2 text-lg leading-relaxed">
            <li>
              Structure score from frame leverage index: wrist and ankle circumferences relative to height.
            </li>
            <li>Potential score from projected normalized FFMI at selected target body fat.</li>
            <li>Weighted composite: genetics score = 70% potential score + 30% structure score.</li>
          </ol>
          <p className={pClass}>
            Current execution score is informational only. It shows where current normalized FFMI sits versus
            modelled potential and is not part of the composite weighting.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use This Score</h2>
          <p className={pClass}>
            Use this output for expectation-setting and planning. It helps identify whether slower progress is
            more likely due to training execution or biological leverage limits.
          </p>
          <p className={pClass}>
            For direct FFMI context, compare with the{" "}
            <a className="text-primary underline" href="/ffmi-calculator">
              FFMI Calculator
            </a>
            . For frame-adjusted natural ceiling screening, use the{" "}
            <a className="text-primary underline" href="/natty-or-not-calculator">
              Natty or Not Calculator
            </a>
            . For ceiling utilization and target-weight planning, use the{" "}
            <a className="text-primary underline" href="/muscular-potential-calculator">
              Muscular Potential Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            If you want an anthropometric bodybuilding model centered on wrist/ankle structure and estimated
            circumference targets, compare this against the{" "}
            <a className="text-primary underline" href="/casey-butt-calculator">
              Casey Butt Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Limitations and Bias Sources</h2>
          <p className={pClass}>
            This is a heuristic model, not a direct genetic test and not a medical diagnostic tool. It does
            not capture all contributors to physique outcomes, including training age, injury history,
            nutrition adherence, sleep, and drug use.
          </p>
          <p className={pClass}>
            Body-fat error can distort both current and projected FFMI. For cleaner trend quality, repeat
            inputs under consistent conditions and cross-check body-fat assumptions with methods like the{" "}
            <a className="text-primary underline" href="/body-fat-calculator">
              Body Fat Calculator
            </a>{" "}
            or{" "}
            <a className="text-primary underline" href="/estimate">
              photo-based estimator
            </a>
            .
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
              Lee RC, et al. Anthropometric prediction model for total-body skeletal muscle mass.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/10926627/">
                PubMed record
              </a>
            </li>
            <li>
              Helms ER, et al. Evidence-based recommendations for natural bodybuilding contest preparation.
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
              "natty-or-not-calculator",
              "muscular-potential-calculator",
              "casey-butt-calculator",
              "ffmi-calculator",
              "muscle-mass-calculator",
              "lean-body-mass-calculator",
              "body-frame-size-calculator",
              "body-fat-calculator",
            ]}
            excludeSlug="bodybuilding-genetics-calculator"
          />
        </div>
      </section>
    </main>
  );
}
