"use client";

import { useState } from "react";
import type { Sex } from "@/app/components/tools/body-weight/shared/math";
import { round } from "@/app/components/tools/body-weight/shared/math";
import IdealWaistSizeCalculator from "./ideal-waist-size-calculator";
import IdealWaistSizeInterpretation from "./ideal-waist-size-interpretation";
import { MoreTools } from "../../template/more-tools";

export default function IdealWaistSizePageClient() {
  const [sex, setSex] = useState<Sex>("male");
  const [heightCm, setHeightCm] = useState<number | null>(null);
  const [waistCm, setWaistCm] = useState<number | null>(null);
  const [ratio, setRatio] = useState<number | null>(null);
  const [idealWaistCm, setIdealWaistCm] = useState<number | null>(null);
  const [upperTargetWaistCm, setUpperTargetWaistCm] = useState<number | null>(null);
  const [aestheticRatio, setAestheticRatio] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Ideal Waist Size Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate ideal waist size from height and compare your current waist with practical upper-target
          thresholds.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <IdealWaistSizeCalculator
              onChange={({ sex, heightCm, waistCm, ratio, idealWaistCm, upperTargetWaistCm, aestheticRatio }) => {
                setSex(sex);
                setHeightCm(heightCm);
                setWaistCm(waistCm);
                setRatio(ratio);
                setIdealWaistCm(idealWaistCm);
                setUpperTargetWaistCm(upperTargetWaistCm);
                setAestheticRatio(aestheticRatio);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20" id="ideal-waist-size-interpretation">
          <IdealWaistSizeInterpretation ratio={ratio} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Ideal Waist Size Calculator Does</h2>
          <p className={pClass}>
            This tool calculates waist targets from your height using two ratios: a stricter ideal-style
            target and a broader upper practical target of 0.50 waist-to-height ratio.
          </p>
          {heightCm != null && waistCm != null && ratio != null && idealWaistCm != null && upperTargetWaistCm != null && aestheticRatio != null ? (
            <p className={pClass}>
              Current setup: height <strong>{round(heightCm, 1)} cm</strong>, waist{" "}
              <strong>{round(waistCm, 1)} cm</strong>, ratio <strong>{round(ratio, 2)}</strong>. Ideal-style
              target at <strong>{aestheticRatio.toFixed(2)}</strong> is{" "}
              <strong>{round(idealWaistCm, 1)} cm</strong>, and upper practical target at{" "}
              <strong>0.50</strong> is <strong>{round(upperTargetWaistCm, 1)} cm</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How to Use These Waist Targets</h2>
          <p className={pClass}>
            Treat these values as planning anchors, not strict rules. Waist trend over time is usually more
            useful than a single reading. If your goal is fat loss, use the upper practical target to set
            short-term milestones and the stricter target as a longer-term benchmark.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Measurement Guidance</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Measure waist at the same anatomical point every time.</li>
            <li>Take readings at normal exhale, standing relaxed.</li>
            <li>Keep tape level and snug without compressing tissue.</li>
            <li>Record weekly averages to smooth daily fluid fluctuations.</li>
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              WHO anthropometric report on waist and waist-hip measures:
              <a className="text-primary underline ml-1" href="https://www.who.int/publications/i/item/9789241501491">
                Waist Circumference and Waist-Hip Ratio (WHO)
              </a>
            </li>
            <li>
              NICE obesity guidance using waist-based risk stratification:
              <a className="text-primary underline ml-1" href="https://www.nice.org.uk/guidance/cg189">
                Obesity: Identification, Assessment and Management
              </a>
            </li>
            <li>
              Boundary value review for waist-to-height ratio (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/26947694/">
                Waist-to-Height Ratio as an Indicator of Cardiometabolic Risk
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
              "waist-to-hip-ratio-calculator",
              "shoulder-to-waist-ratio-calculator",
              "bri-calculator",
              "rfm-calculator",
              "body-fat-calculator",
              "calorie-calculator",
              "weight-loss-calculator",
            ]}
            excludeSlug="ideal-waist-size-calculator"
          />
        </div>
      </section>
    </main>
  );
}
