"use client";

import { useState } from "react";
import BAICalculator from "@/app/components/tools/composition/bai-calculator/bai-calculator";
import BAIInterpretation from "@/app/components/tools/composition/bai-calculator/bai-interpretation";
import type { Sex } from "@/app/components/tools/composition/bai-calculator/bai-ranges";
import { MoreTools } from "../../template/more-tools";

export default function BAIPageClient() {
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState<number>(30);
  const [bai, setBai] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [ageBand, setAgeBand] = useState<string | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">BAI Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate Body Adiposity Index (BAI) from hip circumference and height, then interpret your
          result with sex- and age-based ranges.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <BAICalculator
              onChange={({ sex, age, bai, category, ageBand }) => {
                setSex(sex);
                setAge(age);
                setBai(bai);
                setCategory(category);
                setAgeBand(ageBand);
              }}
            />
          </div>
        </div>

        <div id="bai-interpretation" className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <BAIInterpretation sex={sex} age={age} bai={bai} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This BAI Calculator Shows</h2>
          <p className={pClass}>
            Body Adiposity Index (BAI) is an anthropometric estimate intended to approximate body fat
            percentage from hip circumference and height. Unlike BMI, it does not use body weight.
          </p>
          <p className={pClass}>
            This makes BAI useful when you want a tape-measure metric that can be tracked over time with
            consistent measurement technique.
          </p>
          {bai != null && category && ageBand ? (
            <p className={pClass}>
              Current result: <strong>BAI {bai.toFixed(1)}%</strong>, category <strong>{category}</strong>
              , for {sex === "female" ? "women" : "men"} in ages <strong>{ageBand}</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>BAI Formula Used</h2>
          <p className={pClass}>
            This calculator uses the standard BAI equation with hip in centimeters and height in meters:
          </p>
          <div className="rounded-2xl border bg-white p-6 text-sm sm:text-base text-gray-800 overflow-x-auto">
            <p className="font-mono">BAI = (hip circumference / (height^1.5)) - 18</p>
          </div>
          <p className={pClass}>
            The output is shown as a percentage-like adiposity estimate. Interpretation ranges are applied
            by sex and age band.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Measure Hip Circumference Correctly</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Stand upright with feet close together and weight evenly distributed.</li>
            <li>Wrap the tape around the widest point of the hips/glutes.</li>
            <li>Keep the tape level and snug without compressing skin.</li>
            <li>Take 2 to 3 readings and use the average.</li>
            <li>Use similar hydration and time-of-day for repeat tracking.</li>
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>BAI vs Other Body Composition Tools</h2>
          <p className={pClass}>
            BAI can be practical for trend tracking, but it is still an estimate. It should be interpreted
            with context and compared to other methods.
          </p>
          <p className={pClass}>
            For waist-based alternatives, compare with the{" "}
            <a className="text-primary underline" href="/bri-calculator">
              BRI Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/rfm-calculator">
              RFM Calculator
            </a>
            . For caliper-based body-fat estimates, use the{" "}
            <a className="text-primary underline" href="/skinfold-body-fat-calculator">
              Skinfold Body Fat Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            If you want lean-mass context in parallel, run the{" "}
            <a className="text-primary underline" href="/lean-body-mass-calculator">
              Lean Body Mass Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/ffmi-calculator">
              FFMI Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Limitations</h2>
          <p className={pClass}>
            BAI does not directly measure fat tissue and can over- or under-estimate adiposity depending
            on body shape, fat distribution, frame size, and athletic build.
          </p>
          <p className={pClass}>
            For best use, track BAI over time with consistent inputs and pair it with progress photos and
            additional body composition metrics.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Bergman RN, et al. A better index of body adiposity (BAI).
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/21372804/">
                PubMed record
              </a>
            </li>
            <li>
              Freedman DS, et al. The body adiposity index and cardiovascular risk factors.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/21862743/">
                PubMed record
              </a>
            </li>
            <li>
              Johnson W, et al. BAI, BMI, and body fat percentage in adults.
              <a
                className="text-primary underline ml-1"
                href="https://pubmed.ncbi.nlm.nih.gov/28316187/"
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
              "body-fat-calculator",
              "skinfold-body-fat-calculator",
              "rfm-calculator",
              "bri-calculator",
              "lean-body-mass-calculator",
              "ffmi-calculator",
              "body-visualizer",
            ]}
            excludeSlug="bai-calculator"
          />
        </div>
      </section>
    </main>
  );
}
