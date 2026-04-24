import { Metadata } from "next";
import BodyVisualizerTool from "@/app/components/tools/composition/body-visualizer/visualizer";
import { MoreTools } from "@/app/components/tools/template/more-tools";
import CTA from "@/app/components/common/cta";
import FaqJsonLd from "@/app/components/helpers/faq-json-ld";
import FaqSection, { type FaqSectionItem } from "@/app/components/common/faq-section";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Body Fat Visualizer – BMI, Weight, Height & Measurements",
  description: "Use an interactive body visualizer to test BMI, weight, height, and body-fat scenarios. Compare fat mass and lean mass outputs with a dynamic body render.",
  canonical: "https://bodyfatestimator.ai/body-visualizer",
});

const VISUALIZER_FAQS: Array<{ question: string; answer: string }> = [
  {
    question: "What is a body visualizer?",
    answer:
      "A body visualizer is an interactive model that shows how appearance may shift when you change body fat percentage, BMI, height, and weight assumptions.",
  },
  {
    question: "What is a BMI visualizer?",
    answer:
      "A BMI visualizer maps height and weight to a body-shape model so you can see how BMI changes may look, while still showing the numeric BMI result.",
  },
  {
    question: "How is a weight visualizer different from a BMI visualizer?",
    answer:
      "A weight visualizer focuses on scale-weight changes at a given height, while a BMI visualizer translates height and weight into BMI categories. This tool combines both views so you can see shape and metrics together.",
  },
  {
    question: "Why can two people with the same BMI look very different?",
    answer:
      "BMI uses only height and weight. It does not measure fat distribution, muscle mass, frame size, posture, or water retention, so two people can share the same BMI but look very different.",
  },
  {
    question: "What is Linked mode vs Independent mode?",
    answer:
      "Linked mode keeps BMI and body-fat sliders synchronized using a consistent prediction model for faster scenario testing. Independent mode lets each slider move separately for manual what-if comparisons.",
  },
  {
    question: "Can I switch between metric and imperial units?",
    answer:
      "Yes. You can toggle between metric and imperial units at any time. The tool converts values for display while keeping scenario relationships consistent.",
  },
  {
    question: "Does male vs female selection change the model?",
    answer:
      "Yes. The model uses different body-fat ranges and shape-bias assumptions by selected sex profile, so visual output and category interpretation update accordingly.",
  },
  {
    question: "What happens if I increase height while keeping weight the same?",
    answer:
      "BMI drops because the same mass is spread over a taller frame. The visual model usually appears leaner at the same weight when height is increased.",
  },
  {
    question: "Is body-fat mass the same as body-fat percentage?",
    answer:
      "No. Body-fat percentage is the share of your total weight that is fat. Fat mass is the absolute amount of fat in kg or lb: body weight x body-fat percentage.",
  },
  {
    question: "How accurate is a body visualizer?",
    answer:
      "It is best used as a directional planning and tracking tool, not a diagnosis. Visualizers are useful for trend comparisons and scenario testing but cannot replicate each person's exact anatomy.",
  },
  {
    question: "Can this replace DEXA, calipers, or clinical assessment?",
    answer:
      "No. It should not replace clinical or direct body-composition measurement methods. Use it for scenario planning and trend context, then validate with consistent real-world measurements.",
  },
  {
    question: "Should I trust BMI or body-fat percentage for physique tracking?",
    answer:
      "For physique changes, body-fat percentage and lean-mass context are usually more informative than BMI alone. BMI is still useful as a screening metric.",
  },
  {
    question: "Does this tool estimate visceral fat directly?",
    answer:
      "No. It does not directly measure visceral fat. It provides visual and formula-based composition context from selected slider inputs.",
  },
  {
    question: "Why might the model not look exactly like me?",
    answer:
      "The renderer is a standardized shape model. Individual fat distribution, posture, skeletal structure, and muscle insertions vary from person to person and cannot be matched exactly.",
  },
  {
    question: "How should I use this tool week to week?",
    answer:
      "Use consistent assumptions and compare changes every 2 to 4 weeks. Cross-check with repeated photos and simple measurements (like waist and weight) to reduce noise.",
  },
  {
    question: "Do I need to upload photos to use the body visualizer?",
    answer:
      "No. The body visualizer runs from your slider inputs and does not require photo upload.",
  },
];

const VISUALIZER_FAQ_ITEMS: FaqSectionItem[] = VISUALIZER_FAQS.map((faq) => ({
  question: faq.question,
  answer: faq.answer,
}));

const BODY_VISUALIZER_STEPS = [
  {
    id: "1",
    title: "Set Your Profile",
    description:
      "Choose male or female mode and switch between metric or imperial units so your inputs match how you normally track measurements.",
  },
  {
    id: "2",
    title: "Adjust Sliders",
    description:
      "Move body fat %, BMI, height, and weight to test different scenarios. Use Linked mode for synced updates or Independent mode for manual control.",
  },
  {
    id: "3",
    title: "Review the Snapshot",
    description:
      "Compare the 3D model and metric cards together. Focus on trend direction across scenarios, not a single exact value.",
  },
] as const;

