"use client";

import { useState } from "react";
import { round } from "@/app/components/tools/body-weight/shared/math";
import WaistToHeightRatioCalculator from "@/app/components/tools/body-proportions/waist-to-height-ratio-calculator/waist-to-height-ratio-calculator";
import WaistToHeightRatioInterpretation from "@/app/components/tools/body-proportions/waist-to-height-ratio-calculator/waist-to-height-ratio-interpretation";
import { MoreTools } from "../../template/more-tools";

export default function WaistToHeightRatioPageClient() {
  const [ratio, setRatio] = useState<number | null>(null);
  const [waistCm, setWaistCm] = useState<number | null>(null);
  const [heightCm, setHeightCm] = useState<number | null>(null);
  const [targetWaistCm, setTargetWaistCm] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Waist to Height Ratio Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Calculate waist-to-height ratio (WHtR) and compare your result to central-fat risk screening bands.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <WaistToHeightRatioCalculator
              onChange={({ ratio, waistCm, heightCm, targetWaistCm }) => {
                setRatio(ratio);
                setWaistCm(waistCm);
                setHeightCm(heightCm);
                setTargetWaistCm(targetWaistCm);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20" id="waist-to-height-ratio-interpretation">
          <WaistToHeightRatioInterpretation ratio={ratio} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Waist to Height Ratio Calculator Measures</h2>
          <p className={pClass}>
            Waist-to-height ratio is waist circumference divided by height. It is a fast screening metric for
            central fat distribution, often summarized as: keep waist under half your height.
          </p>
          {ratio != null && waistCm != null && heightCm != null && targetWaistCm != null ? (
            <p className={pClass}>
              Current setup: waist <strong>{round(waistCm, 1)} cm</strong>, height{" "}
              <strong>{round(heightCm, 1)} cm</strong>, WHtR <strong>{round(ratio, 2)}</strong>. Waist at a
              ratio of 0.50 would be about <strong>{round(targetWaistCm, 1)} cm</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Measure for Better Consistency</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Measure waist at the same site each time, commonly around navel level.</li>
            <li>Keep tape horizontal and snug without compressing skin.</li>
            <li>Use normal exhale posture and avoid flexing or bracing.</li>
            <li>Take 2 to 3 readings and use the average.</li>
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use WHtR in Practice</h2>
          <p className={pClass}>
            Use WHtR as a trend and screening marker, not a diagnosis. Track it alongside body weight,
            waist trend, and cardiometabolic markers over time.
          </p>
          <p className={pClass}>
            For height-based target planning, use the{" "}
            <a className="text-primary underline" href="/tools">
              Ideal Waist Size Calculator
            </a>
            . For upper-body taper context, run the{" "}
            <a className="text-primary underline" href="/tools">
              Shoulder to Waist Ratio Calculator
            </a>
            . For hip-adjusted central-fat context, run the{" "}
            <a className="text-primary underline" href="/tools">
              Waist to Hip Ratio Calculator
            </a>
            . For broad weight-status screening, use the{" "}
            <a className="text-primary underline" href="/tools">
              BMI Calculator
            </a>
            . For roundness modeling from waist and height, use the{" "}
            <a className="text-primary underline" href="/tools">
              BRI Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              NICE obesity guidance using waist-based risk stratification:
              <a className="text-primary underline ml-1" href="https://www.nice.org.uk/guidance/cg189">
                Obesity: identification, assessment and management
              </a>
            </li>
            <li>
              Boundary value review for waist-to-height ratio (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/26947694/">
                Waist-to-height ratio as an indicator of cardiometabolic risk
              </a>
            </li>
            <li>
              Meta-analysis of anthropometric indices for cardiometabolic risk prediction (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/21307346/">
                General and abdominal adiposity and risk outcomes
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <MoreTools
            heading="More Tools"
            columns={2}
            toolSlugs={[
              "ideal-waist-size-calculator",
              "shoulder-to-waist-ratio-calculator",
              "waist-to-hip-ratio-calculator",
              "bmi-calculator",
              "overweight-calculator",
              "body-fat-calculator",
              "bri-calculator",
              "rfm-calculator",
              "weight-loss-calculator",
              "calorie-deficit-calculator",
            ]}
            excludeSlug="waist-to-height-ratio-calculator"
          />
        </div>
      </section>
    </main>
  );
}
