import FaqJsonLd from "../helpers/faq-json-ld";

export default function FAQ() {

  const FAQ_ITEMS = [
    {
      q: "How does an AI body fat estimate work?",
      a: (
        <>
          Upload a clear full-body photo and our body fat AI analyzes visual cues like body
          shape, fat distribution, and proportions to estimate your body fat percentage. This is a
          visual body fat estimate (not a calculator using formulas), so lighting, pose, and
          clothing can affect results. For the best accuracy, use a front-facing photo in good lighting.
        </>
      ),
    },
    {
      q: "Is this an AI body fat calculator or a photo estimator?",
      a: (
        <>
          It’s a photo-based AI body fat estimator. Traditional “body fat calculators” usually
          estimate using formulas (like Navy measurements), while body fat AI estimates based on
          what your body looks like in the photo. If you want, you can use both: calculators are good for
          consistency; photo AI is great for visual reality-checks.
        </>
      ),
    },
    {
      q: "How accurate is the body fat AI?",
      a: (
        <>
          The body fat AI is designed to be directionally accurate for most people, especially
          when the photo is clear and consistent. It’s not medical-grade like DEXA, but it can be very useful
          for tracking trends over time. Accuracy improves when you upload better photos (and multiple photos
          if available).
        </>
      ),
    },
    {
      q: "How long does it take to get an estimate?",
      a: (
        <>
          Most AI body fat estimates are generated in under 20 seconds. If the image is very large
          or your connection is slow, it may take slightly longer.
        </>
      ),
    },
    {
      q: "What types of photos should I upload for best results?",
      a: (
        <>
          Use a well-lit, full-body photo facing the camera head-on. Minimal or better-fitting clothing
          (like underwear or swimwear) helps the AI see your shape more clearly. Avoid
          harsh shadows, extreme angles, flexing, or baggy shirts. Only one person per photo.
        </>
      ),
    },
    {
      q: "What is the best AI for body fat estimates?",
      a: (
        <>
          BodyFatEstimator.ai is designed to deliver accurate body fat estimates from photos using computer vision.
          For best results, use clear photos and consistent lighting, pose, and clothing.
        </>
      ),
    },
    {
      q: "Is there a free AI body fat estimator?",
      a: (
        <>
          Yes. BodyFatEstimator.ai offers a free AI body fat estimate using a single photo. This provides a quick,
          rough estimate.
          .
        </>
      ),
    },
    {
      q: "Why does my estimate change when I upload different photos?",
      a: (
        <>
          Because this is a visual estimate. Lighting, camera angle, distance, posture, and clothing can change
          how lean or soft you look in a single image — and the AI reacts to that.
          If you want stable tracking, use the same photo conditions each time.
        </>
      ),
    },
    {
      q: "What if my result seems wrong?",
      a: (
        <>
          Try again with a clearer photo: full-body, head-on, bright even lighting, neutral posture, and no baggy clothing.
          Use the estimate as a trend signal, not a medical diagnosis.
        </>
      ),
    },
    {
      q: "Does this work for men and women?",
      a: (
        <>
          Yes. The AI body fat estimator is designed to work across body types. Accuracy depends
          heavily on photo quality and consistency.
        </>
      ),
    },
    {
      q: "Is my data safe? Are my photos stored?",
      a: (
        <>
          Privacy matters. Your photos are processed securely to generate your estimate and
          are not sold or shared. We aim to minimize retention and delete data after processing whenever possible.
        </>
      ),
    },
    {
      q: "Can I use this to track progress over time?",
      a: (
        <>
          That’s the best use case. A single estimate can be noisy, but repeated estimates under the same conditions show
          real trends. Use the AI body fat estimate as a check-in every one to two weeks.
        </>
      ),
    },
    {
      q: "Is this free?",
      a: (
        <>
          You can start with a free estimate. If you want higher accuracy, multiple photos, and more check-ins for tracking,
          there’s an upgrade option.
        </>
      ),
    },
    {
      q: "I have another question…",
      a: (
        <>
          No worries — contact us via{" "}
          <a href="mailto:matt@leandme.com" className="text-primary">
            email
          </a>{" "}
          and we’ll get back to you.
        </>
      ),
    },
  ];

  return (
    <div id="faqs" className="hero mt-10 lg:mt-40 flex items-center justify-center bg-base-100">

      <div className="hero-content w-full px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mt-4">
            Frequently Asked Questions
          </h2>

          <p className="py-6 text-lg mb-6 text-center">
            Answers to common questions about our AI-powered body fat estimation tool.
          </p>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="collapse collapse-plus border bg-base-500 rounded-lg">
                <input type="radio" name="faq-accordion" />
                <div className="collapse-title text-lg lg:text-xl">{item.q}</div>
                <div className="collapse-content">
                  <p className="text-lg text-gray-700">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
