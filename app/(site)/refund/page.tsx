import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refunds | Body Fat Estimator AI",
  description:
    "Refund policy for BodyFatEstimator.ai. Learn about our 14-day money-back guarantee and how to request a refund.",
};

export default function RefundPage() {
  return (
    <main className="bg-base-100">
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-16">
        <h1 className="text-3xl lg:text-4xl font-bold text-center">
          Refunds
        </h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          We want you to feel good about trying BodyFatEstimator.ai. If you’re not
          satisfied with your results, you may be eligible for a refund under the
          terms below.
        </p>

        <div className="mt-12 space-y-10">
          {/* Guarantee */}
          <div className="rounded-2xl bg-white p-6 border">
            <h2 className="text-2xl font-semibold">
              14-Day Money-Back Guarantee
            </h2>

            <p className="mt-3 text-gray-700 leading-relaxed">
              The 14-Day Money-Back Guarantee applies if:
            </p>

            <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-700">
              <li>you purchased a paid plan or credit pack for the first time,</li>
              <li>the purchase was made within the last 14 days,</li>
              <li>
                you are not satisfied with the result quality and have no use for
                the estimates you generated,
              </li>
              <li>
                your account (and you personally) have not used this guarantee
                before.
              </li>
            </ul>

            <p className="mt-5 text-gray-700 leading-relaxed">
              To request a refund, email{" "}
              <a
                className="underline text-primary"
                href="mailto:matt@leandme.com?subject=Refund%20Request"
              >
                matt@leandme.com
              </a>{" "}
              with the subject line <span className="font-medium">Refund Request</span>.
              Include the email used at checkout and a short explanation of what went
              wrong. We’ll review your request and respond by email.
            </p>

            <p className="mt-3 text-sm text-gray-500">
              We aim to review refund requests within 3 days.
            </p>
          </div>

          {/* Other refunds */}
          <div className="rounded-2xl bg-white p-6 border">
            <h2 className="text-2xl font-semibold">Other Refunds</h2>

            <p className="mt-3 text-gray-700 leading-relaxed">
              Purchases outside of the 14-Day Money-Back Guarantee are generally
              non-refundable. If you’re unhappy, contact us and we’ll do our best
              to help troubleshoot photo quality or explain your results.
            </p>

            <p className="mt-4 text-gray-700 leading-relaxed">
              For billing errors or technical issues, email{" "}
              <a
                className="underline text-primary"
                href="mailto:matt@leandme.com?subject=Billing%20Help"
              >
                matt@leandme.com
              </a>
              .
            </p>
          </div>

          {/* Notes */}
          <div className="rounded-2xl bg-white p-6 border">
            <h2 className="text-2xl font-semibold">Important Notes</h2>

            <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-700">
              <li>
                Estimates are visual AI-based approximations and may vary with
                lighting, pose, and image quality.
              </li>
              <li>
                Consistent photos (same setup each time) improve accuracy.
              </li>
              <li>
                Approved refunds are returned to the original payment method.
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pb-10 text-left">
          <p className="text-sm text-gray-400">
            Last updated: 11/01/2026
          </p>
        </div>
      </section>
    </main>
  );
}
