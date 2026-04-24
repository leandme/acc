"use client";

import BodyFatCalculator from "@/app/components/tools/composition/body-fat-calculator/body-fat-calculator";
import CTA from "@/app/components/common/cta";
import FaqSection, { type FaqSectionItem } from "@/app/components/common/faq-section";

const NAVY_BODY_FAT_FAQ_ITEMS: FaqSectionItem[] = [
  {
    question: "How does this Navy body fat calculator work?",
    answer:
      "This calculator estimates body fat percentage from circumference measurements, not from imaging or direct tissue measurement. It applies the U.S. Navy circumference equations and is best used for consistent trend tracking over time.",
  },
  {
    question: "Which formula does this calculator use?",
    answer: (
      <div className="space-y-3">
        <p>All circumference inputs are converted to inches internally, then the standard equations are applied:</p>
        <div className="rounded-2xl border bg-white p-4 text-sm sm:text-base text-gray-800 overflow-x-auto">
          <p className="font-semibold">Men</p>
          <p className="mt-1 font-mono">%BF = 86.010 x log10(waist - neck) - 70.041 x log10(height) + 36.76</p>
          <p className="mt-4 font-semibold">Women</p>
          <p className="mt-1 font-mono">
            %BF = 163.205 x log10(waist + hip - neck) - 97.684 x log10(height) - 78.387
          </p>
        </div>
      </div>
    ),
  },
  {
    question: "Is weight required for the Navy equation?",
    answer:
      "Weight is optional for the core equation. On this page, weight is also used to estimate fat mass and lean mass from your body fat percentage result.",
  },
  {
    question: "How should I measure to get better results?",
    answer: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Measure on bare skin or thin clothing.</li>
        <li>Keep the tape level and snug without compressing tissue.</li>
        <li>Measure after a normal exhale with no flexing or stomach sucking-in.</li>
        <li>Use the same anatomical landmark every session.</li>
        <li>Take 2-3 readings and average them.</li>
        <li>Track at the same time of day and hydration state.</li>
      </ul>
    ),
  },
  {
    question: "How accurate is the Navy body fat method?",
    answer:
      "The Navy method is practical, low cost, and repeatable, but it is still an estimate. Accuracy varies by body type, fat distribution, training status, and measurement precision. Treat the output as directional rather than exact.",
  },
  {
    question: "Why can my result look too high or too low?",
    answer:
      "Small measurement errors, especially at waist and neck, can move the estimate more than expected. High muscularity, atypical fat distribution, and inconsistent tape placement can also increase deviation compared with methods like DEXA.",
  },
  {
    question: "How does the Navy method compare with other options?",
    answer: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Navy tape method: fast, repeatable, and measurement dependent.</li>
        <li>Skinfold calipers: site-based estimate using pinching technique.</li>
        <li>Smart scales (BIA): convenient but hydration sensitive.</li>
        <li>DEXA: stronger lab reference but higher cost and lower frequency.</li>
        <li>Photo estimation: useful visual feedback on appearance changes.</li>
      </ul>
    ),
  },
  {
    question: "How often should I use this calculator?",
    answer:
      "Weekly or every 2 weeks is usually best. Day-to-day checks create noise from hydration and normal body fluctuations.",
  },
  {
    question: "What is the best way to track progress with this method?",
    answer:
      "Keep your measurement technique consistent and focus on the trend line over several weeks. One isolated reading is less useful than repeated measurements under the same conditions.",
  },
  {
    question: "Is this medical advice?",
    answer:
      "No. This is a fitness estimation and education tool. For diagnosis or treatment decisions, use qualified medical guidance.",
  },
];

export default function BodyFatCalculatorPageClient() {
  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10 px-6">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">
          Navy Body Fat Calculator
        </h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate body fat percentage with the U.S. Navy circumference formula,
          then interpret your result with a color-scored range and trend-focused guidance.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <BodyFatCalculator />
          </div>
        </div>

        <FaqSection
          heading="Navy Body Fat Calculator FAQ"
          description="How the Navy method works, how to measure correctly, and how to interpret your result."
          items={NAVY_BODY_FAT_FAQ_ITEMS}
          accordionName="navy-body-fat-faq-accordion"
          className="mt-16 lg:mt-24 w-full"
        />

        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <CTA
            title="Try the Body Fat Estimator"
            description="Upload a photo and get a body fat % estimate in seconds."
            buttonText="Go to Body Fat Estimator →"
            href="/"
            className="my-0"
          />
        </div>
      </section>
    </main>
  );
}
