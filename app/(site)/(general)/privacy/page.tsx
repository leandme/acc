import { Metadata } from "next";
import H1 from "@/app/components/common/h1";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for BodyFatEstimator.ai. Learn what data we collect, how we use it, how photos are handled, and your privacy rights.",
};

export default function PrivacyPolicy() {
  return (
    <main className="bg-base-100">
      <section className="mx-auto max-w-3xl px-6 mt-10">
        <H1>Privacy Policy</H1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          This Privacy Policy explains how BodyFatEstimator.ai (“we”, “us”, or
          “our”) collects, uses, and protects information when you use our
          website and services (the “Service”).
        </p>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          The Service is intended for adults 18 and over. We do not knowingly
          collect personal data from children under 18.
        </p>

        <div className="mt-12 space-y-10">
          {/* 1. What we collect */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">1. Information We Collect</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              We collect only what’s needed to operate the Service. Depending on
              how you use the Service, we may collect:
            </p>

            <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-700 text-lg">
              <li>
                <strong>Inputs you provide</strong> — such as an uploaded photo
                and basic body measurements you enter (e.g., height/weight) in
                order to generate an estimate.
              </li>
              <li>
                <strong>Usage data</strong> — basic analytics about how the site
                is used (e.g., pages viewed, approximate device/browser info,
                events like button clicks) to improve reliability and user
                experience.
              </li>
              <li>
                <strong>Payment information</strong> — if you purchase a paid
                feature, payments are processed by Stripe. We do not receive or
                store your full payment card details.
              </li>
              <li>
                <strong>Support communications</strong> — if you email us, we’ll
                receive the information you include in your message.
              </li>
            </ul>
          </div>

          {/* 2. How we use it */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">2. How We Use Information</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              We use information to:
            </p>

            <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-700 text-lg">
              <li>Provide and operate the Service (generate your estimate).</li>
              <li>Maintain performance, reliability, and security.</li>
              <li>Understand usage and improve the product (minimal analytics).</li>
              <li>Process purchases and prevent fraud (via payment providers).</li>
              <li>Respond to support requests and communications.</li>
            </ul>
          </div>

          {/* 3. Photos */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">3. Photos & AI Processing</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Photos are used only to generate your body fat estimate. We do not
              sell your photos and do not use them for advertising.
            </p>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              We do <strong>not</strong> intend to permanently store uploaded
              photos as part of normal operation. Photos may be processed
              transiently by our infrastructure providers solely to produce the
              output you request.
            </p>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              We do not use your uploaded photos to train our own models, and we
              do not allow third-party providers to use your uploaded photos to
              train their models for their own purposes.
            </p>
          </div>

          {/* 4. Sharing */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">4. How We Share Information</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              We share information only with service providers (“sub-processors”)
              as needed to run the Service, and only for the purposes described
              in this policy. These providers may process limited data on our
              behalf, such as hosting, AI inference, analytics, and payments.
            </p>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Our sub-processors may include: Vercel (hosting), Cloudflare
              (security/CDN), Replicate (AI processing), Amplitude (analytics),
              Namecheap (domain services), and Stripe (payments). See our
              Sub-processors page for details.
            </p>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              We may also share information if required by law, to protect the
              rights and safety of users, or to prevent fraud and abuse.
            </p>
          </div>

          {/* 5. Cookies */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">5. Cookies & Tracking</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              We use a minimal set of cookies and similar technologies for core
              functionality, security, analytics, and service improvement. When
              advertising is enabled, approved ad and measurement partners may
              also use cookies or similar identifiers for ad delivery,
              frequency capping, fraud prevention, and campaign measurement.
              Where required by law, we request consent before setting
              non-essential cookies.
            </p>
          </div>

          {/* 6. Data retention */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">6. Data Retention</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              We retain information only as long as necessary to operate the
              Service, comply with legal obligations, resolve disputes, and
              enforce agreements.
            </p>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Uploaded photos are intended to be processed transiently and not
              stored long-term as part of normal operation.
            </p>
          </div>

          {/* 7. Security */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">7. Security</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              We use reasonable administrative, technical, and organizational
              safeguards designed to protect information. However, no method of
              transmission or storage is 100% secure.
            </p>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              For more detail, see our Security Policy page.
            </p>
          </div>

          {/* 8. Your rights */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">8. Your Rights</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Depending on where you live, you may have rights such as
              requesting access, correction, or deletion of certain personal
              data. You may also have the right to object to or restrict certain
              processing.
            </p>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              To make a request, contact us at the email below. We may need to
              verify your request before responding.
            </p>
          </div>

          {/* 9. International transfers */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">9. International Data Transfers</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Our service providers may process data in countries different from
              where you live (for example, the United States). Where required,
              we rely on appropriate safeguards for cross-border transfers.
            </p>
          </div>

          {/* 10. Changes */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">10. Changes to This Policy</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              We may update this Privacy Policy from time to time. The most
              current version will be posted on this page and reflected by the
              “Last updated” date below.
            </p>
          </div>

          {/* 11. Contact */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">11. Contact</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Questions about this Privacy Policy? Email{" "}
              <a
                className="underline text-primary"
                href="mailto:matt@leandme.com?subject=Privacy%20Policy%20Inquiry"
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
