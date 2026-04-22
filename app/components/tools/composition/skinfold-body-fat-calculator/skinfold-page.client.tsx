"use client";

import { useState } from "react";
import SkinfoldBodyFatCalculator from "@/app/components/tools/composition/skinfold-body-fat-calculator/skinfold-body-fat-calculator";
import SkinfoldInterpretation from "@/app/components/tools/composition/skinfold-body-fat-calculator/skinfold-interpretation";
import { MoreTools } from "../../template/more-tools";

type Sex = "male" | "female";

type SiteCard = {
  title: string;
  image: string;
  alt: string;
  steps: string[];
};

const MALE_SITE_CARDS: SiteCard[] = [
  {
    title: "Chest (Pectoral)",
    image: "/tools/skinfold-sites/chest.svg",
    alt: "Chest skinfold measurement location",
    steps: [
      "Find the midpoint between the front armpit fold and nipple.",
      "Pinch a diagonal fold with thumb and index finger.",
      "Place caliper jaws 1 cm below the fingers and read after 1 to 2 seconds.",
    ],
  },
  {
    title: "Abdomen",
    image: "/tools/skinfold-sites/abdomen.svg",
    alt: "Abdomen skinfold measurement location",
    steps: [
      "Locate a point about 2 cm to the right of the navel.",
      "Lift a vertical skinfold away from the abdominal wall.",
      "Apply calipers and record the reading in millimeters.",
    ],
  },
  {
    title: "Thigh",
    image: "/tools/skinfold-sites/thigh.svg",
    alt: "Thigh skinfold measurement location",
    steps: [
      "Measure on the front of the thigh midway between hip and kneecap.",
      "Keep body weight on the opposite leg to relax the measured thigh.",
      "Pinch a vertical fold and read with calipers.",
    ],
  },
];

const FEMALE_SITE_CARDS: SiteCard[] = [
  {
    title: "Triceps",
    image: "/tools/skinfold-sites/triceps.svg",
    alt: "Triceps skinfold measurement location",
    steps: [
      "Mark the midpoint between shoulder and elbow on the back of upper arm.",
      "Lift a vertical skinfold at the marked site.",
      "Apply calipers 1 cm below fingers and read after 1 to 2 seconds.",
    ],
  },
  {
    title: "Suprailiac",
    image: "/tools/skinfold-sites/suprailiac.svg",
    alt: "Suprailiac skinfold measurement location",
    steps: [
      "Find the area just above the iliac crest on the side of the waist.",
      "Pinch a diagonal fold following the natural skin line.",
      "Place calipers below fingers and log the mm reading.",
    ],
  },
  {
    title: "Thigh",
    image: "/tools/skinfold-sites/thigh.svg",
    alt: "Thigh skinfold measurement location",
    steps: [
      "Measure on the front of thigh halfway between hip and kneecap.",
      "Keep leg relaxed and pinch a vertical fold.",
      "Take the caliper reading after 1 to 2 seconds.",
    ],
  },
];

