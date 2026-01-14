import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Estimate Your Body Fat % at Home (Methods + Accuracy)",
  description:
    "A practical guide to estimating body fat at home: tape measurements, skinfolds, smart scales, visual comparisons, and AI photo estimation — plus what to trust and how to stay consistent.",
};

const faqs = [
  {
    question: "What’s the most accurate way to measure body fat at home?",
    answer:
      "No at-home method is perfectly accurate. For most people, the best approach is the one you can repeat consistently. Tape measurements and AI photo estimates tend to be more useful for tracking trends over time than one-off precision.",
  },
  {
    question: "Why do different body fat methods give different results?",
    answer:
      "Because they measure different signals. Some use formulas and population averages, others infer body composition from circumference, electrical impedance, or visual cues. Hydration, timing, measurement technique, lighting, posture, and muscle mass can shift results.",
  },
  {
    question: "Are body fat calculators accurate?",
    answer:
      "They can be directionally useful, but they often miss important factors like muscle mass and fat distribution. They’re best treated as a rough estimate—not a definitive number.",
  },
  {
    question: "How can I get more consistent body fat estimates from photos?",
    answer:
      "Use the same setup every time: similar lighting, camera distance/height, pose, and minimal loose clothing. Consistency matters more than perfection.",
  },
];

export default function BlogPostPage() {
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
    <main className="bg-base-100">
      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-12">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">
          How to Estimate Your Body Fat % at Home
        </h1>

        <p className="mt-6 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          You don’t need a lab scan to estimate body fat. The real challenge is
          choosing a method you can repeat reliably—and understanding why two
          methods can disagree without either being “broken.”
        </p>

        {/* Primary CTA */}
        <div className="mt-8 flex justify-center">
          <a
            href="/estimate"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-white font-semibold hover:opacity-90 transition"
          >
            Estimate your body fat from a photo
          </a>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Tip: if your goal is progress tracking,{" "}
          <strong>consistency beats precision</strong>.
        </p>
      </section>

      {/* Image section */}
      <section className="mx-auto max-w-5xl px-6 pb-6">
        <figure className="overflow-hidden rounded-2xl border bg-white">
          <div className="w-full aspect-[2/1] bg-base-200">
            <img
              src="/blog/how-to-calculate-your-body-fat-percentage-at-home.png"
              alt="Body fat percentage methods comparison"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <figcaption className="px-5 py-4 text-lg text-gray-600">
            At-home body fat methods range from formulas and measurements to
            visual estimates and AI photo analysis—each with different tradeoffs.
          </figcaption>
        </figure>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-6 pb-20 space-y-12">
        {/* Intro */}
        <div className="space-y-4">
          <p className="text-gray-700 text-lg leading-relaxed">
            Body fat percentage helps you understand what the scale can’t:
            roughly how much of your body is fat versus lean mass (muscle, bone,
            organs, water). If you’re trying to look leaner, get more athletic,
            or track physique changes, body fat % is usually more informative
            than weight alone.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            But here’s the part most guides skip:{" "}
            <strong>at-home methods aren’t “true” or “false”—they’re noisy</strong>.
            They estimate using different signals. Your job is to pick the
            approach that matches your goal:
          </p>

          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li>
              <strong>One-time estimate:</strong> pick something simple and
              reasonable.
            </li>
            <li>
              <strong>Tracking change:</strong> pick something you can repeat
              under similar conditions.
            </li>
            <li>
              <strong>Understanding appearance:</strong> use visual references or
              photo-based tools.
            </li>
          </ul>
        </div>

        {/* Quick comparison box */}
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-2xl font-semibold">Quick comparison</h2>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 pr-4 text-gray-900">Method</th>
                  <th className="py-3 pr-4 text-gray-900">Best for</th>
                  <th className="py-3 pr-4 text-gray-900">Main downside</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b">
                  <td className="py-3 pr-4 font-medium">Formulas / calculators</td>
                  <td className="py-3 pr-4">Fast rough estimate</td>
                  <td className="py-3 pr-4">
                    Assumes averages; can miss muscle & distribution
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4 font-medium">Tape measurements</td>
                  <td className="py-3 pr-4">Repeatable trend tracking</td>
                  <td className="py-3 pr-4">
                    Technique-sensitive (placement matters)
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4 font-medium">Skinfold calipers</td>
                  <td className="py-3 pr-4">More “measurement-y” tracking</td>
                  <td className="py-3 pr-4">
                    High user error unless trained
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 pr-4 font-medium">Smart scales (BIA)</td>
                  <td className="py-3 pr-4">Convenient frequent check-ins</td>
                  <td className="py-3 pr-4">
                    Hydration can swing results a lot
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium">AI photo estimation</td>
                  <td className="py-3 pr-4">Appearance-aligned tracking</td>
                  <td className="py-3 pr-4">
                    Needs consistent photos (lighting/pose/clothing)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-gray-600">
            If you want a practical approach: choose{" "}
            <strong>one method</strong>, keep conditions similar, and focus on{" "}
            <strong>trends</strong> rather than obsessing over a single number.
          </p>
        </div>

        {/* Method 1 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            1) Formula-based body fat calculators (fast, rough)
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Many online calculators estimate body fat using formulas based on
            height, weight, age, sex, and sometimes circumference measurements
            (like the U.S. Navy method). They’re popular because they’re instant.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            The catch: formulas rely on population averages. That means they can
            be systematically off if you’re unusually muscular, carry fat
            differently, or don’t match the “average body” the formula assumes.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Use formulas when you want a quick starting point—but don’t treat
            the number like a lab result.
          </p>
        </div>

        {/* Method 2 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">2) Tape measurements (repeatable)</h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Tape-based methods estimate body fat from measurements like waist and
            neck (and hips for women, depending on the formula). For most people,
            tape can be more useful than weight because it captures body changes
            that the scale can hide.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Tape methods live and die on consistency. Small differences in tape
            placement, tension, or posture can move the result. The best practice
            is to measure the same way, at the same time of day, under similar
            conditions.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Tape is especially good for trend tracking: “Am I moving in the right
            direction?” rather than “What is my exact %?”
          </p>
        </div>

        {/* Method 3 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">3) Skinfold calipers (skill-dependent)</h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Skinfold calipers estimate body fat by measuring the thickness of
            subcutaneous fat at specific sites (like triceps, abdomen, thigh).
            When performed well, they can be useful for tracking changes over
            time.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            The downside is user error: pinching technique, site selection, and
            consistency matter a lot. If you’re not trained, calipers often feel
            “precise” while being inconsistent.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            If you use calipers, treat it like a skill: take multiple readings,
            average them, and keep the protocol consistent.
          </p>
        </div>

        {/* Method 4 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">4) Smart scales (BIA) (convenient, noisy)</h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Many smart scales use bioelectrical impedance analysis (BIA): they
            send a small electrical current through the body and infer body
            composition. The appeal is convenience—daily or weekly check-ins.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            The drawback is that hydration, recent food intake, exercise, and
            even temperature can shift results. BIA can be useful for spotting
            trends, but you’ll want stable conditions (same time of day, similar
            hydration) to reduce noise.
          </p>
        </div>

        {/* Method 5 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            5) AI body fat estimation from photos (appearance-aligned)
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            AI-based tools{" "}
            <a href="/estimate" className="text-primary underline">
              estimate your body fat percentage from a photo
            </a>{" "}
            by analyzing visible body composition cues—overall proportions, fat
            distribution, and how “lean vs soft” you appear. This aligns with how
            most people experience progress: in the mirror and in photos, not in
            a formula.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Photo-based estimation works best when your setup is consistent.
            Lighting, posture, camera distance, and clothing can change how lean
            you look—so keep those stable and focus on trends.
          </p>

          <div className="rounded-2xl border bg-base-100 p-5">
            <p className="text-gray-700 text-lg leading-relaxed">
              Want more consistent photo estimates? Keep it simple:
            </p>
            <ul className="mt-3 list-disc pl-6 text-lg text-gray-700 space-y-2">
              <li>Same lighting (avoid harsh overhead shadows)</li>
              <li>Same camera height & distance</li>
              <li>Same pose (front + side works well)</li>
              <li>Similar clothing (avoid loose garments)</li>
            </ul>
          </div>
        </div>

        {/* Best method */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">So… which method is best?</h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            The “best” method depends on what you’re trying to do. Here’s a
            practical rule:
          </p>

          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li>
              <strong>Want a quick rough number?</strong> Use a formula or tape.
            </li>
            <li>
              <strong>Want repeatable trend tracking?</strong> Tape, consistent
              photos, or the same smart scale routine.
            </li>
            <li>
              <strong>Want progress that matches how you look?</strong> AI photo
              estimation + consistent photos.
            </li>
          </ul>

          <p className="text-gray-700 text-lg leading-relaxed">
            A final sanity check: if your method jumps wildly week to week,
            that’s usually noise—not your body changing overnight. Pick a method
            you can repeat, and look for changes over weeks, not days.
          </p>

          {/* Secondary CTA */}
          <div className="rounded-2xl border bg-white p-6">
            <h3 className="text-xl font-semibold">Try the simplest repeatable approach</h3>
            <p className="mt-2 text-gray-700 text-lg leading-relaxed">
              Use consistent photos and get an estimate you can track over time.
            </p>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <a
                href="/estimate"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-white font-semibold hover:opacity-90 transition"
              >
                Estimate from a photo
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-full border px-6 py-3 font-semibold text-gray-900 hover:bg-base-200 transition"
              >
                Back to home
              </a>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">FAQ</h2>

          <div className="space-y-4">
            {faqs.map((f) => (
              <details
                key={f.question}
                className="rounded-2xl border bg-white p-5"
              >
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

        {/* Author */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-6 rounded-2xl border p-6 bg-white">
          <img
            src="/profile/matt-mapother-headshot.png"
            alt="Creator of BodyFatEstimator"
            className="w-24 h-24 rounded-full object-cover"
          />

          <div>
            <p className="text-lg font-bold">Matt Mapother</p>

            <p className="text-gray-500 mt-1">
              Independent product builder focused on practical fitness tools and
              visual progress tracking.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-400 pt-0">Last updated: January 2026</p>
      </section>
    </main>
  );
}
