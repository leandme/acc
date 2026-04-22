"use client";

import { useState } from "react";
import type { Sex } from "@/app/components/tools/body-weight/shared/math";
import { round } from "@/app/components/tools/body-weight/shared/math";
import ShoulderToWaistRatioCalculator from "./shoulder-to-waist-ratio-calculator";
import ShoulderToWaistRatioInterpretation from "./shoulder-to-waist-ratio-interpretation";
import { MoreTools } from "../../template/more-tools";

export default function ShoulderToWaistRatioPageClient() {
  const [sex, setSex] = useState<Sex>("male");
  const [ratio, setRatio] = useState<number | null>(null);
  const [shoulderCm, setShoulderCm] = useState<number | null>(null);
  const [waistCm, setWaistCm] = useState<number | null>(null);
  const [benchmarkRatio, setBenchmarkRatio] = useState<number | null>(null);
  const [benchmarkWaistCm, setBenchmarkWaistCm] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Shoulder to Waist Ratio Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Calculate shoulder-to-waist ratio (SWR) from circumference measurements and compare your result
          with practical taper categories.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <ShoulderToWaistRatioCalculator
              onChange={({ sex, ratio, shoulderCm, waistCm, benchmarkRatio, benchmarkWaistCm }) => {
                setSex(sex);
                setRatio(ratio);
                setShoulderCm(shoulderCm);
                setWaistCm(waistCm);
                setBenchmarkRatio(benchmarkRatio);
                setBenchmarkWaistCm(benchmarkWaistCm);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20" id="shoulder-to-waist-ratio-interpretation">
          <ShoulderToWaistRatioInterpretation sex={sex} ratio={ratio} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Shoulder to Waist Ratio Calculator Measures</h2>
          <p className={pClass}>
            Shoulder-to-waist ratio divides shoulder circumference by waist circumference. It is a
            proportionality metric used to describe visible taper from upper torso to waist.
          </p>
          {ratio != null && shoulderCm != null && waistCm != null ? (
            <p className={pClass}>
              Current setup: shoulders <strong>{round(shoulderCm, 1)} cm</strong>, waist{" "}
              <strong>{round(waistCm, 1)} cm</strong>, SWR <strong>{round(ratio, 2)}</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How to Measure for Better Consistency</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Measure shoulders around the widest point of the deltoid circumference.</li>
            <li>Measure waist at a consistent location, commonly near navel level.</li>
            <li>Keep tape horizontal and snug without compressing skin.</li>
            <li>Repeat each measurement 2 to 3 times and average results.</li>
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How to Use Shoulder-to-Waist Ratio</h2>
          <p className={pClass}>
            Use SWR as a trend metric for physique proportion goals. It does not diagnose health risk by
            itself, so combine with waist-centered health screeners and body-composition tools.
          </p>
          {benchmarkRatio != null && benchmarkWaistCm != null ? (
            <p className={pClass}>
              At your current shoulder measurement, waist near{" "}
              <strong>{round(benchmarkWaistCm, 1)} cm</strong> corresponds to an SWR of{" "}
              <strong>{benchmarkRatio.toFixed(2)}</strong> in this tool.
            </p>
          ) : null}
          <p className={pClass}>
            For central-fat screening, use the{" "}
            <a className="text-primary underline" href="/waist-to-height-ratio-calculator">
              Waist to Height Ratio Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/waist-to-hip-ratio-calculator">
              Waist to Hip Ratio Calculator
            </a>
            . For frame and shape context, compare with the{" "}
            <a className="text-primary underline" href="/body-shape-calculator">
              Body Shape Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/body-frame-size-calculator">
              Body Frame Size Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              WHO report on waist and waist-hip anthropometrics:
              <a className="text-primary underline ml-1" href="https://www.who.int/publications/i/item/9789241501491">
                Waist Circumference and Waist-Hip Ratio (WHO)
              </a>
            </li>
            <li>
              CDC anthropometric reference data from NHANES:
              <a className="text-primary underline ml-1" href="https://www.cdc.gov/nchs/data/series/sr_03/sr03_046.pdf">
                Anthropometric Reference Data for Children and Adults
              </a>
            </li>
            <li>
              ACSM body-composition and anthropometry guidance:
              <a className="text-primary underline ml-1" href="https://www.acsm.org/education-resources/trending-topics-resources/resource-library/detail?id=7f47f89b-69d9-4e84-9eb7-0ade769f32de">
                Body Composition Assessment Position Statement
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
              "ideal-waist-size-calculator",
              "body-shape-calculator",
              "body-frame-size-calculator",
              "bri-calculator",
              "rfm-calculator",
              "body-fat-calculator",
            ]}
            excludeSlug="shoulder-to-waist-ratio-calculator"
          />
        </div>
      </section>
    </main>
  );
}
