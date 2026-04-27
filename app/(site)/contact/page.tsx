import { Metadata } from "next";
import H1 from "@/app/components/common/h1";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: "Contact AI Calorie Counter support. Questions about calorie estimates, food recognition, scan quality, privacy, or refunds? Email us and we’ll help.",
  canonical: "https://ai-calorie-counter.com/contact",
});

export default function ContactPage() {
  return (
    <main className="bg-base-100">
      <section className="mx-auto max-w-5xl px-6 mt-10">
        <H1>Contact</H1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Questions about your calorie estimate, food recognition results, pricing, refunds, or privacy?
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
              How do I get the most accurate calorie estimate?
            </div>
            <div className="collapse-content">
              <p className="text-gray-700">
                Use a clear food photo with the full plate visible in bright, even lighting.
                Include sides, sauces, and drinks. Keep angle and distance consistent if you are
                comparing meals over time.
              </p>
            </div>
          </div>

          <div className="collapse collapse-plus border rounded-xl bg-base-100">
            <input type="radio" name="contact-faq" />
            <div className="collapse-title text-lg font-medium">
              Why can results change between similar food photos?
            </div>
            <div className="collapse-content">
              <p className="text-gray-700">
                Small changes in angle, lighting, hidden ingredients, and portion visibility can
                shift the estimate. This tool is directional and works best with consistent photo setup.
              </p>
            </div>
          </div>

          <div className="collapse collapse-plus border rounded-xl bg-base-100">
            <input type="radio" name="contact-faq" />
            <div className="collapse-title text-lg font-medium">
              Are my food photos stored or sold?
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
                Include what happened, the device/browser used, and a screenshot if there is an
                error. If it is billing-related, include your receipt email so we can resolve it faster.
              </p>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}
