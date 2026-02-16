"use client";

import { useState } from "react";
import BodyFrameSizeCalculator from "@/app/components/tools/composition/body-frame-size-calculator/body-frame-size-calculator";
import FrameInterpretation from "@/app/components/tools/composition/body-frame-size-calculator/frame-interpretation";
import { MoreTools } from "../../template/more-tools";

type Sex = "male" | "female";

type MeasureCard = {
  title: string;
  image: string;
  alt: string;
  steps: string[];
};

const MEASURE_CARDS: MeasureCard[] = [
  {
    title: "Height",
    image: "/tools/frame-size/height.svg",
    alt: "Height measurement example for frame-size calculator",
    steps: [
      "Stand barefoot against a wall with heels, glutes, and upper back lightly touching.",
      "Keep eyes forward and head neutral.",
      "Use a flat object at the top of the head and measure from floor to that mark.",
    ],
  },
  {
    title: "Wrist Circumference",
    image: "/tools/frame-size/wrist-circumference.svg",
    alt: "Wrist circumference measurement example for frame-size calculator",
    steps: [
      "Measure the narrowest wrist point between hand and forearm.",
      "Wrap tape snugly without compressing skin.",
      "Take 2 to 3 readings and average for consistency.",
    ],
  },
];

function MeasurementGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {MEASURE_CARDS.map((card) => (
        <article key={card.title} className="rounded-2xl border bg-white p-4">
          <img src={card.image} alt={card.alt} loading="lazy" className="w-full rounded-xl border" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">{card.title}</h3>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed">
            {card.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

export default function BodyFrameSizePageClient() {
  const [sex, setSex] = useState<Sex>("male");
  const [ratio, setRatio] = useState<number | null>(null);
  const [frameLabel, setFrameLabel] = useState<string | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Body Frame Size Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate frame size from height and wrist circumference using a practical height-to-wrist ratio.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <BodyFrameSizeCalculator
              onChange={({ sex, ratio, frameLabel }) => {
                setSex(sex);
                setRatio(ratio);
                setFrameLabel(frameLabel);
              }}
            />
          </div>
        </div>

        <div id="body-frame-size-interpretation" className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <FrameInterpretation sex={sex} ratio={ratio} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Body Frame Size Calculator Shows</h2>
          <p className={pClass}>
            Body frame size is a skeletal-build classification often used to add context to weight targets,
            clothing fit, and physique comparisons. This tool estimates frame size from the ratio of
            height to wrist circumference.
          </p>
          <p className={pClass}>
            It does not estimate body fat directly. Instead, it helps explain why two people at similar
            body fat or body weight can still look different.
          </p>
          {ratio != null && frameLabel ? (
            <p className={pClass}>
              Current result: ratio <strong>{ratio.toFixed(2)}</strong>, classified as{" "}
              <strong>{frameLabel}</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Formula and Thresholds</h2>
          <p className={pClass}>This calculator uses:</p>
          <div className="rounded-2xl border bg-white p-6 text-sm sm:text-base text-gray-800 overflow-x-auto">
            <p className="font-mono">Frame Ratio = Height (cm) / Wrist Circumference (cm)</p>
            <p className="mt-4 font-semibold">Women</p>
            <p className="mt-1 font-mono">Small: &gt; 11.0 | Medium: 10.1-11.0 | Large: &lt; 10.1</p>
            <p className="mt-4 font-semibold">Men</p>
            <p className="mt-1 font-mono">Small: &gt; 10.4 | Medium: 9.6-10.4 | Large: &lt; 9.6</p>
          </div>
          <p className={pClass}>
            These thresholds are practical screening ranges. Use them for context, not diagnosis.
          </p>
        </div>

        <div className="w-full max-w-6xl mx-auto mt-20 lg:mt-40 px-6 space-y-8">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">How To Measure Input Sections</h2>
          <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
            This tool uses body-size measurements only and does not require skinfold calipers. Use the
            same protocol each time for stable results.
          </p>
          <MeasurementGrid />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use This Result</h2>
          <p className={pClass}>
            Frame size helps contextualize composition tools. Smaller frames may look softer at the same
            body fat percentage, while larger frames can appear leaner at similar percentages.
          </p>
          <p className={pClass}>
            Pair this with the{" "}
            <a className="text-primary underline" href="/ffmi-calculator">
              FFMI Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/lean-body-mass-calculator">
              Lean Body Mass Calculator
            </a>{" "}
            for better body-composition context. For waist-height roundness trends, use the{" "}
            <a className="text-primary underline" href="/bri-calculator">
              BRI Calculator
            </a>
            . For hip-height adiposity context, compare with the{" "}
            <a className="text-primary underline" href="/bai-calculator">
              BAI Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Chumlea WC, et al. Frame size and body composition in middle-aged adults.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/12036807/">
                PubMed record
              </a>
            </li>
            <li>
              CDC guidance on adult BMI use and interpretation:
              <a
                className="text-primary underline ml-1"
                href="https://www.cdc.gov/bmi/about/index.html"
              >
                About Adult BMI
              </a>
            </li>
            <li>
              WHO obesity and overweight clinical/public-health context:
              <a className="text-primary underline ml-1" href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight">
                WHO fact sheet
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
              "lean-body-mass-calculator",
              "bai-calculator",
              "bri-calculator",
              "body-visualizer",
              "rfm-calculator",
            ]}
            excludeSlug="body-frame-size-calculator"
          />
        </div>
      </section>
    </main>
  );
}
