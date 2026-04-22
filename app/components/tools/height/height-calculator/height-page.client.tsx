"use client";

import { useState } from "react";
import { round } from "@/app/components/tools/body-weight/shared/math";
import HeightCalculator from "@/app/components/tools/height/height-calculator/height-calculator";
import HeightInterpretation from "@/app/components/tools/height/height-calculator/height-interpretation";
import { MoreTools } from "../../template/more-tools";

export default function HeightPageClient() {
  const [targetHeightCm, setTargetHeightCm] = useState<number | null>(null);
  const [targetRangeLowerCm, setTargetRangeLowerCm] = useState<number | null>(null);
  const [targetRangeUpperCm, setTargetRangeUpperCm] = useState<number | null>(null);
  const [desiredHeightCm, setDesiredHeightCm] = useState<number | null>(null);
  const [probabilityAtLeastDesired, setProbabilityAtLeastDesired] = useState<number | null>(null);
  const [predictedPercentile, setPredictedPercentile] = useState<number | null>(null);
  const [desiredPercentile, setDesiredPercentile] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Height Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Prediction, potential, and probability estimates from parent heights and desired adult-height
          targets.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <HeightCalculator
              onChange={(payload) => {
                setTargetHeightCm(payload.targetHeightCm);
                setTargetRangeLowerCm(payload.targetRangeLowerCm);
                setTargetRangeUpperCm(payload.targetRangeUpperCm);
                setDesiredHeightCm(payload.desiredHeightCm);
                setProbabilityAtLeastDesired(payload.probabilityAtLeastDesired);
                setPredictedPercentile(payload.predictedPercentile);
                setDesiredPercentile(payload.desiredPercentile);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20" id="height-interpretation">
          <HeightInterpretation probability={probabilityAtLeastDesired} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Height Calculator Estimates</h2>
          <p className={pClass}>
            This calculator provides a family-based adult-height center estimate, a practical target range,
            and the probability of reaching at least your chosen height target. It is designed for planning
            and expectation-setting, not diagnosis.
          </p>
          {targetHeightCm != null &&
          targetRangeLowerCm != null &&
          targetRangeUpperCm != null &&
          probabilityAtLeastDesired != null &&
          predictedPercentile != null &&
          desiredPercentile != null &&
          desiredHeightCm != null ? (
            <p className={pClass}>
              Current output: predicted adult height <strong>{round(targetHeightCm, 1)} cm</strong> with
              target range <strong>{round(targetRangeLowerCm, 1)}-{round(targetRangeUpperCm, 1)} cm</strong>.
              Your selected target of <strong>{round(desiredHeightCm, 1)} cm</strong> has an estimated{" "}
              <strong>{round(probabilityAtLeastDesired, 1)}%</strong> chance, with predicted percentile{" "}
              <strong>{round(predictedPercentile, 1)}th</strong> and target percentile{" "}
              <strong>{round(desiredPercentile, 1)}th</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Formula Summary</h2>
          <p className={pClass}>
            The parent-based center estimate uses the standard mid-parental-height approach:
          </p>
          <div className="rounded-2xl border bg-white p-6 text-sm sm:text-base text-gray-800 overflow-x-auto">
            <p className="font-mono">Man target = (Father + Mother + 13 cm) / 2</p>
            <p className="font-mono mt-2">Girl target = (Father + Mother - 13 cm) / 2</p>
            <p className="font-mono mt-2">Typical family target band = center +/- 8.5 cm</p>
          </div>
          <p className={pClass}>
            Probability values are modeled with a normal-distribution assumption around the family-based
            center. This is useful for comparison but not a substitute for pediatric growth-chart review.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use Prediction, Potential, and Probability</h2>
          <p className={pClass}>
            Use the center estimate as your baseline expectation, the target band as your practical range,
            and the probability score to compare how aggressive a target is. Higher probability means your
            chosen target is closer to or below the model's expected center.
          </p>
          <p className={pClass}>
            If you want only the family target-height method without probability modeling, use the{" "}
            <a className="text-primary underline" href="/tools">
              Mid-Parental Height Calculator
            </a>
            . If you want a visual, photo-based adult-height estimate, try the{" "}
            <a className="text-primary underline" href="/tools">
              Height Estimator
            </a>
            . If you are planning around adult-weight context after height estimation, compare with the{" "}
            <a className="text-primary underline" href="/tools">
              Ideal Weight Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Important Limitations</h2>
          <p className={pClass}>
            Height outcomes depend on genetics, puberty timing, chronic disease status, nutrition, sleep,
            and measurement quality. Parent-height formulas are useful but incomplete and are less precise at
            population extremes.
          </p>
          <p className={pClass}>
            For children with suspected growth disorders, rapidly changing percentiles, or major mismatch
            between expected and observed growth, clinical evaluation should use formal growth charts and
            pediatric endocrinology workflows.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              CDC Growth Charts and growth-chart usage guidance:
              <a className="text-primary underline ml-1" href="https://www.cdc.gov/growthcharts/index.htm">
                CDC Growth Charts
              </a>
            </li>
            <li>
              Khamis HJ, Roche AF. Predicting adult stature without skeletal age:
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/7936860/">
                Pediatrics (PubMed)
              </a>
            </li>
            <li>
              Wright CM, Cheetham TD. Strengths and limitations of parental heights:
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/10451401/">
                Archives of Disease in Childhood (PubMed)
              </a>
            </li>
            <li>
              WHO Child Growth Standards methods and development:
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
              "height-estimator",
              "mid-parental-height-calculator",
              "ideal-weight-calculator",
              "bmi-calculator",
              "overweight-calculator",
              "tdee-calculator",
              "weight-loss-calculator",
              "body-frame-size-calculator",
            ]}
            excludeSlug="height-calculator"
          />
        </div>
      </section>
    </main>
  );
}
