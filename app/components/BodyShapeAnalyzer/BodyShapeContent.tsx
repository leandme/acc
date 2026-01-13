export default function BodyShapeSEO() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16 text-base-content">
      <h2 className="text-2xl font-bold mb-2">AI Image Analysis Tool</h2>
      <p className="text-base-content/70 mb-6">
        Analyze your body shape from a photo and get a clear classification in seconds.
      </p>

      <p className="mb-6">
        Our Body Shape Analyzer uses AI vision to analyze your proportions from an image
        and classify your body shape into common categories such as Rectangle, Triangle
        (Pear), Inverted Triangle, Hourglass, or Oval. This can help with clothing choices,
        fit guidance, and understanding how garments typically sit on your frame.
      </p>

      <h3 className="text-xl font-semibold mt-10 mb-3">
        How the Body Shape Analyzer works
      </h3>
      <p className="mb-6">
        Upload a clear photo showing your full body, and our AI model analyzes visible
        proportions such as shoulder width, waist definition, and hip balance. Based on
        these signals, the system assigns the closest matching body shape category.
      </p>

      <h3 className="text-xl font-semibold mt-10 mb-3">
        What kind of images work best?
      </h3>
      <ul className="list-disc list-inside mb-6 text-base-content/80">
        <li>Well-lit images with minimal shadows</li>
        <li>Neutral, front-facing posture</li>
        <li>Fitted clothing that shows your natural shape</li>
        <li>JPG or PNG formats</li>
      </ul>

      <h3 className="text-xl font-semibold mt-10 mb-3">
        Frequently Asked Questions
      </h3>

      <p className="font-medium mt-4">What body shapes are supported?</p>
      <p className="text-base-content/80">
        The analyzer classifies body shapes such as Rectangle, Triangle (Pear),
        Inverted Triangle, Hourglass, and Oval.
      </p>

      <p className="font-medium mt-4">Can I analyze multiple images?</p>
      <p className="text-base-content/80">
        Yes. Each image is analyzed independently, and you can try multiple photos
        to compare results.
      </p>

      <p className="font-medium mt-4">How accurate is the analysis?</p>
      <p className="text-base-content/80">
        Results are based on visual cues from a single image and may vary depending
        on pose, clothing, and lighting. Multiple images can improve reliability.
      </p>
    </section>
  );
}
