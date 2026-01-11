import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Body Fat Estimator AI",
  description:
    "Contact BodyFatEstimator.ai support. Questions about your AI body fat estimate, accuracy, pricing, refunds, or privacy? Email us and we’ll help.",
};

export default function ContactPage() {
  return (
    <main className="bg-base-100">
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-12">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Contact</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Questions about your AI body fat estimate, pricing, refunds, or privacy?
          Email us and we’ll get back to you as soon as we can.
        </p>

        <div className="mt-6 flex justify-center">
          <a
            href="mailto:matt@leandme.com"
            className="btn btn-primary text-white"
          >
            Email Support
          </a>
        </div>

      </section>

      {/* Support topics (SEO + reduces emails) */}
      <section className="mx-auto max-w-5xl px-6 pb-10 mt-24">
        <h2 className="text-2xl lg:text-3xl font-semibold text-center">
          Common support topics
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5">
            <h3 className="font-semibold">Accuracy tips</h3>
            <p className="mt-2 text-sm text-gray-600">
              Best results come from a well-lit, full-body photo facing the camera.
              Clothing, pose, and shadows can change a visual AI body fat estimate.
              Multiple photos usually improves consistency.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <h3 className="font-semibold">Privacy & photo handling</h3>
            <p className="mt-2 text-sm text-gray-600">
              Photos are processed to generate your estimate and are not sold or shared.
              We aim to minimize retention and delete data after processing whenever possible.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <h3 className="font-semibold">Billing & refunds</h3>
            <p className="mt-2 text-sm text-gray-600">
              If you purchased credits and something went wrong, email us with the
              receipt email and a quick description. We’ll make it right.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <h3 className="font-semibold">Upload issues</h3>
            <p className="mt-2 text-sm text-gray-600">
              If uploads fail, try a different image, reduce file size, or switch browsers.
              Full-body images (2:3 or 3:4) tend to work best.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <h3 className="font-semibold">Results changed</h3>
            <p className="mt-2 text-sm text-gray-600">
              Different lighting and angles can make you look leaner or softer.
              For tracking, use the same pose, distance, and lighting each time.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <h3 className="font-semibold">Partnerships</h3>
            <p className="mt-2 text-sm text-gray-600">
              Personal trainers, apps, or communities who want to collaborate can reach out
              via email with “Partnership” in the subject line.
            </p>
          </div>
        </div>
      </section>

      {/* Contact FAQ (keyword-rich but natural) */}
      <section className="mx-auto max-w-5xl px-6 pb-20 mt-20">
        <h2 className="text-2xl lg:text-3xl font-semibold text-center">
          Contact FAQs
        </h2>

        <div className="mt-8 space-y-3">
          <div className="collapse collapse-plus border rounded-xl bg-base-100">
            <input type="radio" name="contact-faq" defaultChecked />
            <div className="collapse-title text-lg font-medium">
              How do I get the most accurate AI body fat estimate?
            </div>
            <div className="collapse-content">
              <p className="text-gray-700">
                Use a clear, well-lit full-body photo facing the camera. Avoid harsh shadows,
                extreme angles, and baggy clothing. For best consistency, use the same setup
                each time and consider multiple photos.
              </p>
            </div>
          </div>

          <div className="collapse collapse-plus border rounded-xl bg-base-100">
            <input type="radio" name="contact-faq" />
            <div className="collapse-title text-lg font-medium">
              Why does my body fat estimate change between photos?
            </div>
            <div className="collapse-content">
              <p className="text-gray-700">
                This is a visual AI estimate. Lighting, pose, camera distance, and clothing can
                change visible body markers, which can shift the estimate.
              </p>
            </div>
          </div>

          <div className="collapse collapse-plus border rounded-xl bg-base-100">
            <input type="radio" name="contact-faq" />
            <div className="collapse-title text-lg font-medium">
              Are my photos stored or used for training?
            </div>
            <div className="collapse-content">
              <p className="text-gray-700">
                Photos are processed to generate your estimate. We don’t sell or share your data.
                We aim to minimize retention and delete data after processing whenever possible.
              </p>
            </div>
          </div>

          <div className="collapse collapse-plus border rounded-xl bg-base-100">
            <input type="radio" name="contact-faq" />
            <div className="collapse-title text-lg font-medium">
              What should I include in a support email?
            </div>
            <div className="collapse-content">
              <p className="text-gray-700">
                Include your receipt email (if applicable), what happened, and a screenshot if there’s an error.
                That usually lets us solve it in one reply.
              </p>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}
