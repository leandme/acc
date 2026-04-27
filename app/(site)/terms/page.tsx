import { Metadata } from "next";
import H1 from "@/app/components/common/h1";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms & Conditions",
  description: "Terms and conditions for using AI Calorie Counter, including acceptable use, disclaimers, and limitations of liability.",
  canonical: "https://ai-calorie-counter.com/terms",
});

export default function TermsPage() {
  return (
    <main className="bg-base-100">
      <section className="mx-auto max-w-3xl px-6 mt-10">
        <H1>Terms & Conditions</H1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          These Terms &amp; Conditions (“Terms”) govern your use of
          AI Calorie Counter (the “Service”). By accessing or using the Service,
          you agree to these Terms. If you do not agree, do not use the Service.
        </p>

        <div className="mt-12 space-y-10">
          {/* 1. The Service */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">1. The Service</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              AI Calorie Counter provides AI-powered calorie and meal-analysis
              estimates based on information you provide (such as uploaded food
              images and optional meal context). Outputs are estimates only and
              may be inaccurate.
            </p>
          </div>

          {/* 2. Not Medical Advice */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">2. Not Medical Advice</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              The Service is provided for informational and educational purposes
              only and does <strong>not</strong> provide medical advice,
              diagnosis, or treatment. Do not rely on the Service as a
              substitute for professional medical guidance. If you have concerns
              about your health, consult a qualified healthcare professional.
            </p>
          </div>

          {/* 3. Eligibility */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">3. Eligibility</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              You must be at least 18 years old to use the Service. The Service
              is intended only for adults and must not be used for children or
              minors.
            </p>
          </div>

          {/* 4. Your Responsibilities */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">4. Your Responsibilities</h2>

            <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-700 text-lg">
              <li>
                You represent that you have the right to upload any image you
                submit, and that it does not violate anyone’s privacy or
                intellectual property rights.
              </li>
              <li>
                You agree not to upload illegal content or content that is
                abusive, harassing, hateful, or otherwise harmful.
              </li>
              <li>
                You agree to use the Service for food and meal analysis only,
                and not for identifying or analyzing people.
              </li>
              <li>
                You agree not to misuse the Service (for example: attempting to
                probe, scan, disrupt, or reverse engineer the Service or its
                systems).
              </li>
              <li>
                You are responsible for how you interpret and use the outputs.
              </li>
            </ul>
          </div>

          {/* 5. Image Handling */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">5. Image Handling</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              The Service processes uploaded images to generate an estimate. We
              do not intend to permanently store uploaded images. Images may be
              processed transiently and handled by third-party infrastructure
              providers to deliver the Service (see our Sub-processors and
              Privacy Policy for details).
            </p>
          </div>

          {/* 6. Payments */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">6. Payments</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Some features may be offered for a fee. Payments are processed by
              a third-party payment provider. We do not store full payment card
              details. Prices, billing terms, and what you receive will be shown
              at checkout.
            </p>
          </div>

          {/* 7. Disclaimers */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">7. Disclaimers</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              The Service is provided on an “as is” and “as available” basis.
              We make no warranties of any kind, express or implied, including
              warranties of accuracy, reliability, fitness for a particular
              purpose, or non-infringement.
            </p>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              AI outputs can be wrong, incomplete, or misleading. You agree to
              use your judgment and not treat outputs as definitive.
            </p>
          </div>

          {/* 8. Limitation of Liability */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">8. Limitation of Liability</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              To the maximum extent permitted by law, AI Calorie Counter and
              its operators will not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or any loss of data,
              profits, or revenue, arising from or related to your use of (or
              inability to use) the Service.
            </p>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              To the maximum extent permitted by law, our total liability for
              any claim arising out of or relating to the Service will not
              exceed the amount you paid (if any) to use the Service in the 12
              months preceding the event giving rise to the claim.
            </p>
          </div>

          {/* 9. Termination */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">9. Termination</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              We may suspend or terminate access to the Service at any time if
              we believe you have violated these Terms, or to protect the
              security and integrity of the Service.
            </p>
          </div>

          {/* 10. Changes to Terms */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">10. Changes to Terms</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              We may update these Terms from time to time. Changes become
              effective when posted on this page. Continued use of the Service
              after changes means you accept the updated Terms.
            </p>
          </div>

          {/* 11. Contact */}
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-semibold">11. Contact</h2>

            <p className="mt-3 text-gray-700 text-lg leading-relaxed">
              Questions about these Terms? Email{" "}
              <a
                className="underline text-primary"
                href="mailto:matt@leandme.com?subject=Terms%20Inquiry"
              >
                matt@leandme.com
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-10 pb-10 text-left">
          <p className="text-sm text-gray-400">Last updated: 27/4/2026</p>
        </div>
      </section>
    </main>
  );
}
