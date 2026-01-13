export default function PricingFAQ() {
  const FAQ_ITEMS = [
    {
      q: "Which plan should I choose?",
      a: (
        <>
          Use Free to try it once. Choose Accurate Estimate if you want higher-confidence
          results and want to track changes over time.
        </>
      ),
    },
    {
      q: "What’s the difference between Free and Single Accurate Estimate?",
      a: (
        <>
          Free is a quick rough check. Single Accurate Estimate uses a more careful analysis
          and includes the money-back guarantee.
        </>
      ),
    },
    {
      q: "Are my photos safe?",
      a: (
        <>
          Yes. Your photos are processed securely and are never shared, sold, or used for
          training public AI models. Photos are only used to generate your body fat estimate
          and are deleted automatically after processing.
        </>
      ),
    },
    {
      q: "How do credits/estimates work?",
      a: (
        <>
          1 estimate = 1 photo analyzed. Bundles give you multiple estimates so you can check
          in repeatedly without paying each time.
        </>
      ),
    },
    {
      q: "Do my estimates expire?",
      a: <>No — unused estimates don’t expire. Use them whenever you want.</>,
    },
    {
      q: "How accurate is this?",
      a: (
        <>
          It’s a visual estimate (not medical-grade), but it’s designed to be consistent.
          For best results: full-body photo, front-facing, good lighting, minimal/better-fitting
          clothing, and the same pose each time.
        </>
      ),
    },
    {
      q: "Can I get a refund if I’m not satisfied?",
      a: (
        <>
          Yes. If you’re unhappy with the result, email us within 7 days of purchase for a
          full refund.
        </>
      ),
    },
    {
      q: "What payment methods do you support?",
      a: (
        <>
          We support major credit cards, Apple Pay, and other Stripe-supported payment methods.
        </>
      ),
    },
    {
      q: "What do you do with my photos?",
      a: (
        <>
          Photos are used only to generate your estimate. We don’t sell your data. See our{" "}
          <a className="link" href="/privacy">
            Privacy Policy
          </a>{" "}
          for details.
        </>
      ),
    },
  ];

  return (
    <div
      id="faq"
      className="hero mt-10 mb-20 flex items-center justify-center bg-base-100"
    >
      <div className="hero-content w-full px-4">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <div className="flex justify-center mb-4">
            <p className="text-xs lg:text-sm text-center text-gray-600 px-4 py-2 rounded-full">
              🔒 Your photos are private and used only to generate your estimate
            </p>
          </div>

          <h2 className="text-2xl lg:text-4xl text-center font-bold">
            Frequently Asked Questions
          </h2>
          <p className="py-6 text-lg mb-6 text-center">
            Answers to common questions about our AI body fat estimates for individuals and personal trainers.
          </p>

          {/* FAQ Items */}
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="collapse collapse-plus border rounded-lg"
              >
                <input
                  type="radio"
                  name="pricing-faq-accordion"
                />
                <div className="collapse-title text-lg lg:text-xl">
                  {item.q}
                </div>
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
