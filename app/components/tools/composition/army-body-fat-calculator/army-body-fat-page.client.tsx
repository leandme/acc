"use client";

import ArmyBodyFatCalculator from "@/app/components/tools/composition/army-body-fat-calculator/army-body-fat-calculator";
import { MoreTools } from "../../template/more-tools";

export default function ArmyBodyFatCalculatorPageClient() {
  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">
          Army Body Fat Calculator
        </h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate body fat with the U.S. Army one-site circumference method and
          compare your result to age- and sex-based Army body-fat standards.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <ArmyBodyFatCalculator />
          </div>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Army Calculator Uses</h2>
          <p className={pClass}>
            This page uses the Army one-site equation format centered on waist
            (abdomen at navel) circumference and body weight. Inputs are
            normalized internally to inches and pounds, then converted into a
            body-fat estimate.
          </p>
          <p className={pClass}>
            The calculator also shows an Army-style pass/fail check using age and
            sex standards so you can compare your estimated result against common
            ABCP threshold values.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Army One-Site Formula</h2>
          <p className={pClass}>
            The one-site equations used in Army references are:
          </p>
          <div className="rounded-2xl border bg-white p-6 text-sm sm:text-base text-gray-800 overflow-x-auto">
            <p className="font-semibold">Men</p>
            <p className="mt-1 font-mono">
              %BF = -26.97 - (0.12 x weight_lb) + (1.99 x abdomen_in)
            </p>
            <p className="mt-4 font-semibold">Women</p>
            <p className="mt-1 font-mono">
              %BF = -9.15 - (0.015 x weight_lb) + (1.27 x abdomen_in)
            </p>
          </div>
          <p className={pClass}>
            The Army typically reports body fat as a rounded whole number for
            administrative decisions. This calculator shows both a decimal estimate
            and an Army-rounded value.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Measure For Army Method</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Measure waist/abdomen at the navel level.</li>
            <li>Stand relaxed with normal exhale; no sucking in.</li>
            <li>Keep tape horizontal and snug without skin compression.</li>
            <li>Take multiple readings and average them.</li>
            <li>Use consistent hydration/time-of-day for repeat tracking.</li>
          </ul>
          <p className={pClass}>
            Measurement technique is the largest driver of day-to-day variance.
            Keep protocol consistent to make trend lines useful.
            For caliper-based site measurements, compare with the{" "}
            <a className="text-primary underline" href="/skinfold-body-fat-calculator">
              Skinfold Body Fat Calculator
            </a>
            {" "}and for waist-height roundness, run the{" "}
            <a className="text-primary underline" href="/bri-calculator">
              BRI Calculator
            </a>
            {" "}and for hip-height adiposity, compare with the{" "}
            <a className="text-primary underline" href="/bai-calculator">
              BAI Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Army Standards Snapshot</h2>
          <p className={pClass}>
            Common Army body-fat screening thresholds are age- and sex-banded.
            The calculator applies these values in the status card:
          </p>
          <div className="overflow-x-auto rounded-2xl border bg-white">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Age Band</th>
                  <th>Men Max %</th>
                  <th>Women Max %</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>17-20</td>
                  <td>20%</td>
                  <td>30%</td>
                </tr>
                <tr>
                  <td>21-27</td>
                  <td>22%</td>
                  <td>32%</td>
                </tr>
                <tr>
                  <td>28-39</td>
                  <td>24%</td>
                  <td>34%</td>
                </tr>
                <tr>
                  <td>40+</td>
                  <td>26%</td>
                  <td>36%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={pClass}>
            Administrative decisions may also include exemptions or alternate
            pathways based on current Army policy updates.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Method Limits And Practical Use</h2>
          <p className={pClass}>
            Like other circumference models, this is an estimate rather than a
            direct tissue measurement. It can under- or over-estimate some body
            types, especially with atypical fat distribution or inconsistent tape
            placement.
          </p>
          <p className={pClass}>
            The best way to use it is repeatably over time, not as a one-time
            judgment. Pair tape-based trends with progress photos and performance
            markers for stronger context.
            For comparison and cadence guidance, see{" "}
            <a className="text-primary underline" href="/guides/body-fat-calculator-vs-estimator">Body Fat Calculator vs Body Fat Estimator</a>{" "}
            and{" "}
            <a className="text-primary underline" href="/guides/how-often-should-you-measure-body-fat">How Often Should You Measure Body Fat?</a>.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Army Body Composition Program (ABCP) portal:
              <a
                href="https://www.armyresilience.army.mil/abcp/index.html"
                className="text-primary underline ml-1"
              >
                ArmyResilience ABCP
              </a>
            </li>
            <li>
              Army ABCP body fat calculator charts/tooling:
              <a
                href="https://www.armyresilience.army.mil/abcp/chart.html"
                className="text-primary underline ml-1"
              >
                Official chart resource
              </a>
            </li>
            <li>
              Army Directive 2023-11 (Army Body Composition Program updates):
              <a
                href="https://www.armyresilience.army.mil/abcp/pdf/Army%20Directive%202023-11%20Army%20Body%20Composition%20Program.pdf"
                className="text-primary underline ml-1"
              >
                AD 2023-11 PDF
              </a>
            </li>
            <li>
              AR 600-9 (Army Body Composition Program):
              <a
                href="https://www.armyresilience.army.mil/abcp/pdf/ARN7779_AR600-9_FINAL.pdf"
                className="text-primary underline ml-1"
              >
                AR 600-9 PDF
              </a>
            </li>
            <li>
              Army Inspector General update with one-site equation examples:
              <a
                href="https://home.army.mil/campbell/application/files/8317/0785/6124/Jan._24_IG_Update.pdf"
                className="text-primary underline ml-1"
              >
                January 2024 IG update
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
              "body-fat-calculator",
              "skinfold-body-fat-calculator",
              "bai-calculator",
              "bri-calculator",
              "lean-body-mass-calculator",
              "body-frame-size-calculator",
              "ffmi-calculator",
              "body-visualizer",
            ]}
            excludeSlug="army-body-fat-calculator"
          />
        </div>
      </section>
    </main>
  );
}
