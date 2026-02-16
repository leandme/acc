import { Metadata } from "next";
import H1 from "@/app/components/common/h1";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Cookie Policy",
  description: "Cookie policy for BodyFatEstimator.ai. Learn how we use cookies and similar technologies, and how you can control them.",
  canonical: "https://bodyfatestimator.ai/cookies",
});

export default function CookiesPage() {
  return (
    <main className="bg-base-100">
      <section className="mx-auto max-w-3xl px-6 mt-10">
        <H1>Cookie Policy</H1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          This Cookie Policy explains how BodyFatEstimator.ai (“we”, “us”, or
          “our”) uses cookies and similar technologies when you visit or use the
          Service.
        </p>

        <div className="mt-12 space-y-10">
          {/* 1. What are cookies */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">1. What Are Cookies?</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Cookies are small text files stored on your device when you visit a
              website. They help websites function properly, improve security,
              remember preferences, and understand how the site is used.
            </p>
          </div>

          {/* 2. How we use cookies */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">2. How We Use Cookies</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              BodyFatEstimator.ai uses a minimal set of cookies and similar
              technologies for the following purposes:
            </p>

            <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-700 text-lg">
              <li>
                <strong>Strictly necessary cookies</strong> — required for basic
                site functionality, security, and to deliver the Service.
              </li>
              <li>
                <strong>Analytics</strong> — limited, privacy-conscious analytics
                to understand how the site is used and improve performance and
                reliability.
              </li>
            </ul>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              We currently use Google Analytics and Amplitude. These services
              may use cookies or similar identifiers and may load automatically
              when you use the Service.
            </p>
          </div>

          {/* 3. Third-party cookies */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">3. Third-Party Cookies</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Some cookies or similar technologies may be set by trusted
              third-party service providers that help us operate the Service,
              such as analytics, security, and infrastructure providers.
            </p>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              These providers process limited information on our behalf and only
              for the purposes described in our Privacy Policy.
            </p>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              We do not currently run third-party display advertising cookies on
              the Service.
            </p>
          </div>

          {/* 4. Managing cookies */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">4. Managing Cookies</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              You can control or disable cookies through your browser settings.
              Most browsers allow you to delete existing cookies, block future
              cookies, or notify you before a cookie is stored.
            </p>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Please note that disabling strictly necessary cookies may affect
              the functionality of the Service.
            </p>
          </div>

          {/* 5. Changes */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">5. Changes to This Policy</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              We may update this Cookie Policy from time to time. The most recent
              version will always be available on this page and reflected by the
              “Last updated” date below.
            </p>
          </div>

          {/* 6. Contact */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">6. Contact</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Questions about this Cookie Policy? Contact us at{" "}
              <a
                href="mailto:matt@leandme.com?subject=Cookie%20Policy%20Inquiry"
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
