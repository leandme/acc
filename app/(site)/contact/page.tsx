import { Metadata } from "next";
import H1 from "@/app/components/common/h1";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: "Contact AI Calorie Counter support. Questions about your AI body fat estimate, accuracy, pricing, refunds, or privacy? Email us and we’ll help.",
  canonical: "https://ai-calorie-counter.com/contact",
});

export default function ContactPage() {
  return (
    <main className="bg-base-100">
      <section className="mx-auto max-w-5xl px-6 mt-10">
        <H1>Contact</H1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Questions about your AI body fat estimate, pricing, refunds, or privacy?
          Email us and we’ll get back to you as soon as we can.
        </p>

        <div className="mt-6 flex justify-center">
          <a
            href="mailto:matt@leandme.com"
            className="btn btn-primary btn-lg text-white"
          >
            Email Support
          </a>
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
                Photos are processed to generate your estimate. We do not sell
                your photos. Processing may involve trusted infrastructure
                providers, and we aim to minimize retention wherever possible.
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
