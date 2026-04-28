import { Metadata } from "next";
import FaqSection from "@/app/components/common/faq-section";
import { buildPageMetadata } from "@/app/libs/seo";

const title = "How It Works | AI Calorie Counter";
const description =
  "See how AI Calorie Counter analyzes a food photo and returns calories, macros, and practical nutrition insights in seconds.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  canonical: "https://ai-calorie-counter.com/how-it-works",
});

const STEPS = [
  {
    number: "01",
    title: "Upload Your Food Photo",
    description:
      "Take one clear image with your full meal visible, including sauces and sides when possible.",
  },
  {
    number: "02",
    title: "AI Estimates Calories and Macros",
    description:
      "The model identifies likely ingredients, estimates portions, and calculates calories plus protein, carbs, and fat.",
  },
  {
    number: "03",
    title: "Review and Track",
    description:
      "Use your estimate to log the meal quickly, then repeat with similar photo conditions for better consistency over time.",
  },
];

const FAQ_ITEMS = [
  {
    question: "How accurate is AI Calorie Counter?",
    answer:
      "AI Calorie Counter is built for practical tracking. Accuracy depends on photo quality, visible portions, and hidden ingredients, so it is best used for trend tracking rather than lab-level precision.",
  },
  {
    question: "Can I scan multiple foods in one photo?",
    answer:
      "Yes. Mixed plates are supported. The tool estimates total calories and can provide item-level breakdowns when confidence is high enough.",
  },
  {
    question: "Can it estimate macros too?",
    answer:
      "Yes. Along with total calories, you can get estimated protein, carbs, and fat when the image provides enough visual signal.",
  },
  {
    question: "Does this work for restaurant meals?",
    answer:
      "Yes. Restaurant meals can be analyzed, but hidden oils and preparation details can increase uncertainty, so use the estimate range for better decisions.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No app download is required. You can use AI Calorie Counter directly in your browser on desktop or mobile.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="bg-base-100">
      <section className="mx-auto max-w-7xl px-6 pt-14 pb-20 lg:pt-20 lg:pb-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <span className="badge badge-outline text-primary border-primary">
              How It Works
            </span>

            <h1 className="mt-5 text-4xl lg:text-5xl font-bold leading-tight">
              How AI Calorie Counter
              <br />
              turns food photos into calorie estimates
            </h1>

            <p className="mt-5 text-lg text-gray-700 leading-relaxed max-w-2xl">
              Skip manual lookup. Upload a food photo and get estimated calories,
              meal classification, and macro breakdown in seconds.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border bg-base-100 p-4">
                <p className="text-sm uppercase tracking-wide text-gray-500">
                  Food Photos
                </p>
                <p className="mt-1 text-3xl font-semibold">120K+</p>
              </div>
              <div className="rounded-xl border bg-base-100 p-4">
                <p className="text-sm uppercase tracking-wide text-gray-500">
                  Typical Accuracy
                </p>
                <p className="mt-1 text-3xl font-semibold">85-95%</p>
              </div>
              <div className="rounded-xl border bg-base-100 p-4">
                <p className="text-sm uppercase tracking-wide text-gray-500">
                  Time To Insight
                </p>
                <p className="mt-1 text-3xl font-semibold">~12s</p>
              </div>
            </div>
          </div>

          <article className="rounded-2xl border bg-base-100 p-6 lg:p-8 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold">Grilled Salmon Bowl</h2>
                <p className="text-gray-600 mt-1">Nutrition summary</p>
                <p className="text-sm text-gray-500">Estimated plate size: ~420g</p>
              </div>
              <span className="badge badge-outline">1 serving</span>
            </div>

            <p className="mt-5 text-gray-700 leading-relaxed">
              Brown rice, salmon, greens, avocado, and dressing. Balanced
              profile with strong protein and moderate carbs.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="badge badge-outline">Balanced Meal</span>
              <span className="badge badge-outline">High Protein</span>
              <span className="badge badge-outline">Lunch</span>
            </div>

            <div className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-gray-700">
              Estimates are directional. Consistent photo angle and lighting
              improve reliability over time.
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border bg-base-200 p-3">
                <p className="text-sm text-gray-600">Calories</p>
                <p className="text-2xl font-semibold mt-1">615</p>
              </div>
              <div className="rounded-xl border bg-base-200 p-3">
                <p className="text-sm text-gray-600">Protein</p>
                <p className="text-2xl font-semibold mt-1">38g</p>
              </div>
              <div className="rounded-xl border bg-base-200 p-3">
                <p className="text-sm text-gray-600">Carbs</p>
                <p className="text-2xl font-semibold mt-1">58g</p>
              </div>
              <div className="rounded-xl border bg-base-200 p-3">
                <p className="text-sm text-gray-600">Fat</p>
                <p className="text-2xl font-semibold mt-1">24g</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:pb-28">
        <h2 className="text-3xl lg:text-4xl font-bold text-center">
          Decode your meals in 3 easy steps
        </h2>
        <p className="text-center text-lg text-gray-700 mt-4 max-w-3xl mx-auto">
          Capture, analyze, and get informed. Each scan moves from photo to
          practical nutrition insights in seconds.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {STEPS.map((step) => (
            <article key={step.number} className="rounded-2xl border bg-base-100 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="badge badge-primary badge-lg text-white">
                  {step.number}
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-gray-700 leading-relaxed">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 lg:pb-28">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-base-100 p-8 shadow-sm">
            <h2 className="text-3xl font-semibold">Start scanning in under 60 seconds</h2>
            <ul className="mt-5 space-y-3 text-gray-700">
              <li>Upload one Food Photo and get instant calorie insights.</li>
              <li>Review estimated macros and meal type in one result card.</li>
              <li>Repeat scans over time to spot trends in your eating habits.</li>
            </ul>

          </div>

          <div className="rounded-2xl border bg-base-100 p-8 shadow-sm">
            <p className="text-sm uppercase tracking-wide text-gray-500">Trusted by users</p>
            <blockquote className="mt-4 rounded-xl border bg-base-100 p-4 text-gray-700 leading-relaxed">
              "This made calorie tracking much easier to stick with. I can log meals in
              seconds and still keep a solid macro routine."
            </blockquote>
            <p className="mt-3 font-semibold">Jordan M. - Fitness Coach</p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-base-200 p-4">
                <p className="text-sm text-gray-600">Weekly Time Saved</p>
                <p className="text-3xl font-semibold mt-1">4.2 hrs</p>
              </div>
              <div className="rounded-xl border bg-base-200 p-4">
                <p className="text-sm text-gray-600">Average Streak</p>
                <p className="text-3xl font-semibold mt-1">12 days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FaqSection
        id="how-it-works-faq"
        accordionName="how-it-works-faq-accordion"
        heading="Frequently Asked Questions"
        description="Answers to common questions about how AI Calorie Counter estimates calories from food photos."
        items={FAQ_ITEMS}
        className="mt-0 pt-2 pb-20 lg:pb-28"
      />
    </main>
  );
}
