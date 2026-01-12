import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sub-processors | Body Fat Estimator AI",
  description:
    "Learn about the sub-processors used by BodyFatEstimator.ai, including hosting, AI processing, analytics, and payment providers.",
};

export default function SubProcessorsPage() {
  return (
    <main className="bg-base-100">
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-16">
        <h1 className="text-3xl lg:text-4xl font-bold text-center">
          Sub-processors
        </h1>

        <p className="mt-4 text-center text-lg  text-gray-700 max-w-2xl mx-auto">
          This page explains the third-party service providers (“sub-processors”)
          used by BodyFatEstimator.ai to deliver and support our services.
        </p>

        <div className="mt-12 space-y-10">
          {/* What is a sub-processor */}
          <div className="rounded-2xl bg-white p-6 border">
            <h2 className="text-2xl font-semibold">
              What is a Sub-processor?
            </h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              A sub-processor is a third-party data processor engaged by
              BodyFatEstimator.ai who may have limited access to data solely for
              the purpose of providing core functionality such as hosting, AI
              processing, analytics, or payment processing.
            </p>
          </div>

          {/* Due diligence */}
          <div className="rounded-2xl bg-white p-6 border">
            <h2 className="text-2xl font-semibold">
              Due Diligence & Safeguards
            </h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              BodyFatEstimator.ai evaluates the security, privacy, and
              confidentiality practices of each sub-processor before engagement.
              Where required, appropriate data protection agreements are in
              place.
            </p>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              This page is provided for transparency only and does not create
              additional rights or obligations beyond those described in our
              Terms of Service or Privacy Policy.
            </p>
          </div>

          {/* Infrastructure */}
          <div className="rounded-2xl bg-white p-6 border">
            <h2 className="text-2xl font-semibold">
              Infrastructure & Core Processing
            </h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              The following sub-processors are used to host, process, and deliver
              the Services:
            </p>

            <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-700 text-lg">
              <li>
                <strong>Vercel, Inc.</strong> — application hosting and deployment
                (United States)
              </li>
              <li>
                <strong>Replicate, Inc.</strong> — AI model inference and image
                processing (United States)
              </li>
              <li>
                <strong>Cloudflare, Inc.</strong> — content delivery and security
                (United States)
              </li>
              <li>
                <strong>Namecheap, Inc.</strong> — domain name services (United
                States)
              </li>
            </ul>
          </div>

          {/* Image handling */}
          <div className="rounded-2xl bg-white p-6 border">
            <h2 className="text-2xl font-semibold">
              Image Processing & Storage
            </h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              BodyFatEstimator.ai does <strong>not</strong> permanently store
              uploaded images.
            </p>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Images are processed temporarily for the sole purpose of generating
              a body fat estimate and are not retained after processing. We do
              not build user profiles, maintain image histories, or store photos
              long-term.
            </p>
          </div>

          {/* Analytics */}
          <div className="rounded-2xl bg-white p-6 border">
            <h2 className="text-2xl font-semibold">Analytics</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              We use minimal analytics to understand site usage and improve
              reliability.
            </p>

            <ul className="mt-4 list-disc pl-5 text-lg space-y-2 text-gray-700">
              <li>
                <strong>Amplitude, Inc.</strong> — product analytics (United
                States)
              </li>
            </ul>
          </div>

          {/* Payments */}
          <div className="rounded-2xl bg-white p-6 border">
            <h2 className="text-2xl font-semibold">Payment Processing</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Payments are securely handled by a third-party processor.
              BodyFatEstimator.ai does not store full payment card details.
            </p>

            <ul className="mt-4 list-disc pl-5 text-lg space-y-2 text-gray-700">
              <li>
                <strong>Stripe, Inc.</strong> — payment processing (United States)
              </li>
            </ul>
          </div>

          {/* Advertising & cookies */}
          <div className="rounded-2xl bg-white p-6 border">
            <h2 className="text-2xl font-semibold">
              Advertising, Email & Cookies
            </h2>

            <ul className="mt-4 list-disc pl-5 text-lg space-y-2 text-gray-700">
              <li>No third-party advertising platforms are used.</li>
              <li>No email marketing providers are used.</li>
              <li>
                No tracking or advertising cookies are used beyond those strictly
                necessary for basic site functionality.
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="rounded-2xl bg-white p-6 border">
            <h2 className="text-2xl font-semibold">Contact</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              If you have questions about this Sub-processors page or our data
              practices, contact us at{" "}
              <a
                className="underline text-primary"
                href="mailto:matt@leandme.com?subject=Sub-processors%20Inquiry"
              >
                matt@leandme.com
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-10 pb-10 text-left">
          <p className="text-sm text-gray-400">
            Last updated: January 2026
          </p>
        </div>
      </section>
    </main>
  );
}
