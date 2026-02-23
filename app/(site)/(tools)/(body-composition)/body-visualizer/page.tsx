import { Metadata } from "next";
import BodyVisualizerTool from "@/app/components/tools/composition/body-visualizer/visualizer";
import { MoreTools } from "@/app/components/tools/template/more-tools";
import FaqJsonLd from "@/app/components/helpers/faq-json-ld";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Body Visualizer - BMI, Weight, Body Fat & Height",
  description: "Use an interactive body visualizer to test BMI, weight, height, and body-fat scenarios. Compare fat mass and lean mass outputs with a dynamic body render.",
  canonical: "https://bodyfatestimator.ai/body-visualizer",
});

const VISUALIZER_FAQS = [
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
    question: "Should I trust BMI or body-fat percentage for physique tracking?",
    answer:
      "For physique changes, body-fat percentage and lean-mass context are usually more informative than BMI alone. BMI is still useful as a screening metric.",
  },
  {
    question: "How should I use this tool week to week?",
    answer:
      "Use consistent assumptions and compare changes every 2 to 4 weeks. Pair this visualizer with repeated photos and waist measurements to reduce noise.",
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
        <h1 className="text-4xl lg:text-5xl font-bold">Body Visualizer</h1>
        <p className="mt-4 text-lg text-gray-700 leading-relaxed">
          Explore how body shape changes as you adjust body fat %, BMI, height, and weight.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-8 pb-12">
        <BodyVisualizerTool />
      </section>

      <section id="learn-more" className="mx-auto max-w-3xl px-6 pb-20">
        <div className="mt-20 lg:mt-40 space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">How this Body Visualizer works</h2>
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
          <h2 className="text-3xl lg:text-4xl font-semibold">How to use the sliders together</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            You can run the tool in Linked or Independent mode. Linked mode syncs BMI and body fat using a consistent prediction model
            for faster scenario testing, while Independent mode lets each slider move on its own.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            For real-world tracking, keep setup consistent and compare trends every 2 to 4 weeks. If you want photo-based validation,
            pair this page with the <a className="text-primary underline" href="/estimate">Body Fat Estimator</a>.
          </p>
        </div>

        <div className="mt-20 lg:mt-40 space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">Formulas and data used</h2>
          <p className="text-gray-700 text-lg leading-relaxed">Core calculations shown in the results section:</p>
          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li>
              <strong>BMI:</strong> weight (kg) / height (m)^2 (compare with the{" "}
              <a className="text-primary underline" href="/bmi-calculator">
                BMI Calculator
              </a>
              )
            </li>
            <li><strong>Fat mass:</strong> weight x body fat %</li>
            <li>
              <strong>Lean mass:</strong> weight x (1 - body fat %) (compare with the{" "}
              <a className="text-primary underline" href="/lean-body-mass-calculator">
                Lean Body Mass Calculator
              </a>
              )
            </li>
            <li><strong>FFMI:</strong> lean mass (kg) / height (m)^2</li>
            <li>
              <strong>BRI:</strong> roundness from waist-height geometry (compare with the{" "}
              <a className="text-primary underline" href="/bri-calculator">
                BRI Calculator
              </a>
              )
            </li>
            <li>
              <strong>BAI:</strong> adiposity estimate from hip and height (compare with the{" "}
              <a className="text-primary underline" href="/bai-calculator">
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
          <h2 className="text-3xl lg:text-4xl font-semibold">Best use cases and limitations</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Best use case: compare hypothetical scenarios, set realistic expectations, and communicate progress direction. This is especially
            useful when scale weight alone is noisy.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Limitation: no visualizer can exactly match your individual fat distribution, posture, lighting, or muscle insertions. Use this
            as a range-and-trend tool, then cross-check with repeated photos and consistent measurements.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            For scale-target planning and timeline estimates, pair this page with the{" "}
            <a className="text-primary underline" href="/weight-loss-calculator">
              Weight Loss Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/weight-loss-percentage-calculator">
              Weight Loss Percentage Calculator
            </a>
            .
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
            <a className="text-primary underline" href="/guides/bmi-vs-body-fat">
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

        <div className="mt-20 lg:mt-40 space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">Body Visualizer FAQ</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Common questions about body visualization, BMI, height, weight, and body-fat mass.
          </p>
          <div className="space-y-4">
            {VISUALIZER_FAQS.map((faq) => (
              <details key={faq.question} className="rounded-2xl border bg-white p-5">
                <summary className="cursor-pointer text-lg font-semibold text-gray-900">
                  {faq.question}
                </summary>
                <p className="mt-3 text-gray-700 text-lg leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            For more visual context, review{" "}
            <a className="text-primary underline" href="/guides/what-does-body-fat-percentage-look-like">
              body-fat percentage look examples
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/guides/why-body-fat-looks-different">
              why two people at the same body-fat % can look different
            </a>
            .
          </p>
        </div>

        <div className="mt-20 lg:mt-40 space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">References</h2>
          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2 break-words">
            <li>
              CDC overview of BMI context:
              <a href="https://www.cdc.gov/bmi/" className="text-primary underline ml-1">CDC BMI resource</a>
            </li>
            <li>
              Deurenberg BMI-to-body-fat relationship reference:
              <a href="https://pubmed.ncbi.nlm.nih.gov/2043597/" className="text-primary underline ml-1">Deurenberg et al. (PubMed)</a>
            </li>
            <li>
              FFMI reference context used across this project:
              <a href="https://pubmed.ncbi.nlm.nih.gov/7496846/" className="text-primary underline ml-1">Kouri et al. (PubMed)</a>
            </li>
            <li>
              MakeHuman + MPFB asset stack for the Phase 2 body model:
              <a href="https://github.com/makehumancommunity/makehuman-assets" className="text-primary underline ml-1">MakeHuman assets (CC0)</a>
              {" | "}
              <a href="https://static.makehumancommunity.org/mpfb/docs.html" className="text-primary underline">MPFB docs</a>
              {" | "}
              <a href="/models/body-visualizer/mpfb/asset-manifest.json" className="text-primary underline">Local asset manifest</a>
            </li>
            <li>
              3D mannequin model source:
              <a href="https://github.com/BoQsc/Godot-3D-Male-Base-Mesh" className="text-primary underline ml-1">Godot 3D Male Base Mesh</a>
              {" | "}
              <a href="/models/body-visualizer/LICENSE-BoQsc-Godot-3D-Male-Base-Mesh.txt" className="text-primary underline">Local license copy</a>
            </li>
            <li>
              Related guides:
              <a href="/guides/what-does-body-fat-percentage-look-like" className="text-primary underline ml-1">Visual body-fat examples</a>
              {" | "}
              <a href="/guides/how-to-track-body-fat-changes" className="text-primary underline">Tracking body-fat changes</a>
            </li>
          </ul>
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
