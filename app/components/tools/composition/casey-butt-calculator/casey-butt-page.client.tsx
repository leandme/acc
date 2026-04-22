"use client";

import { useState } from "react";
import type { Sex } from "@/app/components/tools/body-weight/shared/math";
import { round } from "@/app/components/tools/body-weight/shared/math";
import CaseyButtCalculator from "@/app/components/tools/composition/casey-butt-calculator/casey-butt-calculator";
import CaseyButtInterpretation from "@/app/components/tools/composition/casey-butt-calculator/casey-butt-interpretation";
import { MoreTools } from "../../template/more-tools";

export default function CaseyButtPageClient() {
  const [sex, setSex] = useState<Sex>("male");
  const [potentialWeightKg, setPotentialWeightKg] = useState<number | null>(null);
  const [potentialLeanMassKg, setPotentialLeanMassKg] = useState<number | null>(null);
  const [potentialNormalizedFFMI, setPotentialNormalizedFFMI] = useState<number | null>(null);
  const [currentLeanMassKg, setCurrentLeanMassKg] = useState<number | null>(null);
  const [utilizationPct, setUtilizationPct] = useState<number | null>(null);
  const [targetBodyFatPct, setTargetBodyFatPct] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Casey Butt Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate frame-based muscular potential, projected bodyweight, and classical measurement targets.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <CaseyButtCalculator
              onChange={(payload) => {
                setSex(payload.sex);
                setPotentialWeightKg(payload.potentialWeightKg);
                setPotentialLeanMassKg(payload.potentialLeanMassKg);
                setPotentialNormalizedFFMI(payload.potentialNormalizedFFMI);
                setCurrentLeanMassKg(payload.currentLeanMassKg);
                setUtilizationPct(payload.utilizationPct);
                setTargetBodyFatPct(payload.targetBodyFatPct);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20" id="casey-butt-interpretation">
          <CaseyButtInterpretation potentialNormalizedFFMI={potentialNormalizedFFMI} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Casey Butt Calculator Estimates</h2>
          <p className={pClass}>
            This tool applies a Casey Butt style anthropometric model using height, wrist circumference, and
            ankle circumference to estimate potential bodyweight and lean mass at a chosen body-fat level.
            It also estimates classical circumference targets.
          </p>
          {potentialWeightKg != null &&
          potentialLeanMassKg != null &&
          potentialNormalizedFFMI != null &&
          currentLeanMassKg != null &&
          utilizationPct != null &&
          targetBodyFatPct != null ? (
            <p className={pClass}>
              Current estimate ({sex === "male" ? "men" : "women scaled estimate"}): potential weight{" "}
              <strong>{round(potentialWeightKg, 1)} kg</strong> at{" "}
              <strong>{round(targetBodyFatPct, 1)}%</strong> BF, with potential lean mass{" "}
              <strong>{round(potentialLeanMassKg, 1)} kg</strong> and potential normalized FFMI{" "}
              <strong>{round(potentialNormalizedFFMI, 2)}</strong>. Current lean mass is{" "}
              <strong>{round(currentLeanMassKg, 1)} kg</strong> ({round(utilizationPct, 1)}% utilization).
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How The Model Works</h2>
          <p className={pClass}>
            Casey Butt style models assume bone-structure inputs (wrist and ankle) are practical proxies for
            frame potential. Height and frame inputs are combined to project a muscular endpoint at selected
            body-fat percentage.
          </p>
          <p className={pClass}>
            This is best interpreted as a structured estimate, not a hard biological maximum.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use It With Other Muscle Tools</h2>
          <p className={pClass}>
            For a frame-adjusted FFMI ceiling model, compare with the{" "}
            <a className="text-primary underline" href="/muscular-potential-calculator">
              Muscular Potential Calculator
            </a>
            . For current lean-mass status versus natural screening ranges, compare with the{" "}
            <a className="text-primary underline" href="/natty-or-not-calculator">
              Natty or Not Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/ffmi-calculator">
              FFMI Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            If body-fat inputs are uncertain, validate with the{" "}
            <a className="text-primary underline" href="/body-fat-calculator">
              Body Fat Calculator
            </a>{" "}
            or{" "}
            <a className="text-primary underline" href="/estimate">
              photo-based estimate tool
            </a>
            .
          </p>
          <p className={pClass}>
            For a combined score that blends structural leverage with projected FFMI potential, compare with
            the{" "}
            <a className="text-primary underline" href="/bodybuilding-genetics-calculator">
              Bodybuilding Genetics Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Important Caveats</h2>
          <p className={pClass}>
            The original Casey Butt framework is male-focused and based on specific bodybuilding-era
            assumptions. This page provides a scaled estimate for women, but precision is lower outside the
            original data context.
          </p>
          <p className={pClass}>
            All anthropometric models are sensitive to body-fat and circumference error. Repeat measurements
            with consistent protocol for better trend quality.
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
              Lee RC, et al. Anthropometric prediction model for total-body skeletal muscle mass.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/10926627/">
                PubMed record
              </a>
            </li>
            <li>
              Cintineo HP, et al. Sport differences in fat-free mass index in NCAA athletes.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/35968800/">
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
              "muscular-potential-calculator",
              "natty-or-not-calculator",
              "bodybuilding-genetics-calculator",
              "ffmi-calculator",
              "muscle-mass-calculator",
              "lean-body-mass-calculator",
              "body-frame-size-calculator",
              "body-fat-calculator",
            ]}
            excludeSlug="casey-butt-calculator"
          />
        </div>
      </section>
    </main>
  );
}
