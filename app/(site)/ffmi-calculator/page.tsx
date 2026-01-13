// app/(site)/ffmi-calculator/page.tsx
import type { Metadata } from "next";
import FFMICalculator from "@/app/components/FFMICalculator/FFMICalculator";

export const metadata: Metadata = {
  title: "FFMI Calculator",
  description:
    "Calculate your FFMI and Normalized FFMI using height, weight, and body fat percentage. Includes lean body mass and fat mass breakdown.",
};

export default function FFMICalculatorPage() {
  return (
    <main className="bg-base-100">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-12">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">
          FFMI Calculator
        </h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate your Fat-Free Mass Index (FFMI) and Normalized FFMI using your
          height, weight, and body fat percentage. Useful for tracking muscularity
          over time — especially when your scale weight is misleading.
        </p>

        <div className="mt-8 flex justify-center">
          <FFMICalculator />
        </div>

        {/* Extra SEO copy */}
        <div className="mt-14 max-w-3xl mx-auto space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-2xl lg:text-3xl font-semibold text-center">
            What is FFMI?
          </h2>
          <p className="text-lg">
            FFMI stands for Fat-Free Mass Index. It estimates how much lean mass you
            carry relative to your height. Unlike weight alone, FFMI tries to separate
            “how big you are” into lean mass versus fat mass, using your body fat %
            input.
          </p>
          <p className="text-lg">
            Normalized FFMI adjusts the score to a standard height so taller or shorter
            people can compare more fairly. The most useful way to use FFMI is as a
            trend metric: keep inputs consistent and watch how the number changes over
            time.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="text-2xl lg:text-3xl font-semibold text-center">
          FFMI FAQs
        </h2>

        <div className="mt-8 space-y-3 max-w-3xl mx-auto">
          <div className="collapse collapse-plus border rounded-xl bg-base-100">
            <input type="radio" name="ffmi-faq" defaultChecked />
            <div className="collapse-title text-lg font-medium">
              What’s a “good” FFMI?
            </div>
            <div className="collapse-content">
              <p className="text-gray-700 text-lg">
                It depends on body fat %, training history, and genetics. In general,
                higher FFMI suggests more lean mass for your height. Use FFMI to compare
                yourself to your past self — not as a personality test.
              </p>
            </div>
          </div>

          <div className="collapse collapse-plus border rounded-xl bg-base-100">
            <input type="radio" name="ffmi-faq" />
            <div className="collapse-title text-lg font-medium">
              Why does FFMI depend on body fat percentage?
            </div>
            <div className="collapse-content">
              <p className="text-gray-700 text-lg">
                FFMI is based on fat-free mass (lean body mass). To estimate that, we
                need a body fat % to split your total weight into fat mass and lean mass.
                If your body fat % estimate is off, FFMI will be off too.
              </p>
            </div>
          </div>

          <div className="collapse collapse-plus border rounded-xl bg-base-100">
            <input type="radio" name="ffmi-faq" />
            <div className="collapse-title text-lg font-medium">
              What’s the difference between FFMI and BMI?
            </div>
            <div className="collapse-content">
              <p className="text-gray-700 text-lg">
                BMI is weight relative to height and ignores body composition.
                FFMI tries to measure lean mass relative to height, which is more relevant
                for muscularity tracking.
              </p>
            </div>
          </div>

          <div className="collapse collapse-plus border rounded-xl bg-base-100">
            <input type="radio" name="ffmi-faq" />
            <div className="collapse-title text-lg font-medium">
              What body fat % should I use?
            </div>
            <div className="collapse-content">
              <p className="text-gray-700 text-lg">
                Use the most consistent method you have — Navy tape measurements, a smart
                scale (less accurate but consistent), or a photo-based AI estimate. The
                best input is the one you can repeat the same way every time.
              </p>
            </div>
          </div>

          <div className="collapse collapse-plus border rounded-xl bg-base-100">
            <input type="radio" name="ffmi-faq" />
            <div className="collapse-title text-lg font-medium">
              Is this medical advice?
            </div>
            <div className="collapse-content">
              <p className="text-gray-700 text-lg">
                No. This is a fitness calculator for educational and tracking purposes.
                Inputs and estimates can be imperfect. Use it as a trend tool, not a diagnosis.
              </p>
            </div>
          </div>
        </div>


      </section>
    </main>
  );
}
