export default function ToolExplainer() {
  return (
    <section className="mt-40">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text content */}
        <div>
          <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
            AI Body Fat Estimation from Photos
            </h2>

            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            BodyFatEstimator.ai is an AI body fat estimator that analyzes photos to
            estimate body fat percentage. Instead of relying on formulas or manual
            measurements, it uses computer vision to evaluate visible body composition,
            fat distribution, and proportions directly.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
            Upload a photo and receive a visual body fat estimate in seconds.
            Unlike traditional body fat calculators that use fixed formulas, AI body fat
            estimation focuses on how your body actually looks, making it especially
            useful for tracking changes over time.
            </p>

        </div>

        {/* Visual / placeholder */}
        <div className="relative rounded-2xl border h-80 flex items-center justify-center overflow-hidden">
          {/* Replace this with screenshots / estimator output / before-after */}
          <img
        src="/examples/body-fat-estimate-example.png"
        alt="AI body fat estimation example showing photo input and estimated body fat percentage"
        className="rounded-xl shadow-sm"
        loading="lazy"
    />
        </div>
      </div>
    </section>
  );
}
