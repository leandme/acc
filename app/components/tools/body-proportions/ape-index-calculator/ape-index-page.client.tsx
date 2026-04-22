"use client";

import { useState } from "react";
import { round } from "@/app/components/tools/body-weight/shared/math";
import ApeIndexCalculator from "./ape-index-calculator";
import ApeIndexInterpretation from "./ape-index-interpretation";
import { MoreTools } from "../../template/more-tools";

export default function ApeIndexPageClient() {
  const [heightCm, setHeightCm] = useState<number | null>(null);
  const [wingspanCm, setWingspanCm] = useState<number | null>(null);
  const [ratio, setRatio] = useState<number | null>(null);
  const [differenceCm, setDifferenceCm] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Ape Index Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Calculate your ape index using wingspan-to-height ratio and wingspan-minus-height difference.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <ApeIndexCalculator
              onChange={({ heightCm, wingspanCm, ratio, differenceCm }) => {
                setHeightCm(heightCm);
                setWingspanCm(wingspanCm);
                setRatio(ratio);
                setDifferenceCm(differenceCm);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20" id="ape-index-interpretation">
          <ApeIndexInterpretation ratio={ratio} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Ape Index Calculator Measures</h2>
          <p className={pClass}>
            Ape index compares wingspan to height. A value near 1.00 means wingspan and height are similar.
            Values above 1.00 indicate longer reach relative to height, while values below 1.00 indicate
            shorter reach.
          </p>
          {heightCm != null && wingspanCm != null && ratio != null && differenceCm != null ? (
            <p className={pClass}>
              Current setup: height <strong>{round(heightCm, 1)} cm</strong>, wingspan{" "}
              <strong>{round(wingspanCm, 1)} cm</strong>, ratio <strong>{round(ratio, 2)}</strong>, difference{" "}
              <strong>{differenceCm > 0 ? "+" : ""}{round(differenceCm, 1)} cm</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How to Measure Accurately</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Measure height barefoot against a wall-mounted stadiometer or flat wall.</li>
            <li>Measure wingspan fingertip to fingertip with arms fully outstretched at shoulder height.</li>
            <li>Keep shoulders level and avoid shrugging or bending elbows.</li>
            <li>Take 2 to 3 readings and use the average.</li>
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How to Use Ape Index in Practice</h2>
          <p className={pClass}>
            Ape index is a structural metric, not a predictor of overall performance by itself. In climbing,
            combat sports, and gymnastics contexts, reach can be useful, but skill, technique, strength, and
            body composition still dominate outcomes.
          </p>
          <p className={pClass}>
            For growth and stature context, pair this with the{" "}
            <a className="text-primary underline" href="/height-calculator">
              Height Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/mid-parental-height-calculator">
              Mid-Parental Height Calculator
            </a>
            . For body proportion and waist-based metrics, compare with the{" "}
            <a className="text-primary underline" href="/waist-to-height-ratio-calculator">
              Waist to Height Ratio Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/shoulder-to-waist-ratio-calculator">
              Shoulder to Waist Ratio Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              CDC anthropometric reference dataset:
              <a className="text-primary underline ml-1" href="https://www.cdc.gov/nchs/data/series/sr_03/sr03_046.pdf">
                Anthropometric Reference Data for Children and Adults
              </a>
            </li>
            <li>
              Arm-span and height relationship in anthropometry research (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/27458781/">
                Correlation Between Arm Span and Height in Adults
              </a>
            </li>
            <li>
              NHANES anthropometric procedures manual:
              <a className="text-primary underline ml-1" href="https://wwwn.cdc.gov/nchs/data/nhanes/2017-2018/manuals/2017_Anthropometry_Procedures_Manual.pdf">
                Anthropometry Procedures Manual
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <MoreTools
            heading="More Tools"
            columns={2}
            toolSlugs={[
              "height-calculator",
              "height-estimator",
              "mid-parental-height-calculator",
              "shoulder-to-waist-ratio-calculator",
              "waist-to-height-ratio-calculator",
              "body-frame-size-calculator",
              "ffmi-calculator",
            ]}
            excludeSlug="ape-index-calculator"
          />
        </div>
      </section>
    </main>
  );
}