const WHY_CHOOSE_BV_ITEMS = [
  {
    title: "Unmatched 3D Accuracy and Realism",
    description:
      "Experience precise 3D body visualization with anatomically consistent models that update in real time. Whether you are testing weight and height scenarios or running a detailed body simulation, the renderer is built for stable visual comparisons.",
  },
  {
    title: "Growing Ecosystem of Specialized Tools",
    description:
      "The Body Fat Visualizer is supported by complementary tools that continue to expand across composition, nutrition, and planning workflows. Each connected tool adds context to your scenarios and improves decision quality.",
  },
  {
    title: "Comprehensive Body Understanding",
    description:
      "Go beyond basic measurements and see how body-fat distribution, body type, and composition metrics can influence appearance. This helps you interpret BMI, body fat percentage, and shape outputs in one place.",
  },
  {
    title: "Real-Time Transformation Tracking",
    description:
      "Adjust sliders and immediately see how your model changes. This real-time loop makes it easier to compare scenarios, communicate goals, and track direction over time.",
  },
  {
    title: "Professional-Grade Analysis",
    description:
      "Core outputs are grounded in widely used formulas and composition metrics so you can evaluate trends with stronger context. It is practical enough for everyday users and detailed enough for advanced planning.",
  },
  {
    title: "Continuous Knowledge Updates",
    description:
      "Use the latest blog posts and research-backed explainers on body composition, tracking, and interpretation. You can apply that knowledge directly to your Body Fat Visualizer scenarios for clearer next steps.",
  },
] as const;

const SNAPSHOT_ROWS = [
  {
    metric: "Height",
    question: "How large is the frame?",
    whyItMatters:
      "Height affects how weight and fat distribution appear. The same weight can look very different at different heights.",
  },
  {
    metric: "Weight",
    question: "How much total mass is on the frame?",
    whyItMatters:
      "Weight alone is incomplete, but it anchors all composition outputs (fat mass, lean mass, BMI, FFMI).",
  },
  {
    metric: "BMI",
    question: "Where is weight relative to height?",
    whyItMatters:
      "BMI is a quick screening metric. It helps compare scenarios but does not distinguish fat from muscle.",
  },
  {
    metric: "Body Fat %",
    question: "How much of total weight is fat?",
    whyItMatters:
      "Body-fat percentage is more appearance-relevant than BMI for physique tracking.",
  },
  {
    metric: "Fat Mass",
    question: "How much fat mass is present in absolute terms?",
    whyItMatters:
      "Fat mass is practical for goal setting because it gives a concrete kg/lb value instead of only a percentage.",
  },
  {
    metric: "Lean Mass",
    question: "How much non-fat mass is present?",
    whyItMatters:
      "Lean mass helps separate fat loss from muscle loss and adds context when scale weight changes.",
  },
] as const;

