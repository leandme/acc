export default function ToolExplainer() {
  return (
    <section className="mt-40">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
            AI Body Fat Estimation from Photos
          </h2>

          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            BodyFatEstimator.ai is an AI tool that analyzes photos of people and
            estimates their body fat percentage. Instead of relying on formulas or
            manual measurements, it uses computer vision to evaluate visible body
            composition,
            fat distribution, and proportions directly.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed">
            Upload a photo and receive a visual body fat estimate in seconds. Unlike
            traditional body fat calculators that use fixed formulas,{" "}
            <a
              href="/blog/how-ai-body-fat-estimation-works"
              className="text-primary underline"
            >
              how AI body fat estimation works
            </a>{" "}
            focuses on how your body looks, making it especially useful for
            tracking changes over time.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-3 sm:p-4 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.35)]">
          <img
            src="/examples/home-estimate-result.png"
            alt="AI body fat estimation result screenshot"
            className="w-full rounded-2xl border border-gray-100"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
