import { Metadata } from "next";
import H1 from "@/app/components/common/h1";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Sub-processors",
  description: "Learn about the sub-processors used by AI Calorie Counter, including hosting, AI processing, analytics, and payment providers.",
  canonical: "https://aicaloriecounter.ai/subprocessors",
});

export default function SubProcessorsPage() {
  return (
    <main className="bg-base-100">
      <section className="mx-auto max-w-3xl px-6 mt-10">
        <H1>Sub-processors</H1>

        <p className="mt-4 text-center text-lg  text-gray-700 max-w-2xl mx-auto">
          This page explains the third-party service providers (“sub-processors”)
          used by AI Calorie Counter to deliver and support our services.
        </p>

        <div className="mt-12 space-y-10">
          {/* What is a sub-processor */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">
              What is a Sub-processor?
            </h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              A sub-processor is a third-party data processor engaged by
              AI Calorie Counter who may have limited access to data solely for
              the purpose of providing core functionality such as hosting, AI
              processing, analytics, or payment processing.
            </p>
          </div>

          {/* Due diligence */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">
              Due Diligence & Safeguards
            </h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              AI Calorie Counter evaluates the security, privacy, and
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
          <div className="rounded-2xl bg-white p-6">
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
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">
              Image Processing & Storage
            </h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              AI Calorie Counter does not intentionally maintain a long-term
              archive of uploaded images.
            </p>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Images are processed to generate a body fat estimate. Temporary
              copies may exist in provider systems for processing, reliability,
              security, and abuse-prevention purposes. We do not build
              long-term user photo histories inside the product.
            </p>
          </div>

          {/* Analytics & engagement */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">Analytics & Audience Engagement</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              We use analytics and audience engagement tooling to understand site
              usage, improve reliability, and support on-site engagement
              features.
            </p>

            <ul className="mt-4 list-disc pl-5 text-lg space-y-2 text-gray-700">
              <li>
                <strong>Google LLC</strong> — Google Analytics and tagging
                infrastructure (United States)
              </li>
              <li>
                <strong>Amplitude, Inc.</strong> — product analytics (United
                States)
              </li>
              <li>
                <strong>Mediavine, Inc. (Grow)</strong> — audience engagement
                features and related measurement (United States)
              </li>
            </ul>
          </div>

          {/* Payments */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">Payment Processing</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Payments are securely handled by a third-party processor.
              AI Calorie Counter does not store full payment card details.
            </p>

            <ul className="mt-4 list-disc pl-5 text-lg space-y-2 text-gray-700">
              <li>
                <strong>Stripe, Inc.</strong> — payment processing (United States)
              </li>
            </ul>
          </div>

          {/* Advertising & cookies */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">
              Advertising & Cookies
            </h2>

            <ul className="mt-4 list-disc pl-5 text-lg space-y-2 text-gray-700">
              <li>
                We do not currently use third-party display advertising
                networks and do not currently serve display ads.
              </li>
              <li>
                We do not use Ezoic.
              </li>
              <li>
                Analytics cookies or similar identifiers are currently used by
                Google Analytics and Amplitude. Engagement cookies or similar
                identifiers may also be used by Mediavine Grow.
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="rounded-2xl bg-white p-6">
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
            Last updated: April 2026
          </p>
        </div>
      </section>
    </main>
  );
}
