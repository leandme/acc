import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security | Body Fat Estimator AI",
  description:
    "Learn how BodyFatEstimator.ai protects your data. We use secure infrastructure, minimal data handling, and trusted providers to keep your information safe.",
};

export default function SecurityPage() {
  return (
    <main className="bg-base-100">
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-16">
        <h1 className="text-3xl lg:text-4xl font-bold text-center">
          Security Policy
        </h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Protecting your data is important to us. This page explains how
          BodyFatEstimator.ai approaches security, data handling, and infrastructure.
        </p>

        <div className="mt-12 space-y-10">
          {/* Overview */}
          <div className="rounded-2xl bg-white p-6 border">
            <h2 className="text-2xl font-semibold">Overview</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              BodyFatEstimator.ai is designed with a minimal-data philosophy.
              We only process the information required to generate your AI-based
              body fat estimate and aim to avoid storing personal data whenever possible.
            </p>
          </div>

          {/* Infrastructure */}
          <div className="rounded-2xl bg-white p-6 border">
            <h2 className="text-2xl font-semibold">Infrastructure & Hosting</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              Our application is hosted using reputable cloud providers with
              industry-standard security practices:
            </p>

            <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-700">
              <li>
                <strong>Vercel</strong> — application hosting and deployment
              </li>
              <li>
                <strong>Replicate</strong> — AI model inference for image processing
              </li>
              <li>
                <strong>Namecheap</strong> — domain registration and DNS
              </li>
              <li>
                <strong>Amplitude</strong> — privacy-conscious product analytics
              </li>
            </ul>
          </div>

          {/* Data Handling */}
          <div className="rounded-2xl bg-white p-6 border">
            <h2 className="text-2xl font-semibold">Data Handling & Photos</h2>

            <p className="mt-3 text-gray-700 leading-relaxed">
              Uploaded photos are processed solely to generate your body fat estimate.
              We do not sell photos, use them for advertising, or use them to train
              third-party AI models.
            </p>

            <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-700">
              <li>Photos are processed transiently for estimation purposes</li>
              <li>No long-term photo storage is performed by default</li>
              <li>No advertising or tracking cookies are used</li>
              <li>No third-party ads are run on the site</li>
            </ul>
          </div>

          {/* Payments */}
          <div className="rounded-2xl bg-white p-6 border">
            <h2 className="text-2xl font-semibold">Payment Security</h2>

            <p className="mt-3 text-gray-700 leading-relaxed">
              All payments are processed securely by <strong>Stripe</strong>.
              BodyFatEstimator.ai does not store or have access to your full
              payment card details.
            </p>
          </div>

          {/* Transport Security */}
          <div className="rounded-2xl bg-white p-6 border">
            <h2 className="text-2xl font-semibold">Transport Security</h2>

            <p className="mt-3 text-gray-700 leading-relaxed">
              All traffic to and from BodyFatEstimator.ai is encrypted using HTTPS.
              Data is transmitted using secure, industry-standard TLS encryption
              provided by our hosting partners.
            </p>
          </div>

          {/* User Responsibility */}
          <div className="rounded-2xl bg-white p-6 border">
            <h2 className="text-2xl font-semibold">User Responsibilities</h2>

            <p className="mt-3 text-gray-700 leading-relaxed">
              Users are responsible for maintaining the security of their own
              devices, email accounts, and access links. If you believe your
              access has been compromised, please contact us immediately.
            </p>
          </div>

          {/* Contact */}
          <div className="rounded-2xl bg-white p-6 border">
            <h2 className="text-2xl font-semibold">Security Contact</h2>

            <p className="mt-3 text-gray-700 leading-relaxed">
              If you have security-related questions or believe you’ve discovered
              a vulnerability, please contact us at{" "}
              <a
                href="mailto:matt@leandme.com?subject=Security%20Inquiry"
                className="underline text-primary"
              >
                matt@leandme.com
              </a>.
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
