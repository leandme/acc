"use client";

import { useState } from "react";
import type { Sex } from "@/app/components/tools/body-weight/shared/math";
import { round } from "@/app/components/tools/body-weight/shared/math";
import NattyOrNotCalculator from "@/app/components/tools/composition/natty-or-not-calculator/natty-or-not-calculator";
import NattyOrNotInterpretation from "@/app/components/tools/composition/natty-or-not-calculator/natty-or-not-interpretation";
import { MoreTools } from "../../template/more-tools";

export default function NattyOrNotPageClient() {
  const [sex, setSex] = useState<Sex>("male");
  const [frameLabel, setFrameLabel] = useState<string | null>(null);
  const [normalizedFFMI, setNormalizedFFMI] = useState<number | null>(null);
  const [frameAdjustedLimit, setFrameAdjustedLimit] = useState<number | null>(null);
  const [nattyScore, setNattyScore] = useState<number | null>(null);
  const [weightDeltaKg, setWeightDeltaKg] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Natty or Not Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate how your current muscularity compares to frame-adjusted natural FFMI limits.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <NattyOrNotCalculator
              onChange={(payload) => {
                setSex(payload.sex);
                setFrameLabel(payload.frameLabel);
                setNormalizedFFMI(payload.normalizedFFMI);
                setFrameAdjustedLimit(payload.frameAdjustedLimit);
                setNattyScore(payload.nattyScore);
                setWeightDeltaKg(payload.weightDeltaKg);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40" id="natty-or-not-interpretation">
          <NattyOrNotInterpretation nattyScore={nattyScore} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Natty or Not Calculator Does</h2>
          <p className={pClass}>
            This tool is a practical screening model for gym users who want to estimate whether a physique
            sits inside or outside typical natural muscularity limits. It uses normalized FFMI as the core
            metric, then adjusts the ceiling by frame size using wrist-to-height context.
          </p>
          <p className={pClass}>
            It does not diagnose steroid use and it should never be used to accuse someone. It is best used
            for self-audit and reality-checking your own progress expectations.
          </p>
          {nattyScore != null && normalizedFFMI != null && frameAdjustedLimit != null && frameLabel ? (
            <p className={pClass}>
              Current estimate: normalized FFMI <strong>{round(normalizedFFMI, 2)}</strong> versus a{" "}
              <strong>{frameLabel}</strong> frame-adjusted limit of{" "}
              <strong>{round(frameAdjustedLimit, 2)}</strong> for{" "}
              <strong>{sex === "male" ? "men" : "women"}</strong>, which is{" "}
              <strong>{round(nattyScore, 0)}%</strong> of that limit.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How The Score Works</h2>
          <p className={pClass}>The model combines three steps:</p>
          <ol className="list-decimal pl-6 space-y-2 text-lg leading-relaxed">
            <li>Estimate lean mass from body weight and body-fat percentage.</li>
            <li>Calculate FFMI and normalized FFMI from lean mass and height.</li>
            <li>Adjust the natural ceiling by frame size (small, medium, large) and compare against it.</li>
          </ol>
          <div className="rounded-2xl border bg-white p-6 text-sm sm:text-base text-gray-800 overflow-x-auto">
            <p className="font-mono">FFMI = Lean Mass (kg) / Height(m)^2</p>
            <p className="font-mono mt-2">Normalized FFMI = FFMI + 6.3 x (1.8 - Height in meters)</p>
            <p className="font-mono mt-2">
              Natty Score = (Normalized FFMI / Frame-Adjusted Natural Limit) x 100
            </p>
          </div>
          <p className={pClass}>
            If you want to isolate the FFMI part without the frame adjustment, use the{" "}
            <a className="text-primary underline" href="/ffmi-calculator">
              FFMI Calculator
            </a>
            . If you want to verify the frame context directly, use the{" "}
            <a className="text-primary underline" href="/body-frame-size-calculator">
              Body Frame Size Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Interpret Your Result</h2>
          <p className={pClass}>
            A higher score means your current muscularity is closer to, or above, a frame-adjusted natural
            ceiling. Scores in the upper natural and gray-zone bands are highly sensitive to data quality,
            especially body-fat input.
          </p>
          <p className={pClass}>
            The easiest way to reduce false alarms is to keep measurement conditions consistent: same scale,
            same time of day, similar hydration, and repeatable body-fat method.
          </p>
          {weightDeltaKg != null ? (
            <p className={pClass}>
              Your current modeled delta vs the frame-adjusted ceiling is{" "}
              <strong>{round(weightDeltaKg, 1)} kg</strong>. Positive values mean you are above that model's
              natural-weight estimate at your chosen body-fat percentage.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Important Limitations</h2>
          <p className={pClass}>
            This is a heuristic, not a lab test. False positives can happen when body-fat is underestimated,
            height is rounded down, or photos create unrealistic body-fat assumptions.
          </p>
          <p className={pClass}>
            Genetics, training age, and sport history matter. A very advanced natural athlete may appear in
            upper bands, while someone with poor data quality may look suspicious by mistake.
          </p>
          <p className={pClass}>
            For better context, pair this with the{" "}
            <a className="text-primary underline" href="/lean-body-mass-calculator">
              Lean Body Mass Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/muscle-mass-calculator">
              Muscle Mass Calculator
            </a>
            . If body-fat is uncertain, cross-check with the{" "}
            <a className="text-primary underline" href="/body-fat-calculator">
              Body Fat Calculator
            </a>{" "}
            or{" "}
            <a className="text-primary underline" href="/estimate">
              photo-based body-fat estimator
            </a>
            .
          </p>
          <p className={pClass}>
            For a dedicated ceiling-utilization model with stage projections, use the{" "}
            <a className="text-primary underline" href="/muscular-potential-calculator">
              Muscular Potential Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            For a combined structure-plus-potential composite score, compare with the{" "}
            <a className="text-primary underline" href="/bodybuilding-genetics-calculator">
              Bodybuilding Genetics Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>PED Context and Health Risk</h2>
          <p className={pClass}>
            Anabolic-androgenic steroid use is associated with meaningful cardiovascular and systemic risk.
            Even when physique outcomes look impressive, long-term health costs can be severe.
          </p>
          <p className={pClass}>
            This tool exists to set realistic natural expectations and reduce comparison bias, not to
            encourage or normalize PED use.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Kouri EM, et al. Fat-free mass index in users and nonusers of anabolic-androgenic steroids.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/7496846/">
                PubMed record
              </a>
            </li>
            <li>
              Cintineo HP, et al. Sport differences in fat-free mass index in the NCAA.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/35968800/">
                PubMed record
              </a>
            </li>
            <li>
              Esco MR, et al. Normative fat-free mass index values for female collegiate athletes.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/31364884/">
                PubMed record
              </a>
            </li>
            <li>
              NIDA. Anabolic steroids and other appearance and performance enhancing drugs.
              <a className="text-primary underline ml-1" href="https://nida.nih.gov/research-topics/anabolic-steroids">
                NIDA overview
              </a>
            </li>
            <li>
              Baggish AL, et al. Cardiovascular toxicity of illicit anabolic-androgenic steroid use.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/28301298/">
                PubMed record
              </a>
            </li>
            <li>
              Sessa F, et al. Anabolic-androgenic steroid use and cardiovascular disease.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/39925649/">
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
              "ffmi-calculator",
              "muscular-potential-calculator",
              "casey-butt-calculator",
              "bodybuilding-genetics-calculator",
              "muscle-mass-calculator",
              "lean-body-mass-calculator",
              "body-frame-size-calculator",
              "body-fat-calculator",
              "rfm-calculator",
              "body-visualizer",
            ]}
            excludeSlug="natty-or-not-calculator"
          />
        </div>
      </section>
    </main>
  );
}
