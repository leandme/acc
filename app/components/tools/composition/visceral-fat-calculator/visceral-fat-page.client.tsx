"use client";

import { useState } from "react";
import VisceralFatCalculator from "@/app/components/tools/composition/visceral-fat-calculator/visceral-fat-calculator";
import VisceralFatInterpretation from "@/app/components/tools/composition/visceral-fat-calculator/visceral-fat-interpretation";
import { MoreTools } from "../../template/more-tools";

export default function VisceralFatCalculatorPageClient() {
  const [vat, setVat] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Visceral Fat Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate visceral fat area (VAT, cm2) using age, sex, waist, proximal thigh, height, and
          weight.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <VisceralFatCalculator
              onChange={({ vat }) => {
                setVat(vat);
              }}
            />
          </div>
        </div>

        <div id="visceral-fat-interpretation" className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <VisceralFatInterpretation value={vat} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Calculator Estimates</h2>
          <p className={pClass}>
            This tool estimates visceral fat area (VAT) in cm2 from anthropometric inputs. It is based on
            published regression equations that approximate CT-derived VAT from body measurements.
          </p>
          <p className={pClass}>
            It is a practical risk-screening and trend tool. It does not replace imaging or clinical
            diagnosis.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Anthropometric Equation Used</h2>
          <p className={pClass}>
            The model uses age, waist circumference, proximal thigh circumference, and sex. For women,
            BMI is also included.
          </p>
          <div className="rounded-2xl border bg-white p-6 text-sm sm:text-base text-gray-800 overflow-x-auto">
            <p className="font-semibold">Women</p>
            <p className="mt-1 font-mono">
              VAT = (2.15 x waist) - (3.63 x proximal thigh) + (1.46 x age) + (6.22 x BMI) - 92.713
            </p>
            <p className="mt-4 font-semibold">Men</p>
            <p className="mt-1 font-mono">
              VAT = (6 x waist) - (4.41 x proximal thigh) + (1.19 x age) - 213.65
            </p>
          </div>
          <p className={pClass}>
            Circumference inputs are interpreted in centimeters internally. VAT output is reported in cm2.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Measure Proximal Thigh</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Stand upright with weight evenly distributed.</li>
            <li>Measure the upper thigh near the gluteal fold on bare skin or thin clothing.</li>
            <li>Keep the tape horizontal and snug without compressing tissue.</li>
            <li>Take 2 to 3 readings and average them.</li>
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use Your Result</h2>
          <p className={pClass}>
            In many studies, VAT above about 130 cm2 is used as a visceral-obesity threshold associated
            with higher cardiometabolic risk.
          </p>
          <p className={pClass}>
            Use repeat measurements over time rather than one isolated score, and interpret alongside
            blood pressure, lipids, glucose, and clinician guidance.
          </p>
          <p className={pClass}>
            For lean-mass context alongside VAT trends, compare results with the{" "}
            <a className="text-primary underline" href="/lean-body-mass-calculator">
              Lean Body Mass Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            For a simpler waist-height roundness estimate, run the{" "}
            <a className="text-primary underline" href="/bri-calculator">
              BRI Calculator
            </a>
            . For a hip-height adiposity estimate, compare with the{" "}
            <a className="text-primary underline" href="/bai-calculator">
              BAI Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            For method context, see{" "}
            <a className="text-primary underline" href="/guides/body-fat-estimation-methods">Common Body Fat Estimation Methods Explained</a>{" "}
            and{" "}
            <a className="text-primary underline" href="/guides/why-body-fat-measurements-give-different-results">Why Body Fat Measurement Methods Give Different Results</a>.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Samouda H, Ruiz-Castell M, et al. VAT prediction equations from anthropometric measurements
              and age in adults.
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/39150790/"
                className="text-primary underline ml-1"
              >
                PubMed record
              </a>
            </li>
            <li>
              Samouda H, et al. VAT equation with a 130 cm2 threshold for visceral obesity and
              cardiometabolic risk.
              <a href="https://pubmed.ncbi.nlm.nih.gov/33907272/" className="text-primary underline ml-1">
                PubMed record
              </a>
            </li>
            <li>
              Lewis CE, et al. Visceral adiposity and incident diabetes in adults.
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/25440591/"
                className="text-primary underline ml-1"
              >
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
              "estimate",
              "body-fat-calculator",
              "bai-calculator",
              "lean-body-mass-calculator",
              "bri-calculator",
              "body-frame-size-calculator",
              "rfm-calculator",
              "ffmi-calculator",
            ]}
            excludeSlug="visceral-fat-calculator"
          />
        </div>
      </section>
    </main>
  );
}
