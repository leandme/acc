"use client";

import { useState } from "react";
import type { Sex } from "@/app/components/tools/body-weight/shared/math";
import { round } from "@/app/components/tools/body-weight/shared/math";
import WaistToHipRatioCalculator from "@/app/components/tools/body-proportions/waist-to-hip-ratio-calculator/waist-to-hip-ratio-calculator";
import WaistToHipRatioInterpretation from "@/app/components/tools/body-proportions/waist-to-hip-ratio-calculator/waist-to-hip-ratio-interpretation";
import { MoreTools } from "../../template/more-tools";

export default function WaistToHipRatioPageClient() {
  const [sex, setSex] = useState<Sex>("male");
  const [ratio, setRatio] = useState<number | null>(null);
  const [waistCm, setWaistCm] = useState<number | null>(null);
  const [hipCm, setHipCm] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Waist to Hip Ratio Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Calculate waist-to-hip ratio (WHR) and compare your result to sex-specific central-fat risk bands.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <WaistToHipRatioCalculator
              onChange={({ sex, ratio, waistCm, hipCm }) => {
                setSex(sex);
                setRatio(ratio);
                setWaistCm(waistCm);
                setHipCm(hipCm);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40" id="waist-to-hip-ratio-interpretation">
          <WaistToHipRatioInterpretation sex={sex} ratio={ratio} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Waist to Hip Ratio Calculator Measures</h2>
          <p className={pClass}>
            Waist-to-hip ratio is the waist circumference divided by hip circumference. It is a simple way
            to assess body-fat distribution, especially central abdominal fat pattern.
          </p>
          {ratio != null && waistCm != null && hipCm != null ? (
            <p className={pClass}>
              Current setup: waist <strong>{round(waistCm, 1)} cm</strong>, hip{" "}
              <strong>{round(hipCm, 1)} cm</strong>, WHR <strong>{round(ratio, 2)}</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Measure Correctly</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Measure waist at a consistent point, usually around navel level.</li>
            <li>Measure hip circumference at the widest point of the glutes.</li>
            <li>Keep tape level and snug without compressing skin.</li>
            <li>Take 2 to 3 readings and use the average for repeatability.</li>
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use This Result</h2>
          <p className={pClass}>
            WHR is a risk-screening context marker, not a diagnosis. Use it alongside BMI, waist-to-height
            ratio, body-fat estimates, and longer trend tracking.
          </p>
          <p className={pClass}>
            For broader screening, compare with the{" "}
            <a className="text-primary underline" href="/bmi-calculator">
              BMI Calculator
            </a>
            . For waist-height context, use the{" "}
            <a className="text-primary underline" href="/waist-to-height-ratio-calculator">
              Waist to Height Ratio Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              WHO report on waist circumference and waist-hip ratio:
              <a className="text-primary underline ml-1" href="https://www.who.int/publications/i/item/9789241501491">
                Waist Circumference and Waist-Hip Ratio (WHO)
              </a>
            </li>
            <li>
              INTERHEART study on abdominal obesity and cardiovascular risk (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/14694617/">
                Abdominal Obesity and the Risk of Myocardial Infarction
              </a>
            </li>
            <li>
              Prospective studies meta-analysis for obesity indices and cardiovascular outcomes (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/21307346/">
                General and Abdominal Adiposity and Risk of Death
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <MoreTools
            heading="More Tools"
            columns={2}
            toolSlugs={[
              "waist-to-height-ratio-calculator",
              "bmi-calculator",
              "overweight-calculator",
              "body-fat-calculator",
              "bri-calculator",
              "rfm-calculator",
              "weight-loss-calculator",
              "calorie-deficit-calculator",
            ]}
            excludeSlug="waist-to-hip-ratio-calculator"
          />
        </div>
      </section>
    </main>
  );
}

