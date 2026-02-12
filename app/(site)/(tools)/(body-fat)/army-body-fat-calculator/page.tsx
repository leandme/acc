import { Metadata } from "next";
import ArmyBodyFatCalculator from "@/app/components/tools/composition/army-body-fat-calculator/army-body-fat-calculator";

export const metadata: Metadata = {
  title: "Army Body Fat Calculator",
  description:
    "Estimate your body fat percentage using the U.S. Army tape test method (circumference-based). Enter height and measurements to calculate body fat at home.",
};

export default function ArmyBodyFatCalculatorPage() {
  return (
    <main className="bg-base-100">
      <div className="hero min-h-screen flex items-start justify-center pt-20 pb-20">
        <div className="w-full max-w-5xl px-6 flex flex-col items-center gap-8">
          {/* Hero */}
          <div className="text-center max-w-3xl">
            <h1 className="text-2xl lg:text-4xl font-bold">
              Army Body Fat Calculator
            </h1>

            <p className="mt-3 text-lg text-gray-700">
              Estimate your body fat percentage using the <strong>U.S. Army tape test</strong> —
              a circumference-based method that uses a measuring tape (and height) to produce a
              consistent, repeatable estimate.
            </p>

            <p className="mt-2 text-base text-gray-600">
              This is a calculator-based estimate, not a medical measurement. For best results,
              measure carefully and track trends over time.
            </p>
          </div>

          {/* Calculator */}
          <ArmyBodyFatCalculator />

          {/* SEO content */}
          <section className="w-full max-w-3xl mt-10 space-y-6 text-gray-700 leading-relaxed">
            <h2 className="text-2xl font-semibold text-gray-900">
              How the Army body fat calculator works
            </h2>

            <p className="text-lg">
              The Army tape test estimates body fat using <strong>circumference measurements</strong>
              (taken with a tape measure) plus your height. It doesn’t measure fat tissue directly —
              it infers body fat from how measurements typically correlate with body composition.
            </p>

            <p className="text-lg">
              The upside: it’s fast, cheap, and <strong>very consistent</strong> if you measure the same way
              each time. The downside: it can be less accurate for certain body types (for example,
              people with unusually high muscle mass or atypical fat distribution).
            </p>

            <h2 className="text-2xl font-semibold text-gray-900">
              How to measure for the most accurate result
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Measure on bare skin if possible (or thin clothing).</li>
              <li>Stand relaxed, normal breathing — don’t suck in or flex.</li>
              <li>Keep the tape level and snug, but not digging into the skin.</li>
              <li>Take each measurement 2–3 times and use the average.</li>
              <li>For tracking: measure at the same time of day, same conditions.</li>
            </ul>

            <div className="rounded-2xl border bg-gray-50 p-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Pro tip: treat it like a trend tool
              </h3>
              <p className="mt-2 text-lg text-gray-700">
                Even if the absolute number isn’t perfect, the tape test is excellent for
                monitoring change — especially when you’re cutting, maintaining, or slowly recompositioning.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900">
              Army tape test vs photo-based estimation
            </h2>

            <p className="text-lg">
              The tape test is great for consistency, but it doesn’t “see” your physique —
              muscle mass, posture, and fat distribution can change how someone looks at the same number.
              Photo-based estimation is helpful as a visual reality-check, especially if you take
              consistent photos (front + side, similar lighting, similar distance).
            </p>

            <div className="rounded-2xl border bg-white p-6 mt-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Want a visual estimate from a photo?
              </h3>
              <p className="mt-2 text-lg text-gray-700">
                Upload a photo and get a body fat estimate in seconds — plus tips to improve accuracy.
              </p>
              <div className="mt-5 flex justify-center">
                <a href="/estimate" className="btn btn-primary btn-lg text-white">
                  Estimate From a Photo →
                </a>
              </div>
            </div>

            <p className="text-sm text-gray-500 pt-2">
              Note: “Army body fat calculator” is commonly used to describe circumference-based tape-test
              estimates. This page provides an estimate for fitness tracking and general education.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
