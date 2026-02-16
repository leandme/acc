import { Metadata } from "next";
import H1 from "@/app/components/common/h1";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Security Policy",
  description: "Learn how BodyFatEstimator.ai protects your data using secure infrastructure, minimal data handling, and trusted providers.",
  canonical: "https://bodyfatestimator.ai/security",
});

export default function SecurityPage() {
  return (
    <main className="bg-base-100">
      <section className="mx-auto max-w-3xl px-6 mt-10">
        <H1>Security Policy</H1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Protecting your data matters. This page summarizes how
          BodyFatEstimator.ai approaches security, data handling, and third-party
          infrastructure used to deliver the Service.
        </p>

        <div className="mt-12 space-y-10">
          {/* Overview */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">Overview</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              BodyFatEstimator.ai is built with a minimal-data philosophy. We
              aim to process only what’s needed to generate your body fat
              estimate and avoid retaining sensitive data (like uploaded photos)
              beyond what’s required to provide the Service.
            </p>
          </div>

          {/* Infrastructure */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">Infrastructure & Providers</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              We rely on reputable providers for hosting, delivery, AI
              processing, analytics, and payments:
            </p>

            <ul className="mt-4 list-disc pl-5 text-gray-700 text-lg space-y-2">
              <li>
                <strong>Vercel, Inc.</strong> — application hosting and deployment
              </li>
              <li>
                <strong>Replicate, Inc.</strong> — AI model inference and image
                processing
              </li>
              <li>
                <strong>Cloudflare, Inc.</strong> — security and content delivery
              </li>
              <li>
                <strong>Namecheap, Inc.</strong> — domain services and DNS
              </li>
              <li>
                <strong>Google LLC</strong> — web analytics and tagging
              </li>
              <li>
                <strong>Amplitude, Inc.</strong> — product analytics
              </li>
              <li>
                <strong>Stripe, Inc.</strong> — payment processing
              </li>
            </ul>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              For more detail on vendors and processing roles, see our
              Sub-processors page and Privacy Policy.
            </p>
          </div>

          {/* Data Handling */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">Data Handling & Photos</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Uploaded photos are processed only to generate your body fat
              estimate. We do not sell photos or use them for advertising.
              We do not use uploaded photos to train our own models.
            </p>

            <ul className="mt-4 list-disc pl-5 text-gray-700 text-lg space-y-2">
              <li>
                Photos are processed for estimation purposes through third-party
                infrastructure.
              </li>
              <li>
                We do not intentionally maintain long-term photo archives inside
                the product.
              </li>
              <li>
                Temporary copies may exist in provider systems for reliability,
                security, and abuse prevention.
              </li>
              <li>
                Analytics currently use Google Analytics and Amplitude
                (including session replay) to understand usage and improve
                reliability.
              </li>
            </ul>
          </div>

          {/* Transport Security */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">Transport Security</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Traffic to and from BodyFatEstimator.ai is encrypted using HTTPS
              (TLS). This helps protect data in transit between your browser and
              our infrastructure providers.
            </p>
          </div>

          {/* Access Controls */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">Access Controls</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              We limit access to systems and data to what’s necessary to operate
              and maintain the Service. Administrative access is restricted and
              used for support, reliability, and security purposes.
            </p>
          </div>

          {/* Payment Security */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">Payment Security</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Payments are processed by <strong>Stripe</strong>. We do not store
              or have access to your full payment card details. Any payment
              details you provide are handled directly by Stripe’s systems.
            </p>
          </div>

          {/* Responsible Disclosure */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">Responsible Disclosure</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              If you believe you’ve found a security vulnerability, please
              report it privately and give us a reasonable amount of time to
              investigate and remediate before public disclosure. Please do not
              access or modify data that does not belong to you.
            </p>
          </div>

          {/* User Responsibilities */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">User Responsibilities</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              You are responsible for maintaining the security of your own
              devices, browser, and email account. If you believe your access
              has been compromised or you notice suspicious behavior, contact us
              immediately.
            </p>
          </div>

          {/* Contact */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">Security Contact</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Security questions or vulnerability reports can be sent to{" "}
              <a
                href="mailto:matt@leandme.com?subject=Security%20Inquiry"
                className="underline text-primary"
              >
                matt@leandme.com
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-10 pb-10 text-left">
          <p className="text-sm text-gray-400">Last updated: 16/2/2026</p>
        </div>
      </section>
    </main>
  );
}
