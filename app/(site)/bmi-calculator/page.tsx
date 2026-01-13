// app/(site)/bmi-calculator/page.tsx
import type { Metadata } from "next";
import BMICalculator from "@/app/components/BMICalculator/BMICalculator";

export const metadata: Metadata = {
  title: "BMI Calculator",
  description:
    "Calculate your BMI using metric or imperial units. Includes BMI category, healthy weight range, and quick links to body fat estimation tools.",
};

export default function BMICalculatorPage() {
  return (
    <main className="bg-base-100">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-center">
          BMI Calculator
        </h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Calculate your Body Mass Index (BMI) in seconds. BMI is a quick
          height-to-weight screening metric — useful at population scale, but it
          doesn’t tell you how much of your weight is muscle vs fat.
        </p>

        <div className="mt-8 flex justify-center">
          <BMICalculator />
        </div>

        {/* SEO copy */}
        <div className="mt-14 max-w-3xl mx-auto space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-2xl lg:text-3xl font-semibold text-center">
            What does BMI mean?
          </h2>
          <p className="text-lg">
            BMI is calculated from your height and weight. It’s commonly used as
            a simple screening tool, but it can misclassify people who are very
            muscular, very lean, or have atypical body composition.
          </p>
          <p className="text-lg">
            If your goal is physique tracking, BMI is best paired with something
            that reflects body composition — like tape measurements, a photo-based
            body fat estimate, or progress photos over time.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="text-2xl lg:text-3xl font-semibold text-center">
          BMI FAQs
        </h2>

        <div className="mt-8 space-y-3 max-w-3xl mx-auto">
          <div className="collapse collapse-plus border rounded-xl bg-base-100">
            <input type="radio" name="bmi-faq" defaultChecked />
            <div className="collapse-title text-lg font-medium">
              Is BMI accurate?
            </div>
            <div className="collapse-content">
              <p className="text-gray-700 text-lg">
                BMI is a useful screening metric, but it’s not a direct measure of
                body fat. Athletic or muscular people can have a “high” BMI while
                being lean. Use BMI as a rough signal, not a diagnosis.
              </p>
            </div>
          </div>

          <div className="collapse collapse-plus border rounded-xl bg-base-100">
            <input type="radio" name="bmi-faq" />
            <div className="collapse-title text-lg font-medium">
              What’s the difference between BMI and body fat percentage?
            </div>
            <div className="collapse-content">
              <p className="text-gray-700 text-lg">
                BMI is based only on height and weight. Body fat percentage estimates
                how much of your weight is fat vs lean mass. Two people can have the
                same BMI but very different body fat percentages.
              </p>
            </div>
          </div>

          <div className="collapse collapse-plus border rounded-xl bg-base-100">
            <input type="radio" name="bmi-faq" />
            <div className="collapse-title text-lg font-medium">
              Can BMI be used to track progress?
            </div>
            <div className="collapse-content">
              <p className="text-gray-700 text-lg">
                It can track weight change relative to height, but it won’t tell you
                if the change came from fat or muscle. For physique progress, pair BMI
                with a body fat estimate or consistent progress photos.
              </p>
            </div>
          </div>

          <div className="collapse collapse-plus border rounded-xl bg-base-100">
            <input type="radio" name="bmi-faq" />
            <div className="collapse-title text-lg font-medium">
              Is this medical advice?
            </div>
            <div className="collapse-content">
              <p className="text-gray-700 text-lg">
                No. This calculator is for educational and general tracking purposes only.
                If you’re concerned about your health, speak to a qualified professional.
              </p>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}
