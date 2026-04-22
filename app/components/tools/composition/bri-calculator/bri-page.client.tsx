"use client";

import { useState } from "react";
import BRICalculator from "@/app/components/tools/composition/bri-calculator/bri-calculator";
import BRIInterpretation from "@/app/components/tools/composition/bri-calculator/bri-interpretation";
import { MoreTools } from "../../template/more-tools";

export default function BRIPageClient() {
  const [bri, setBri] = useState<number | null>(null);
  const [waistToHeightRatio, setWaistToHeightRatio] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">BRI Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate Body Roundness Index from waist circumference and height, then interpret where your
          result sits on practical roundness ranges.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <BRICalculator
              onChange={({ bri, waistToHeightRatio, category }) => {
                setBri(bri);
                setWaistToHeightRatio(waistToHeightRatio);
                setCategory(category);
              }}
            />
          </div>
        </div>

        <div id="bri-interpretation" className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20">
          <BRIInterpretation bri={bri} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This BRI Calculator Shows</h2>
          <p className={pClass}>
            BRI (Body Roundness Index) estimates central body roundness from your waist and height. It
            is designed to capture how much roundness is concentrated around the trunk, which can be
            useful alongside traditional body-fat methods.
          </p>
          <p className={pClass}>
            This result is most useful as a trend metric. Keep measurement technique consistent and track
            direction over time rather than chasing one isolated reading.
          </p>
          {bri != null && waistToHeightRatio != null && category ? (
            <p className={pClass}>
              Current result: <strong>BRI {bri.toFixed(2)}</strong>, waist-to-height ratio
              <strong> {waistToHeightRatio.toFixed(3)}</strong>, category <strong>{category}</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>BRI Formula Used</h2>
          <p className={pClass}>
            This calculator uses the standard BRI equation with waist and height in the same units
            (internally centimeters):
          </p>
          <div className="rounded-2xl border bg-white p-6 text-sm sm:text-base text-gray-800 overflow-x-auto">
            <p className="font-mono">
              BRI = 364.2 - 365.5 x sqrt(1 - ((waist / (2 x pi))^2) / ((0.5 x height)^2))
            </p>
          </div>
          <p className={pClass}>
            Because the formula uses a ratio-like geometry term, imperial and metric inputs are both
            valid as long as waist and height use matching units.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Measure Inputs Consistently</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Measure height without shoes against a wall.</li>
            <li>Measure waist at navel level after a normal exhale.</li>
            <li>Keep the tape level and snug without compressing skin.</li>
            <li>Take 2 to 3 readings and use the average.</li>
            <li>Repeat at similar time of day and hydration state.</li>
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Interpret BRI Alongside Other Metrics</h2>
          <p className={pClass}>
            BRI is not a diagnosis. It is a practical indicator of waist-centered roundness that can help
            contextualize body-fat tracking.
          </p>
          <p className={pClass}>
            For related waist-height estimation, compare with the{" "}
            <a className="text-primary underline" href="/tools">
              RFM Calculator
            </a>
            . For a hip-height alternative, compare with the{" "}
            <a className="text-primary underline" href="/tools">
              BAI Calculator
            </a>
            . For a broader risk-screening estimate, add the{" "}
            <a className="text-primary underline" href="/tools">
              Visceral Fat Calculator
            </a>
            . For proportion-based silhouette context, compare with the{" "}
            <a className="text-primary underline" href="/tools">
              Body Shape Calculator
            </a>
            {" "}or the{" "}
            <a className="text-primary underline" href="/body-shape-analyzer">
              Body Shape Analyzer
            </a>
            .
          </p>
          <p className={pClass}>
            To separate lean-mass progress from fat trends, pair BRI with the{" "}
            <a className="text-primary underline" href="/tools">
              Lean Body Mass Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/tools">
              FFMI Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Limitations</h2>
          <p className={pClass}>
            BRI depends on tape-measure precision and assumes typical body geometry. It does not directly
            measure fat tissue and can still miss individual differences in frame size, muscle mass, and
            fat distribution.
          </p>
          <p className={pClass}>
            Use BRI with photos, performance markers, and other composition tools for stronger context.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Thomas DM, et al. Relationships between body roundness with body fat and visceral
              adipose tissue.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/23519954/">
                PubMed record
              </a>
            </li>
            <li>
              Krakauer NY, Krakauer JC. A new body shape index and risk association.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/22815707/">
                PubMed record
              </a>
            </li>
            <li>
              CDC guidance for adult BMI category interpretation:
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
              "rfm-calculator",
              "bai-calculator",
              "visceral-fat-calculator",
              "body-fat-calculator",
              "lean-body-mass-calculator",
              "ffmi-calculator",
              "body-frame-size-calculator",
              "body-visualizer",
              "body-shape-calculator",
            ]}
            excludeSlug="bri-calculator"
          />
        </div>
      </section>
    </main>
  );
}
