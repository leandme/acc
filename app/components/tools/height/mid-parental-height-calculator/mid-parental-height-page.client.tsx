"use client";

import { useState } from "react";
import { round } from "@/app/components/tools/body-weight/shared/math";
import MidParentalHeightCalculator from "@/app/components/tools/height/mid-parental-height-calculator/mid-parental-height-calculator";
import MidParentalHeightInterpretation from "@/app/components/tools/height/mid-parental-height-calculator/mid-parental-height-interpretation";
import { MoreTools } from "../../template/more-tools";

export default function MidParentalHeightPageClient() {
  const [targetHeightCm, setTargetHeightCm] = useState<number | null>(null);
  const [targetRangeLowerCm, setTargetRangeLowerCm] = useState<number | null>(null);
  const [targetRangeUpperCm, setTargetRangeUpperCm] = useState<number | null>(null);
  const [predictedPercentile, setPredictedPercentile] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Mid-Parental Height Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate target adult height and expected family range from parent heights.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <MidParentalHeightCalculator
              onChange={(payload) => {
                setTargetHeightCm(payload.targetHeightCm);
                setTargetRangeLowerCm(payload.targetRangeLowerCm);
                setTargetRangeUpperCm(payload.targetRangeUpperCm);
                setPredictedPercentile(payload.predictedPercentile);
              }}
            />
          </div>
        </div>

        <div
          className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20"
          id="mid-parental-height-interpretation"
        >
          <MidParentalHeightInterpretation percentile={predictedPercentile} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Mid-Parental Height Calculator Does</h2>
          <p className={pClass}>
            This calculator estimates target adult height from father and mother heights using the standard
            mid-parental-height method. It also provides a practical target range often used in pediatric
            growth screening.
          </p>
          {targetHeightCm != null &&
          targetRangeLowerCm != null &&
          targetRangeUpperCm != null &&
          predictedPercentile != null ? (
            <p className={pClass}>
              Current estimate: target adult height <strong>{round(targetHeightCm, 1)} cm</strong> with
              range <strong>{round(targetRangeLowerCm, 1)}-{round(targetRangeUpperCm, 1)} cm</strong>, around
              the <strong>{round(predictedPercentile, 1)}th</strong> percentile.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Formula Used</h2>
          <div className="rounded-2xl border bg-white p-6 text-sm sm:text-base text-gray-800 overflow-x-auto">
            <p className="font-mono">Man target = (Father + Mother + 13 cm) / 2</p>
            <p className="font-mono mt-2">Girl target = (Father + Mother - 13 cm) / 2</p>
            <p className="font-mono mt-2">Expected target band = target +/- 8.5 cm</p>
          </div>
          <p className={pClass}>
            This approach is widely used for quick clinical screening and expectation-setting, but it is not
            a complete growth model.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Interpret The Target Band</h2>
          <p className={pClass}>
            The center value is the family-based estimate. The surrounding band represents common variation
            around that estimate. Values outside the band can still occur, but they are less typical and may
            justify closer growth-chart review.
          </p>
          <p className={pClass}>
            If you want to compare a specific target height against this estimate, use the{" "}
            <a className="text-primary underline" href="/height-calculator">
              Height Calculator
            </a>{" "}
            for probability modeling. For photo-based visual height approximation, use the{" "}
            <a className="text-primary underline" href="/height-estimator">
              Height Estimator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Clinical Caveats</h2>
          <p className={pClass}>
            Mid-parental-height estimates should be interpreted with growth velocity, pubertal stage, and
            serial percentile tracking. Nutrition, chronic disease, and endocrine disorders can shift final
            outcomes substantially.
          </p>
          <p className={pClass}>
            For children with rapidly falling growth percentiles, delayed growth patterns, or clear mismatch
            between predicted and observed growth, medical evaluation is the appropriate next step.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              CDC Growth Charts and growth-chart practice:
              <a className="text-primary underline ml-1" href="https://www.cdc.gov/growthcharts/index.htm">
                CDC Growth Charts
              </a>
            </li>
            <li>
              Wright CM, Cheetham TD. Strengths and limitations of parental heights:
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/10451401/">
                Archives of Disease in Childhood (PubMed)
              </a>
            </li>
            <li>
              Khamis HJ, Roche AF. Predicting adult stature without skeletal age:
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/7936860/">
                Pediatrics (PubMed)
              </a>
            </li>
            <li>
              WHO Child Growth Standards methods and background:
              <a
                className="text-primary underline ml-1"
                href="https://www.who.int/childgrowth/standards/technical_report/en/"
              >
                WHO Technical Report
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
              "ideal-weight-calculator",
              "bmi-calculator",
              "overweight-calculator",
              "body-frame-size-calculator",
              "weight-loss-calculator",
            ]}
            excludeSlug="mid-parental-height-calculator"
          />
        </div>
      </section>
    </main>
  );
}
