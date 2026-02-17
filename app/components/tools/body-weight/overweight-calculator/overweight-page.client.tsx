"use client";

import { useState } from "react";
import OverweightCalculator from "@/app/components/tools/body-weight/overweight-calculator/overweight-calculator";
import OverweightInterpretation from "@/app/components/tools/body-weight/overweight-calculator/overweight-interpretation";
import { round } from "@/app/components/tools/body-weight/shared/math";
import { MoreTools } from "../../template/more-tools";

export default function OverweightPageClient() {
  const [bmi, setBmi] = useState<number | null>(null);
  const [overweightKg, setOverweightKg] = useState<number | null>(null);
  const [healthyMaxWeightKg, setHealthyMaxWeightKg] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";
  const overweightPctAboveHealthy =
    overweightKg != null &&
    healthyMaxWeightKg != null &&
    healthyMaxWeightKg > 0
      ? (overweightKg / healthyMaxWeightKg) * 100
      : null;

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Overweight Calculator (BMI-Based)</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Check BMI category and estimate how far current weight sits above the upper healthy-BMI boundary.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <OverweightCalculator
              onChange={({ bmi, overweightKg, healthyMaxWeightKg }) => {
                setBmi(bmi);
                setOverweightKg(overweightKg);
                setHealthyMaxWeightKg(healthyMaxWeightKg);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40" id="overweight-interpretation">
          <OverweightInterpretation bmi={bmi} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Overweight Calculator Does</h2>
          <p className={pClass}>
            This tool uses your height and weight to compute BMI and map it to standard adult BMI
            categories. It also calculates how much weight sits above the BMI 24.9 cutoff at your current
            height.
          </p>
          {bmi != null && overweightKg != null ? (
            <p className={pClass}>
              Current result: <strong>BMI {round(bmi, 1)}</strong>
              {overweightKg > 0 ? (
                <>
                  {" "}with <strong>{round(overweightKg, 1)} kg</strong> above the BMI 24.9 boundary
                  {overweightPctAboveHealthy != null ? (
                    <> (<strong>{round(overweightPctAboveHealthy, 1)}%</strong> above the upper healthy-weight limit).</>
                  ) : (
                    <>.</>
                  )}
                </>
              ) : (
                <> and currently not above the BMI 24.9 boundary.</>
              )}
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How Overweight Is Calculated Here</h2>
          <p className={pClass}>
            This page is still BMI-based, but it frames results around a specific question:
            <strong> how much weight is above the healthy BMI ceiling at your height?</strong>
          </p>
          <div className="rounded-2xl border bg-white p-6 text-sm sm:text-base text-gray-800 overflow-x-auto">
            <p className="font-mono">BMI = weight (kg) / height (m)^2</p>
            <p className="font-mono mt-2">Upper healthy weight = 24.9 x height (m)^2</p>
            <p className="font-mono mt-2">Weight above healthy = max(0, current weight - upper healthy weight)</p>
          </div>
          <p className={pClass}>
            That makes this tool useful when you want an actionable “amount above range” value rather than
            only a category label.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Why This Page Exists Alongside BMI Calculator</h2>
          <p className={pClass}>
            The{" "}
            <a className="text-primary underline" href="/bmi-calculator">
              main BMI screening page
            </a>{" "}
            is best for broad screening and category checks. This page is tuned for planning conversations
            like “How far above the upper healthy range am I right now?”
          </p>
          <p className={pClass}>
            If you are setting targets, pair this output with the{" "}
            <a className="text-primary underline" href="/ideal-weight-calculator">
              healthy target-weight planner
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/weight-loss-calculator">
              timeline-to-target projection
            </a>
            .
          </p>
          <p className={pClass}>
            For calorie planning behind that timeline, use the{" "}
            <a className="text-primary underline" href="/tdee-calculator">
              TDEE Calculator
            </a>{" "}
            and the{" "}
            <a className="text-primary underline" href="/calorie-deficit-calculator">
              Calorie Deficit Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Best Use Cases for This Tool</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
            <li>Translate BMI screening into a clear “kg above healthy range” number.</li>
            <li>Set an initial target before running a weight-loss timeline projection.</li>
            <li>Track progress toward the upper healthy boundary over time.</li>
          </ul>
          <p className={pClass}>
            If you only need category-level screening, the{" "}
            <a className="text-primary underline" href="/bmi-calculator">
              BMI calculator
            </a>{" "}
            is usually the better starting point.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Important Interpretation Notes</h2>
          <p className={pClass}>
            BMI is a screening tool, not a diagnosis. It does not directly measure fat mass, lean mass, or
            fat distribution. Two people with the same BMI can have very different body composition.
          </p>
          <p className={pClass}>
            For better context, combine BMI with waist-based tools and composition-focused tools such as the{" "}
            <a className="text-primary underline" href="/bri-calculator">
              body roundness (waist-height) check
            </a>
            ,{" "}
            <a className="text-primary underline" href="/body-fat-calculator">
              tape-based body fat estimate
            </a>
            ,{" "}
            <a className="text-primary underline" href="/waist-to-hip-ratio-calculator">
              waist-to-hip ratio risk check
            </a>
            ,{" "}
            <a className="text-primary underline" href="/waist-to-height-ratio-calculator">
              waist-to-height ratio screen
            </a>
            , and{" "}
            <a className="text-primary underline" href="/lean-body-mass-calculator">
              lean-mass estimate
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Related Tools</h2>
          <p className={pClass}>
            For direct BMI category screening, use the{" "}
            <a className="text-primary underline" href="/bmi-calculator">
              adult BMI calculator
            </a>
            . For practical goal setting, pair this with the{" "}
            <a className="text-primary underline" href="/ideal-weight-calculator">
              healthy-weight range planner
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              CDC adult BMI categories:
              <a className="text-primary underline ml-1" href="https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html">
                CDC BMI Categories
              </a>
            </li>
            <li>
              CDC BMI as a screening measure:
              <a className="text-primary underline ml-1" href="https://www.cdc.gov/bmi/about/index.html">
                About Adult BMI
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <MoreTools
            heading="More Tools"
            columns={2}
            toolSlugs={[
              "bmi-calculator",
              "ideal-weight-calculator",
              "tdee-calculator",
              "calorie-deficit-calculator",
              "weight-loss-calculator",
              "weight-loss-percentage-calculator",
              "waist-to-hip-ratio-calculator",
              "waist-to-height-ratio-calculator",
              "ponderal-index-calculator",
              "broca-index-calculator",
              "body-fat-calculator",
              "bri-calculator",
            ]}
            excludeSlug="overweight-calculator"
          />
        </div>
      </section>
    </main>
  );
}
