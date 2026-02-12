import { Metadata } from "next";
import BodyFatCalculator from "@/app/components/tools/composition/body-fat-calculator/body-fat-calculator";

export const metadata: Metadata = {
  title: "Body Fat Calculator",
  description:
    "Calculate your body fat percentage using the U.S. Navy body fat formula. Enter height, weight, and measurements to estimate body fat at home.",
};

export default function BodyFatCalculatorPage() {
  return (
    <main className="bg-base-100">
      <div className="hero min-h-screen flex items-start justify-center pt-20 pb-20">
        <div className="w-full max-w-5xl px-6 flex flex-col items-center gap-8">
          {/* Hero */}
          <div className="text-center max-w-3xl">
            <h1 className="text-2xl lg:text-4xl font-bold">
              Body Fat Calculator
            </h1>
            <p className="mt-3 text-lg text-gray-700">
              The Body Fat Calculator can be used to estimate your total body fat using specific measurements.
            </p>
          </div>

          {/* Calculator */}
          <BodyFatCalculator />

          {/* SEO content */}
          <section className="w-full max-w-3xl mt-10 space-y-6 text-gray-700 leading-relaxed">
            <h2 className="text-2xl font-semibold text-gray-900">
              How this body fat calculator works
            </h2>
            <p className="text-lg">
              This page uses the U.S. Navy body fat formula, which estimates body fat percentage
              from body measurements. It’s fast, consistent, and popular for at-home tracking.
              Like any calculator, it’s an estimate — accuracy depends on measurement technique
              and body shape.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900">
              How to measure for best results
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Measure on bare skin if possible (or thin clothing).</li>
              <li>Stand relaxed, normal breathing, don’t suck in.</li>
              <li>Take each measurement 2–3 times and use the average.</li>
              <li>Track trends: use the same method + same time of day each time.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900">
              Calculator vs photo-based AI estimation
            </h2>
            <p className="text-lg">
              Tape-measure calculators are great for consistency, but they don’t “see” fat
              distribution or how your physique looks. Photo-based AI estimation is useful for
              visual reality-checks and tracking appearance changes — especially when you use
              consistent photos (and multiple photos for higher accuracy).
            </p>

            <div className="rounded-2xl border bg-white p-6 mt-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Want a visual estimate from a photo?
              </h3>
              <p className="mt-2 text-lg text-gray-700">
                Upload a photo and get a body fat estimate in seconds.
              </p>
              <div className="mt-5 flex justify-center">
                <a href="/estimate" className="btn btn-primary btn-lg text-white">
                  Estimate From a Photo →
                </a>
              </div>
            </div>

          </section>
        </div>
      </div>
    </main>
  );
}
