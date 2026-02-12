import { Metadata } from "next";
import GuideHero from "@/app/components/guides/guide-hero";
import { MoreArticles } from "@/app/components/guides/more-articles";

export const metadata: Metadata = {
  title: "How AI Body Fat Estimation Works",
  description:
    "Learn how an AI body fat estimator works, what visual signals it uses, what it ignores, and why photo-based body fat estimation can be directionally accurate for tracking changes over time.",
};

export default function BlogPostPage() {

  return (
    <main className="bg-base-100 pt-10">

      <GuideHero
              title="How AI Body Fat Estimation Works"
              intro={
                <>
                  <p>
                    An AI body fat estimator doesn’t “measure” fat the way a scan does.
                    Instead, it analyzes visual patterns in photos to estimate body fat
                    percentage directionally — similar to how experienced coaches make
                    visual assessments.
                  </p>
                </>
              }
              image={
                <figure className="max-w-3xl">
                  <img
                    src="/guides/how-ai-body-fat-estimation-works.png"
                    alt="what does x% bodyfat look like?"
                    loading="lazy"
                    className="rounded-xl border"
                  />
                  <figcaption className="mt-2 text-sm text-gray-500 text-center">
                    Body fat percentages can differ wildly despite looking similar
                  </figcaption>
                </figure>
              }
            />

      {/* Content */}
      <section className="mx-auto max-w-3xl px-6 pb-20 space-y-12">
        {/* Framing */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            What an AI body fat estimator actually does
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            An AI body fat estimator uses computer vision to analyze visible
            characteristics in a photo — things like body proportions, overall
            silhouette, and fat distribution patterns.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            It does not measure fat directly. Instead, it estimates where someone
            likely falls within a body fat range based on learned visual
            relationships.
          </p>
        </div>

        {/* High-level CV explanation */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            A high-level explanation (no technical jargon)
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            At a high level, the AI has learned how different body fat levels tend
            to look across many examples. When you upload a photo, it compares
            visual cues in your image to those learned patterns.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Think of it as a very consistent visual observer — not a medical
            device, but a pattern recognizer trained on body composition
            appearance.
          </p>
        </div>

        {/* What it sees */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            What the AI looks at in a photo
          </h2>

          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li>Overall body shape and silhouette</li>
            <li>Relative proportions (torso, limbs, waist)</li>
            <li>Visible fat distribution (where softness appears)</li>
            <li>Contrast between muscle contours and fat</li>
          </ul>

          <p className="text-gray-500 text-lg leading-relaxed">
            These cues are similar to what humans use when visually estimating
            body fat — just applied consistently.
          </p>
        </div>

        {/* What it ignores */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            What the AI intentionally ignores
          </h2>

          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li>Your scale weight</li>
            <li>BMI or height-weight formulas</li>
            <li>Fitness claims or labels</li>
            <li>Medical data or diagnoses</li>
          </ul>

          <p className="text-gray-700 text-lg leading-relaxed">
            This is deliberate. Appearance-based estimation works best when it’s
            not constrained by population averages or assumptions.
          </p>
        </div>

        {/* Why photos work */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            Why photo-based estimation works directionally
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Photos capture the thing most people actually care about: how their
            body looks. While photos aren’t perfect, they’re surprisingly useful
            when taken under similar conditions.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            When lighting, posture, and camera setup stay consistent, changes in
            appearance often reflect real changes in body composition — even if
            the exact percentage isn’t precise.
          </p>
        </div>

        {/* Limitations */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            Limitations to understand
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Like all at-home body fat estimation methods, AI photo estimation has
            limitations.{" "}
            <a
              href="/guides/how-accurate-is-ai-body-fat-estimation"
              className="text-primary underline"
            >How accurate AI estimation is</a>{" "} can shift based on lighting, pose, camera angle,
            distance, and clothing.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            That’s why this tool works best as a repeatable reference — not a
            one-time truth.
          </p>
        </div>

        {/* Practical usage */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            How to get the most accurate results
          </h2>

          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li>Use the same lighting each time</li>
            <li>Keep the camera at the same height and distance</li>
            <li>Use the same pose (front or front + side)</li>
            <li>Avoid loose or bulky clothing</li>
            <li>Track trends over weeks, not days</li>
          </ul>
        </div>
<MoreArticles
            basePath="/guides"
            articles={[
                {
                slug: "why-body-fat-measurements-give-different-results",
                title: "Why Body Fat Measurement Methods Give Different Results",
                tag: "body-analysis",
                description:
                "DEXA, smart scales, calculators, and visual estimates often disagree. Learn why body fat measurement methods give different results and how to interpret them correctly.",
                date: "Jan 13, 2026",
                readTime: "7 min read",
                image: "/guides/why-body-fat-measurements-give-different-results.png",
                },
                {
                slug: "body-fat-estimation-methods",
                title: "Common Body Fat Estimation Methods Explained",
                tag: "body-analysis",
                description:
                    "An overview of the most common body fat measurement methods — including the Navy tape method, skinfold calipers, BIA smart scales, and DEXA scans — with clear guidance on when each method makes sense.",
                date: "Jan 8, 2026",
                readTime: "7 min read",
                image: "/guides/body-fat-estimation-methods.png",
                },
            ]}
        />
      </section>
    </main>
  );
}
