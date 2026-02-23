"use client";

import { useState } from "react";
import type { Sex } from "@/app/components/tools/body-weight/shared/math";
import { round } from "@/app/components/tools/body-weight/shared/math";
import MuscleMassCalculator from "@/app/components/tools/composition/muscle-mass-calculator/muscle-mass-calculator";
import MuscleMassInterpretation from "@/app/components/tools/composition/muscle-mass-calculator/muscle-mass-interpretation";
import { MoreTools } from "../../template/more-tools";

export default function MuscleMassPageClient() {
  const [sex, setSex] = useState<Sex>("male");
  const [smmKg, setSmmKg] = useState<number | null>(null);
  const [muscleMassPct, setMuscleMassPct] = useState<number | null>(null);
  const [muscleMassIndex, setMuscleMassIndex] = useState<number | null>(null);
  const [raceLabel, setRaceLabel] = useState<string | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Muscle Mass Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate skeletal muscle mass (kg), skeletal muscle percentage, and muscle-mass index from
          anthropometric measurements.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <MuscleMassCalculator
              onChange={({ sex, raceLabel, smmKg, muscleMassPct, muscleMassIndex }) => {
                setSex(sex);
                setRaceLabel(raceLabel);
                setSmmKg(smmKg);
                setMuscleMassPct(muscleMassPct);
                setMuscleMassIndex(muscleMassIndex);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40" id="muscle-mass-interpretation">
          <MuscleMassInterpretation sex={sex} muscleMassPct={muscleMassPct} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Muscle Mass Calculator Estimates</h2>
          <p className={pClass}>
            This tool estimates total skeletal muscle mass using anthropometric equations that combine
            height, circumferences, skinfolds, age, sex, and race-factor adjustments.
          </p>
          {smmKg != null && muscleMassPct != null && muscleMassIndex != null && raceLabel ? (
            <p className={pClass}>
              Current estimate: <strong>{round(smmKg, 1)} kg</strong> skeletal muscle,{" "}
              <strong>{round(muscleMassPct, 1)}%</strong> relative skeletal muscle, and muscle-mass index{" "}
              <strong>{round(muscleMassIndex, 2)} kg/m2</strong> ({raceLabel} factor selected).
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Equation Used</h2>
          <p className={pClass}>
            The calculator uses the Lee et al. anthropometric skeletal muscle mass model:
          </p>
          <div className="rounded-2xl border bg-white p-6 text-sm sm:text-base text-gray-800 overflow-x-auto">
            <p className="font-mono">
              SMM (kg) = Height(m) x (0.00744 x CAG² + 0.00088 x CTG² + 0.00441 x CCG²)
            </p>
            <p className="font-mono mt-2">
              + 2.4 x Sex - 0.048 x Age + Race + 7.8
            </p>
            <p className="mt-4 text-gray-700">
              where CAG, CTG, and CCG are skinfold-corrected arm, thigh, and calf girths.
            </p>
          </div>
          <p className={pClass}>
            This is still an estimate. Use consistent measurement technique and compare trends over time
            rather than relying on one single reading.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Measure Inputs Consistently</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Measure circumferences at the same anatomical landmarks each session.</li>
            <li>Use the same tape tension and body posture.</li>
            <li>Take skinfolds with calipers at the same sites and same side of the body.</li>
            <li>Average 2 to 3 readings per site before entering values.</li>
          </ul>
          <p className={pClass}>
            For a simpler estimate from height and weight only, compare with the{" "}
            <a className="text-primary underline" href="/lean-body-mass-calculator">
              Lean Body Mass Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use This With Other Body Composition Tools</h2>
          <p className={pClass}>
            Skeletal muscle mass gives absolute tissue context, while FFMI normalizes lean mass to height.
            Use both when evaluating muscularity progress.
          </p>
          <p className={pClass}>
            Pair this with the{" "}
            <a className="text-primary underline" href="/ffmi-calculator">
              FFMI Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/natty-or-not-calculator">
              Natty or Not Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/body-fat-calculator">
              Body Fat Calculator
            </a>{" "}
            to separate muscle-focused and fat-focused trends.
          </p>
          <p className={pClass}>
            For a combined structure-and-potential muscle profile, compare with the{" "}
            <a className="text-primary underline" href="/bodybuilding-genetics-calculator">
              Bodybuilding Genetics Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Lee RC, et al. Anthropometric prediction model for total-body skeletal muscle mass:
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/10926627/">
                PubMed record
              </a>
            </li>
            <li>
              Janssen I, et al. Skeletal muscle mass and distribution in adults:
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/10617152/">
                PubMed record
              </a>
            </li>
            <li>
              Janssen I, et al. Relative skeletal muscle mass index and functional risk classes:
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/12082176/">
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
              "lean-body-mass-calculator",
              "ffmi-calculator",
              "natty-or-not-calculator",
              "muscular-potential-calculator",
              "casey-butt-calculator",
              "bodybuilding-genetics-calculator",
              "body-frame-size-calculator",
              "body-fat-calculator",
              "rfm-calculator",
              "bri-calculator",
              "bai-calculator",
            ]}
            excludeSlug="muscle-mass-calculator"
          />
        </div>
      </section>
    </main>
  );
}
