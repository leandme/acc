import { Metadata } from "next";
import H1 from "@/app/components/common/h1";
import { buildPageMetadata } from "@/app/libs/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Body Fat % Examples – What Body Fat % Looks Like",
  description: "Explore body fat examples generated from photos. See what different body fat % ranges tend to look like, why the same % can look different, and try a free AI estimate from your own photo.",
  canonical: "https://bodyfatestimator.ai/examples",
});

const images = [
  "/examples/boy-selfie.png",
  "/examples/man-bf.png",
  "/examples/boy-bf.png",
  "/examples/woman-selfie.png",
  "/examples/bfe-example1.png",
  "/examples/man-selfie.png",
  "/examples/bfe-example3.png",
  "/examples/bfe-example4.png",
];

const faqs = [
  {
    question: "What are “body fat examples”?",
    answer:
      "Body fat examples are visual reference photos that help you understand what different body fat percentages tend to look like. They’re best used to identify a likely range and track changes over time—not as an exact measurement.",
  },
  {
    question: "Why do two people at the same body fat % look different?",
    answer:
      "Muscle mass, fat distribution, height/frame size, posture, and lighting can change appearance dramatically. That’s why visual examples work best as ranges and patterns rather than one-to-one matches.",
  },
  {
    question: "Can I estimate my body fat % from a photo?",
    answer:
      "Yes—photo-based estimation can be directionally accurate for many people, especially when you use a consistent setup and track trends over time. Treat it as “range + trend,” not a single perfect number.",
  },
  {
    question: "How should I compare myself to these examples?",
    answer:
      "Compare overall silhouette and fat distribution (waist, hips, arms, legs), not details like shadows or definition. Use consistent lighting and distance, and check every 1–2 weeks to avoid noise.",
  },
];

export default function ExamplesPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="hero min-h-screen flex items-center justify-center mt-10">
        <div className="flex flex-col items-center gap-6 w-full">
          <H1>Body Fat % Examples</H1>

          <p className="py-2 text-lg max-w-3xl text-center text-gray-700">
            These are body fat percentage examples generated from photos.
            Use them to get visual context for common ranges and to estimate your own body
            fat more realistically.
          </p>

          <a href="/estimate">
            <button className="btn btn-primary btn-lg text-white">
              Get Your Free Estimate →
            </button>
          </a>

          {/* Image grid */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 mb-16 px-6 max-w-6xl w-full">
            {images.map((src, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl bg-base-200 shadow"
              >
                {/* Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="rounded-full bg-green-600 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">
                    EXAMPLE
                  </span>
                </div>

                {/* Image */}
                <div className="aspect-[3/4]">
                  <img
                    src={src}
                    alt="Body fat example photo with AI-estimated body fat percentage"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* SEO / Ad-friendly content block */}
          <section className="w-full bg-base-100">
            <div className="mx-auto max-w-4xl px-6 pb-20 space-y-10">
              {/* What these examples mean */}
              <div className="rounded-2xl border bg-white p-6 md:p-8">
                <h2 className="text-2xl lg:text-3xl font-semibold">
                  What these body fat examples actually show
                </h2>

                <p className="mt-3 text-gray-700 text-lg leading-relaxed">
                  Body fat percentage is a useful way to describe{" "}
                  <strong>how lean or soft someone tends to look</strong>, but it’s not a
                  perfect number. These body fat examples are meant to give you{" "}
                  <strong>visual reference points</strong> for common ranges so you can
                  estimate more realistically—and track progress over time without guessing.
                </p>

                <p className="mt-4 text-gray-700 text-lg leading-relaxed">
                  The best mindset is: <strong>range + trend</strong>. Photos can make you
                  look leaner or softer depending on lighting, posture, camera distance, and
                  clothing—without any real body composition change.
                </p>
              </div>

              {/* How to compare */}
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-semibold">
                  How to compare yourself to body fat examples
                </h2>

                <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
                  <li>
                    Compare <strong>overall silhouette</strong> (waist/hips/torso shape), not
                    tiny details like ab shadows.
                  </li>
                  <li>
                    Look for <strong>fat distribution patterns</strong> (where softness shows up first).
                  </li>
                  <li>
                    Use examples as <strong>ranges</strong>—don’t try to find your “exact twin.”
                  </li>
                  <li>
                    If you’re tracking progress, take photos in the{" "}
                    <strong>same lighting and distance</strong> each time.
                  </li>
                </ul>

                <p className="text-gray-700 text-lg leading-relaxed">
                  For a simple setup, follow:{" "}
                  <a
                    href="/guides/how-to-take-photos-for-body-fat-estimation"
                    className="text-primary underline"
                  >
                    how to take photos for body fat estimation
                  </a>
                  .
                </p>
              </div>

              {/* Why the same % looks different */}
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-semibold">
                  Why the same body fat % can look totally different
                </h2>

                <p className="text-gray-700 text-lg leading-relaxed">
                  Two people can be “the same %” and look wildly different. The biggest
                  reasons are <strong>muscle mass</strong>, <strong>frame size</strong>, and{" "}
                  <strong>fat distribution</strong>. That’s why visual examples are best used as
                  orientation—helping you narrow down a likely range.
                </p>

                <p className="text-gray-700 text-lg leading-relaxed">
                  Deep dive here:{" "}
                  <a
                    href="/guides/why-body-fat-looks-different"
                    className="text-primary underline"
                  >
                    why two people at the same body fat % look different
                  </a>
                  .
                </p>
              </div>

              {/* CTA */}
              <div className="rounded-2xl border bg-white p-6 md:p-8">
                <h3 className="text-xl lg:text-2xl font-semibold">
                  Want a body fat estimate from your own photo?
                </h3>

                <p className="mt-2 text-gray-700 text-lg leading-relaxed">
                  Try the free AI body fat estimator to get a quick visual estimate and use
                  it for repeatable check-ins over time.
                </p>

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <a
                    href="/estimate"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-white font-semibold hover:opacity-90 transition"
                  >
                    Estimate from a photo →
                  </a>

                  <a
                    href="/guides/how-to-estimate-body-fat-percentage"
                    className="inline-flex items-center justify-center rounded-full border px-6 py-3 font-semibold text-gray-900 hover:bg-base-200 transition"
                  >
                    Learn the methods →
                  </a>
                </div>
              </div>

              {/* FAQ */}
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-semibold">FAQ</h2>

                <div className="space-y-4">
                  {faqs.map((f) => (
                    <details key={f.question} className="rounded-2xl border bg-white p-5">
                      <summary className="cursor-pointer text-lg font-semibold text-gray-900">
                        {f.question}
                      </summary>
                      <p className="mt-3 text-gray-700 text-lg leading-relaxed">
                        {f.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
