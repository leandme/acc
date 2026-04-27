export default function SEOExplainer() {
  return (
    <section className="mt-40">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Visual */}
        <div className="relative rounded-2xl border h-80 flex items-center justify-center overflow-hidden">
          <img
            src="/blog/best-body-fat-estimator.webp"
            alt="AI body fat estimation example showing photo input and estimated body fat percentage"
            className="rounded-xl shadow-sm"
            loading="lazy"
          />
        </div>

        {/* Text content */}
        <div>
          <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
            A Better Way to Understand Body Fat Progress
          </h2>

          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            AI Calorie Counter is designed for one simple goal: helping you understand
            whether what you’re doing is actually changing how your body looks.
          </p>

          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            Instead of relying on a scale or a formula-based{" "}
            <strong>body fat calculator</strong>, this tool uses AI to analyze photos and
            estimate body fat based on visible body composition — how fat is distributed,
            how proportions change, and how shape evolves over time.
          </p>

          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            This makes it especially useful for:
          </p>

          <ul className="list-disc pl-6 text-lg text-gray-700 mb-4 space-y-2">
            <li>Tracking fat loss or recomposition week to week</li>
            <li>Understanding progress when the scale doesn’t move</li>
            <li>Comparing before-and-after photos with context</li>
            <li>Checking whether training or diet changes are working</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
