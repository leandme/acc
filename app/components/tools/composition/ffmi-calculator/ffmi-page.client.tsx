// app/(site)/(tools)/(body-composition)/ffmi-calculator/ffmi-page.client.tsx
"use client";

import { useState } from "react";
import FFMICalculator from "@/app/components/tools/composition/ffmi-calculator/ffmi-calculator";
import FFMIInterpretation from "@/app/components/tools/composition/ffmi-calculator/ffmi-interpretation";
import { MoreTools } from "../../template/more-tools";

type Gender = "male" | "female";

export default function FFMICalculatorPageClient() {
  const [gender, setGender] = useState<Gender>("male");
  const [ffmi, setFfmi] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      {/* Hero */}
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">
          FFMI Calculator
        </h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Calculate your fat free mass index
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
  <div className="w-full max-w-5xl">
    <FFMICalculator
      onChange={({ gender, normalizedFFMI }) => {
        setGender(gender);
        setFfmi(normalizedFFMI);
      }}
    />
  </div>
</div>


        {/* Extra SEO copy */}
        <div className={sectionWrap}>
          <h2 className={h2Class}>What is FFMI?</h2>

          <p className={pClass}>
            FFMI stands for Fat-Free Mass Index. It estimates how much lean mass
            you carry relative to your height. Unlike weight alone, FFMI tries to
            separate “how big you are” into lean mass versus fat mass, using your
            body fat % input.
          </p>

          <p className={pClass}>
            Normalized FFMI adjusts the score to a standard height so taller or
            shorter people can compare more fairly. The most useful way to use
            FFMI is as a trend metric: keep inputs consistent and watch how the
            number changes over time.
          </p>
        </div>

        {/* Centered like the estimate page */}
        <div
          id="ffmi-interpretation"
          className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20"
        >
          <FFMIInterpretation gender={gender} ffmi={ffmi} />
        </div>

        {/* More SEO Sections */}
        <div className={sectionWrap}>
          <h2 className={h2Class}>What This FFMI Calculator Tells You</h2>

          <p className={pClass}>
            The FFMI calculator above estimates your{" "}
            <strong>Fat-Free Mass Index (FFMI)</strong> based on your height,
            weight, and body fat percentage. Unlike scale weight alone, FFMI
            focuses on how much <em>lean mass</em> you carry relative to your
            height.
          </p>

          <p className={pClass}>
            After entering your stats, the calculator shows your FFMI, your
            height-adjusted (normalized) FFMI, and where you sit compared to
            typical ranges for men and women. This makes it easier to tell
            whether changes in your body are coming from real muscle gain or
            from fat.
          </p>

          <p className={pClass}>
            If you want an absolute lean-mass estimate before normalizing for
            height, use the{" "}
            <a className="text-primary underline" href="/lean-body-mass-calculator">
              Lean Body Mass Calculator
            </a>
            . For a skeletal-muscle-specific estimate from circumferences and
            skinfolds, use the{" "}
            <a className="text-primary underline" href="/muscle-mass-calculator">
              Muscle Mass Calculator
            </a>
            .
          </p>

          <p className={pClass}>
            To understand how skeletal build can change visual appearance at the
            same body-fat level, check the{" "}
            <a className="text-primary underline" href="/body-frame-size-calculator">
              Body Frame Size Calculator
            </a>
            .
          </p>

          <p className={pClass}>
            If your goal is estimating whether your current mass is still within
            common natural limits after frame adjustment, use the{" "}
            <a className="text-primary underline" href="/natty-or-not-calculator">
              Natty or Not Calculator
            </a>
            .
          </p>

          <p className={pClass}>
            If you want an explicit lean-mass ceiling model and stage table, use the{" "}
            <a className="text-primary underline" href="/muscular-potential-calculator">
              Muscular Potential Calculator
            </a>
            .
          </p>

          <p className={pClass}>
            If you want a combined score that blends structure leverage with projected muscular potential, use
            the{" "}
            <a className="text-primary underline" href="/bodybuilding-genetics-calculator">
              Bodybuilding Genetics Calculator
            </a>
            .
          </p>

          <p className={pClass}>
            If you want a waist-centered roundness score, compare with the{" "}
            <a className="text-primary underline" href="/bri-calculator">
              BRI Calculator
            </a>
            . If you prefer a hip-height adiposity estimate, use the{" "}
            <a className="text-primary underline" href="/bai-calculator">
              BAI Calculator
            </a>
            .
          </p>

          <p className={pClass}>
            For the most accurate results, use a realistic body fat estimate and
            your current body weight. FFMI works best as a{" "}
            <strong>trend metric</strong> — something you track over time as your
            training and nutrition evolve.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Why Measure FFMI?</h2>

          <p className={pClass}>
            Most people are familiar with BMI (Body Mass Index). It uses only
            height and weight, which makes it simple — but also deeply flawed for
            anyone who trains.
          </p>

          <p className={pClass}>
            BMI does not distinguish between muscle and fat. A lean, muscular
            athlete and someone carrying a high amount of body fat can end up
            with the same BMI, even though their bodies — and health profiles —
            are completely different.
            That tradeoff is covered in{" "}
            <a className="text-primary underline" href="/guides/bmi-vs-body-fat">BMI vs Body Fat % – Which Is Important?</a>.
          </p>

          <p className={pClass}>
            FFMI fixes this by stripping away fat mass and focusing on{" "}
            <strong>lean body mass relative to height</strong>. It answers a more
            useful question:{" "}
            <em>“How much muscle am I actually carrying for my frame?”</em>
          </p>

          <p className={pClass}>
            That makes FFMI especially valuable if you lift weights, care about
            physique changes, or want to know whether your training is building
            muscle — not just adding scale weight.
            For appearance variability at the same percentages, see{" "}
            <a className="text-primary underline" href="/guides/why-body-fat-looks-different">Why Two People at the Same Body Fat Percentage Look Different</a>.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>FFMI vs Normalized FFMI</h2>

          <p className={pClass}>
            Standard FFMI measures how much lean mass you carry relative to your
            height. However, FFMI naturally increases as height increases — even
            if two people have the same muscular development.
          </p>

          <p className={pClass}>
            This is why <strong>normalized FFMI</strong> exists. It adjusts FFMI
            to a standard reference height, allowing for fairer comparisons
            between people who are taller or shorter than average.
          </p>

          <p className={pClass}>
            In <a href="https://pubmed.ncbi.nlm.nih.gov/7496846/" className="text-primary underline">most research</a>, normalized FFMI is calculated using an average
            height of roughly 5’10–5’11. This makes normalized FFMI the better
            metric when comparing yourself to population ranges or to other
            individuals.
          </p>

          <p className={pClass}>
            If your goal is tracking personal progress, both numbers are useful.
            If your goal is comparison, normalized FFMI is the one to focus on.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Is FFMI Backed by Research?</h2>

          <p className={pClass}>
            Yes. FFMI has been studied in sports science and body composition
            research, including work examining FFMI in trained athletes and
            comparing typical ranges across groups.
          </p>

          <p className={pClass}>
            In practice, FFMI is often used as a rough reference for muscularity
            (lean mass relative to height). It’s not a diagnosis — but it can be
            a useful benchmark when paired with consistent inputs and trend
            tracking over time.
          </p>

          <p className={pClass}>
            If your FFMI looks unusually high, double-check the basics first:
            height, weight, and especially body fat percentage. Small errors in
            body fat % can move FFMI more than people expect.
          </p>
        </div>

        {/* ✅ More Tools (explicit picks) */}
        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <MoreTools
            heading="More Tools"
            columns={2}
            toolSlugs={[
              "estimate",
              "muscle-mass-calculator",
              "lean-body-mass-calculator",
              "natty-or-not-calculator",
              "muscular-potential-calculator",
              "casey-butt-calculator",
              "bodybuilding-genetics-calculator",
              "body-frame-size-calculator",
              "bai-calculator",
              "bri-calculator",
              "body-visualizer",
            ]}
            excludeSlug="ffmi-calculator"
          />
        </div>
      </section>
    </main>
  );
}
