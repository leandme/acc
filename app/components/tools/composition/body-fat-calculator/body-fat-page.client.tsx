"use client";

import BodyFatCalculator from "@/app/components/tools/composition/body-fat-calculator/body-fat-calculator";
import { MoreTools } from "../../template/more-tools";

export default function BodyFatCalculatorPageClient() {
  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">
          Body Fat Calculator
        </h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate body fat percentage with the U.S. Navy circumference formula,
          then interpret your result with a color-scored range and trend-focused guidance.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <BodyFatCalculator />
          </div>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Navy Body Fat Calculator Does</h2>
          <p className={pClass}>
            This calculator estimates body fat percentage from circumference
            measurements, not from imaging or direct tissue measurement. It uses
            the widely known U.S. Navy equations, which rely on logarithmic
            relationships between height and circumference values.
          </p>
          <p className={pClass}>
            The strongest use case is consistent tracking. If you measure in the
            same way every time, the number can be useful for monitoring change,
            even when the absolute value is not perfectly exact.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Navy Formula Used</h2>
          <p className={pClass}>
            All circumference inputs are converted to inches internally, then the
            standard equations are applied:
          </p>
          <div className="rounded-2xl border bg-white p-6 text-sm sm:text-base text-gray-800 overflow-x-auto">
            <p className="font-semibold">Men</p>
            <p className="mt-1 font-mono">
              %BF = 86.010 x log10(waist - neck) - 70.041 x log10(height) + 36.76
            </p>
            <p className="mt-4 font-semibold">Women</p>
            <p className="mt-1 font-mono">
              %BF = 163.205 x log10(waist + hip - neck) - 97.684 x log10(height) - 78.387
            </p>
          </div>
          <p className={pClass}>
            Weight is optional for the core equation, but this page also uses
            your weight to estimate fat mass and lean mass from the resulting
            body fat percentage. For height/weight-only lean-mass formulas,
            compare with the{" "}
            <a className="text-primary underline" href="/lean-body-mass-calculator">
              Lean Body Mass Calculator
            </a>
            . For a circumference-and-skinfold skeletal muscle estimate, compare
            with the{" "}
            <a className="text-primary underline" href="/muscle-mass-calculator">
              Muscle Mass Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Measure Correctly</h2>
          <p className={pClass}>
            Bad measurement technique is the biggest source of error. To make the
            output useful, keep your method fixed:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Measure on bare skin or thin clothing.</li>
            <li>Keep tape level and snug, but not compressing tissue.</li>
            <li>Measure after normal exhale, no flexing or sucking in.</li>
            <li>Use the same anatomical landmark every session.</li>
            <li>Take 2-3 readings and average them.</li>
            <li>Track at the same time of day and hydration state.</li>
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Accuracy And Limitations</h2>
          <p className={pClass}>
            The Navy method is practical, cheap, and repeatable, but it is still
            an estimation model. Accuracy varies by body type, fat distribution,
            training status, and measurement precision.
          </p>
          <p className={pClass}>
            People with high muscularity, atypical fat patterning, or inconsistent
            tape placement can see larger deviation from reference methods such as
            DEXA. For this reason, interpret the number as directional.
          </p>
          <p className={pClass}>
            If your goal is progress tracking, the trend line over weeks is more
            informative than one isolated reading.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Navy Method vs Other Options</h2>
          <p className={pClass}>
            Each body-fat method answers a slightly different question:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Navy calculator: fast, repeatable, measurement-dependent.</li>
            <li>
              Skinfold calipers: site-based fat-thickness estimate using trained
              pinching technique.
            </li>
            <li>Smart scales (BIA): convenient, hydration-sensitive.</li>
            <li>
              BRI: waist-height roundness estimate (try the{" "}
              <a className="text-primary underline" href="/bri-calculator">
                BRI Calculator
              </a>
              ).
            </li>
            <li>
              BAI: hip-height adiposity estimate (try the{" "}
              <a className="text-primary underline" href="/bai-calculator">
                BAI Calculator
              </a>
              ).
            </li>
            <li>DEXA: stronger lab reference, higher cost and lower frequency.</li>
            <li>Photo estimation: useful visual feedback on appearance changes.</li>
          </ul>
          <p className={pClass}>
            A practical setup is to use one primary method weekly (like Navy tape)
            and pair it with periodic visual checks to keep estimates grounded in
            how your physique is actually changing.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>FAQ</h2>
          <div className="space-y-5 text-lg">
            <div>
              <h3 className="font-semibold text-2xl">How often should I run this calculator?</h3>
              <p className="mt-1 leading-relaxed">
                Weekly or every 2 weeks is usually best. Daily measurements create
                noise from hydration and gut-content changes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-2xl">Why does my result look high or low?</h3>
              <p className="mt-1 leading-relaxed">
                Small errors in waist and neck measurements can shift the result a
                lot. Re-check tape placement first before changing your plan.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-2xl">Is this medical advice?</h3>
              <p className="mt-1 leading-relaxed">
                No. This is a fitness estimation tool and educational resource.
                For clinical decisions, use qualified medical guidance.
              </p>
            </div>
          </div>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Hodgdon JA, Beckett MB. Body fat assessment equations developed for
              military circumference methods (U.S. Navy).
            </li>
            <li>
              U.S. Navy Physical Readiness Program Guide 4 (Body Composition
              Assessment):
              <a
                href="https://www.mynavyhr.navy.mil/Support-Services/Culture-Resilience/Physical-Readiness/Guides/"
                className="text-primary underline ml-1"
              >
                Official Navy guidance
              </a>
            </li>
            <li>
              U.S. Centers for Disease Control and Prevention (CDC), adult weight
              and body-composition context:
              <a href="https://www.cdc.gov/bmi/" className="text-primary underline ml-1">
                CDC BMI overview
              </a>
            </li>
            <li>
              Internal guides:
              <a href="/guides/why-body-fat-measurements-give-different-results" className="text-primary underline ml-1">
                Why methods disagree
              </a>
              {" | "}
              <a href="/guides/body-fat-calculator-vs-estimator" className="text-primary underline">
                Calculator vs estimator
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <MoreTools
            heading="More Tools"
            columns={2}
            toolSlugs={[
              "estimate",
              "skinfold-body-fat-calculator",
              "muscle-mass-calculator",
              "bai-calculator",
              "bri-calculator",
              "lean-body-mass-calculator",
              "body-frame-size-calculator",
              "ffmi-calculator",
              "army-body-fat-calculator",
              "body-visualizer",
            ]}
            excludeSlug="body-fat-calculator"
          />
        </div>
      </section>
    </main>
  );
}