function SiteCardGrid({ title, cards }: { title: string; cards: SiteCard[] }) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-center">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card) => (
          <article key={card.title} className="rounded-2xl border bg-white p-4">
            <img src={card.image} alt={card.alt} loading="lazy" className="w-full rounded-xl border" />
            <h4 className="mt-4 text-xl font-semibold text-gray-900">{card.title}</h4>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed">
              {card.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function SkinfoldBodyFatPageClient() {
  const [sex, setSex] = useState<Sex>("male");
  const [bodyFatPct, setBodyFatPct] = useState<number | null>(null);
  const [sum3, setSum3] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Skinfold Body Fat Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate body fat percentage from 3-site skinfold caliper measurements with Jackson-Pollock
          equations and Siri conversion.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <SkinfoldBodyFatCalculator
              onChange={({ sex, bodyFatPct, sum3 }) => {
                setSex(sex);
                setBodyFatPct(bodyFatPct);
                setSum3(sum3);
              }}
            />
          </div>
        </div>

        <div id="skinfold-interpretation" className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20">
          <SkinfoldInterpretation sex={sex} bodyFatPct={bodyFatPct} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Skinfold Calculator Uses</h2>
          <p className={pClass}>
            This tool uses the Jackson-Pollock 3-site protocol, which estimates body density from three
            skinfold measurements plus age. It then converts density to body-fat percentage using the Siri
            equation.
          </p>
          <p className={pClass}>
            Skinfold measurements estimate subcutaneous fat, not total body fat directly. Accuracy depends
            heavily on consistent site location and pinching technique.
          </p>
          {bodyFatPct != null && sum3 != null ? (
            <p className={pClass}>
              Current estimate: <strong>{bodyFatPct.toFixed(1)}%</strong> body fat from a 3-site total of{" "}
              <strong>{sum3.toFixed(1)} mm</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Equations Used</h2>
          <p className={pClass}>The calculator applies sex-specific Jackson-Pollock 3-site equations:</p>
          <div className="rounded-2xl border bg-white p-6 text-sm sm:text-base text-gray-800 overflow-x-auto">
            <p className="font-semibold">Men (sites: chest, abdomen, thigh)</p>
            <p className="mt-1 font-mono">
              Density = 1.10938 - 0.0008267 x S + 0.0000016 x S^2 - 0.0002574 x Age
            </p>

            <p className="mt-4 font-semibold">Women (sites: triceps, suprailiac, thigh)</p>
            <p className="mt-1 font-mono">
              Density = 1.0994921 - 0.0009929 x S + 0.0000023 x S^2 - 0.0001392 x Age
            </p>

            <p className="mt-4 font-semibold">Siri conversion</p>
            <p className="mt-1 font-mono">%Body Fat = (495 / Density) - 450</p>
          </div>
          <p className={pClass}>
            In the equations above, <strong>S</strong> is the sum of the three skinfold measurements in
            millimeters.
          </p>
        </div>

        <div className="w-full max-w-6xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20 px-6 space-y-10">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">How To Measure Skinfold Sites</h2>

          <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
            For better consistency, always measure on dry skin, hold the pinch while reading the caliper,
            and average at least 2 to 3 readings per site.
          </p>

          <SiteCardGrid title="Men: 3-Site Protocol" cards={MALE_SITE_CARDS} />
          <SiteCardGrid title="Women: 3-Site Protocol" cards={FEMALE_SITE_CARDS} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Accuracy and Limitations</h2>
          <p className={pClass}>
            Skinfold calipers can be useful when technique is consistent, but results vary with tester
            experience, caliper quality, and hydration status. Small placement differences can shift your
            estimate.
          </p>
          <p className={pClass}>
            Use skinfolds as a trend metric. If the protocol and measurer stay consistent, direction over
            time is often more useful than one absolute value.
          </p>
          <p className={pClass}>
            For comparison, check the{" "}
            <a className="text-primary underline" href="/body-fat-calculator">
              Navy Body Fat Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/army-body-fat-calculator">
              Army Body Fat Calculator
            </a>
            {" "}plus the{" "}
            <a className="text-primary underline" href="/bri-calculator">
              BRI Calculator
            </a>{" "}
            for waist-centered roundness context, or the{" "}
            <a className="text-primary underline" href="/bai-calculator">
              BAI Calculator
            </a>{" "}
            for hip-height adiposity.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Jackson AS, Pollock ML. Generalized equations for predicting body density of men.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/718832/">
                PubMed record
              </a>
            </li>
            <li>
              Jackson AS, Pollock ML, Ward A. Generalized equations for predicting body density of women.
              <a
                className="text-primary underline ml-1"
                href="https://pubmed.ncbi.nlm.nih.gov/7402053/"
              >
                PubMed record
              </a>
            </li>
            <li>
              Ackland TR, et al. Current status of body composition assessment in sport and exercise.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/22303996/">
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
              "army-body-fat-calculator",
              "bai-calculator",
              "bri-calculator",
              "rfm-calculator",
              "estimate",
            ]}
            excludeSlug="skinfold-body-fat-calculator"
          />
        </div>
      </section>
    </main>
  );
}
