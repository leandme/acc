import { Metadata } from "next";
import BodyVisualizerTool from "@/app/components/tools/composition/body-visualizer/visualizer";
import CTA from "@/app/components/common/cta";
import { MoreTools } from "@/app/components/tools/template/more-tools";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Body Visualizer – BMI, Body Fat & Weight",
  description: "Use an interactive Body Visualizer with linked or independent sliders for BMI, body fat percentage, height, and weight. See a dynamic body render and trend-focused composition metrics.",
  canonical: "https://bodyfatestimator.ai/body-visualizer",
});

export default function BodyVisualizerPage() {
  return (
    <main className="bg-base-100">
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

        <div className="mt-20 lg:mt-40">
          <CTA
            title="Want a personalized body fat estimate?"
            description="Upload a photo and get an appearance-based estimate you can track over time with consistent check-ins."
            buttonText="Try Body Fat Estimator →"
            href="/estimate"
          />
        </div>

        <div className="mt-20 lg:mt-40 space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">References</h2>
          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2 break-words">
            <li>
              CDC overview of BMI context:
              <a href="https://www.cdc.gov/bmi/" className="text-primary underline ml-1">CDC BMI resource</a>
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