export default function BodyVisualizerPage() {
  return (
    <main className="bg-base-100">
      <FaqJsonLd faqs={[...VISUALIZER_FAQS]} />

      <section className="mx-auto max-w-4xl px-6 pt-10 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold">Body Fat Visualizer</h1>
        <p className="mt-4 text-lg text-gray-700 leading-relaxed">
          Visualize your body shape with our male or female body visualizer based on body fat, bmi, height, weight and measurements.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-8">
        <BodyVisualizerTool />
      </section>

      <section className="mx-auto max-w-6xl px-6 mt-20 lg:mt-40">
        <h2 className="text-3xl lg:text-4xl font-semibold text-center">How to Use Body Fat Visualizer</h2>
        <p className="mt-4 text-center text-lg text-gray-700 max-w-3xl mx-auto">
          Follow these quick steps to run useful body-shape scenarios and interpret the output clearly.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {BODY_VISUALIZER_STEPS.map((step) => (
            <article key={step.id} className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary text-xl font-bold">
                {step.id}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-center text-gray-900">{step.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-left text-gray-700">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 mt-20 lg:mt-40">
        <h2 className="text-3xl lg:text-4xl font-semibold text-center">Why Choose Our Body Fat Visualizer</h2>
        <p className="mt-4 text-center text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
          Our Body Fat Visualizer is not just a 3D tool. It is the intelligent centerpiece of a complete
          body-transformation workflow, designed to connect visual modeling with practical composition insights.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {WHY_CHOOSE_BV_ITEMS.map((item) => (
            <article key={item.title} className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-3 text-lg text-gray-700 leading-relaxed">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="learn-more" className="mx-auto max-w-3xl px-6 pb-20">
        <div className="mt-20 lg:mt-40 space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">How this Body Fat Visualizer Works</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            This tool combines a dynamic body render with body-composition math so your visual and numeric outputs update together.
            You can control body fat %, BMI, height, and weight directly. The figure changes immediately using a consistent shape model,
            which makes comparison easier across check-ins.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            The result is a practical visualization model, not a medical scan. It is most useful for calibration and trend tracking over
            time.
          </p>
        </div>

        <div className="mt-20 lg:mt-40 space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">Formulas and data used</h2>
          <p className="text-gray-700 text-lg leading-relaxed">Core calculations shown in the results section:</p>
          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li>
              <strong>BMI:</strong> weight (kg) / height (m)^2 (compare with the{" "}
              <a className="text-primary underline" href="/tools">
                BMI Calculator
              </a>
              )
            </li>
            <li><strong>Fat mass:</strong> weight x body fat %</li>
            <li>
              <strong>Lean mass:</strong> weight x (1 - body fat %) (compare with the{" "}
              <a className="text-primary underline" href="/tools">
                Lean Body Mass Calculator
              </a>
              )
            </li>
            <li><strong>FFMI:</strong> lean mass (kg) / height (m)^2</li>
            <li>
              <strong>BRI:</strong> roundness from waist-height geometry (compare with the{" "}
              <a className="text-primary underline" href="/tools">
                BRI Calculator
              </a>
              )
            </li>
            <li>
              <strong>BAI:</strong> adiposity estimate from hip and height (compare with the{" "}
              <a className="text-primary underline" href="/tools">
                BAI Calculator
              </a>
              )
            </li>
            <li><strong>Body fat and BMI sync:</strong> Deurenberg-style age/sex-adjusted BMI equation</li>
          </ul>
          <p className="text-gray-700 text-lg leading-relaxed">
            The silhouette render uses these values as directional drivers (fatness, frame size, and muscularity bias) to provide a stable,
            interpretable visual model across slider changes.
          </p>
        </div>

        <div className="mt-20 lg:mt-40 space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            BMI Visualizer vs Weight Visualizer: what is the difference?
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            People often search for a <strong>BMI visualizer</strong> or a{" "}
            <strong>weight visualizer</strong> as if they are separate tools. In practice, they answer different
            parts of the same question:
          </p>
          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li>
              <strong>BMI visualizer:</strong> compares weight relative to height.
            </li>
            <li>
              <strong>Weight visualizer:</strong> focuses on total body mass changes over time.
            </li>
            <li>
              <strong>Body-fat visualizer:</strong> shows how that mass is split between fat and lean tissue.
            </li>
          </ul>
          <p className="text-gray-700 text-lg leading-relaxed">
            If you want a deeper comparison of BMI versus composition-based tracking, see{" "}
            <a className="text-primary underline" href="/blog/bmi-vs-body-fat">
              BMI vs Body Fat
            </a>
            .
          </p>
        </div>

        <div className="mt-20 lg:mt-40 space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">How to interpret height, weight, and body-fat outputs</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Use the table below to read each result quickly and avoid over-focusing on one number.
          </p>
          <div className="overflow-x-auto rounded-2xl border">
            <table className="min-w-full text-left">
              <thead className="bg-base-200">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800">Metric</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800">Question it answers</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-800">Why it matters</th>
                </tr>
              </thead>
              <tbody>
                {SNAPSHOT_ROWS.map((row) => {
                  const isPrimary = row.metric === "Body Fat %" || row.metric === "Fat Mass";
                  return (
                    <tr key={row.metric} className={`border-t ${isPrimary ? "bg-blue-50/70" : "bg-white"}`}>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{row.metric}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.question}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.whyItMatters}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            Practical rule: when BMI and visual appearance conflict, check body-fat % plus fat mass and lean mass before drawing conclusions.
          </p>
        </div>

        <FaqSection
          heading="Body Fat Visualizer FAQ"
          description="Common questions about body visualizer outputs, slider behavior, and accuracy limits."
          items={VISUALIZER_FAQ_ITEMS}
          accordionName="body-visualizer-faq-accordion"
          className="mt-20 lg:mt-40"
        />

        <div className="mt-20 lg:mt-40">
          <CTA
            title="Want a Photo-Based Body Fat Estimate?"
            description="Use the Body Fat Estimator to upload a photo and get a fast body fat % estimate you can track over time."
            buttonText="Go to Body Fat Estimator →"
            href="/"
            className="my-0"
          />
        </div>

        <div className="mt-20 lg:mt-40">
          <MoreTools
            heading="Related Tools"
            columns={2}
            toolSlugs={[
              "estimate",
              "body-fat-calculator",
              "skinfold-body-fat-calculator",
              "bai-calculator",
              "lean-body-mass-calculator",
              "bri-calculator",
              "body-frame-size-calculator",
              "body-shape-calculator",
              "ffmi-calculator",
              "rfm-calculator",
              "bmi-calculator",
              "weight-loss-calculator",
            ]}
            excludeSlug="body-visualizer"
          />
        </div>
      </section>
    </main>
  );
}
