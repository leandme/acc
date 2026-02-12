import { Metadata } from "next";
import BodyFatVisualizerTool from "@/app/components/tools/composition/body-visualizer/visualizer";
import CTA from "@/app/components/common/cta";

// Body Visualizer – Shape, Mass, Weight, BMI & Fat %
export const metadata: Metadata = {
  title: "Body Fat Visualizer — See What Body Fat % Looks Like",
  description:
    "Use the body fat visualizer slider to see what different body fat percentages typically look like for men and women. Plus: tips on why photos vary and how to estimate more accurately.",
  alternates: {
    canonical: "https://bodyfatestimator.ai/body-visualizer",
  },
};

export default function BodyFatVisualizerPage() {
  return (
    <main className="bg-base-100">
      <section className={`mx-auto mt-4 mb-10 max-w-3xl px-6`}>

      <h1 className="text-4xl lg:text-5xl font-bold text-center">
        Body Fat Visualizer
      </h1>

    </section>

      {/* Tool */}
      <section className="mx-auto max-w-5xl px-6 pb-10">
        <BodyFatVisualizerTool />
      </section>

      {/* SEO content */}
      <section id="learn-more" className="mx-auto max-w-3xl px-6 pb-20 space-y-12">
        {/* H2 #1 */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            How to use a body fat visualizer (and not get fooled by photos)
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            A body fat visualizer is basically a calibration tool: it gives you a consistent set
            of reference images so your brain stops using “Instagram lean” as the default.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            The tricky part is that <strong>two people at the same body fat % can look very different</strong>.
            Muscle mass, frame size, and where you store fat (waist vs hips/thighs, upper vs lower body)
            all change the look. That’s why the slider shows ranges rather than pretending there’s a single
            perfect “20% body fat body.”
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            The result is an inference — not a measurement of fat tissue in your body.
          </p>
        </div>

        {/* H2 #2 */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            Why the same person can look “leaner” or “softer” in different pictures
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Photos are chaos goblins. Lighting, camera distance, and posture can exaggerate or hide definition
            dramatically. A close camera (wide angle), overhead lighting, or a relaxed posture can add apparent
            softness even if body composition didn’t change.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            The best way to compare visuals over time is to keep things boring: same lighting, same distance,
            same stance, same angles (front + side). Consistency beats “perfect” photos.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            The result is an inference — not a measurement of fat tissue in your body.
          </p>
        </div>

{/* 
        <References
          references={[
            { label: "How AI Body Fat Estimation Works", href: "/guides/how-ai-body-fat-estimation-works" },
            { label: "How Accurate Is AI Body Fat Estimation?", href: "/guides/how-accurate-is-ai-body-fat-estimation" },
            { label: "Why Body Fat Measurement Methods Give Different Results", href: "/guides/why-body-fat-measurements-give-different-results" },
          ]}
        />
*/}
        <CTA
        title="Want a Personalized Body Fat Estimate?"/>
      </section>
    </main>
  );
}
