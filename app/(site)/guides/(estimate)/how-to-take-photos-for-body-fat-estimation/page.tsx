import { Metadata } from "next";
import GuideHero from "@/app/components/guides/guide-hero";
import { MoreArticles } from "@/app/components/guides/more-articles";
import GuideStandardReferences from "@/app/components/guides/guide-standard-references";
import { buildPageMetadata } from "@/app/libs/seo";
import Image from "next/image";

export const metadata: Metadata = buildPageMetadata({
  title: "How to Take Photos for Body Fat Estimation",
  description: "Learn how to take consistent body fat photos for estimation and progress tracking. Lighting, pose, camera setup, and common mistakes explained.",
  canonical: "https://bodyfatestimator.ai/guides/how-to-take-photos-for-body-fat-estimation",
});

export default function BlogPostPage() {

  return (
    <main className="bg-base-100">

      <GuideHero
              slug="how-to-take-photos-for-body-fat-estimation"
                                title="How to Take Photos for Body Fat Estimation"
                                intro={
                                  <>
                                    <p>
                               Photo-based body fat estimation works best when photos are taken
                                      consistently. The goal isn’t a flattering picture — it’s a repeatable
                                      one that lets you interpret change accurately.
                                    </p>
                                  </>
                                }
                                image={
                                  <figure className="max-w-3xl">
                                    <Image
  src="/guides/how-to-take-photos-for-body-fat-estimation.webp"
  alt="how to take photos for body fat estimation"
  width={1200}
  height={675}
  sizes="(max-width: 768px) 100vw, 768px"
  className="rounded-xl border h-auto w-full"
/>
                                    <figcaption className="mt-2 text-sm text-gray-500 text-center">
                                      Accurate body fat estimates require good photos
                                    </figcaption>
                                  </figure>
                                }
        />

      {/* Content */}
      <section className="mx-auto max-w-3xl px-6 pb-20 [&>div+div]:mt-20 lg:[&>div+div]:mt-40">
        {/* Framing */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            What makes a “good” body fat photo
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            A good body fat photo is not about lighting tricks, flexing, or
            posing to look leaner. It’s about capturing your body under similar
            conditions each time so changes reflect reality.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Think of photos as a measurement tool. Consistency matters more than
            aesthetics.
          </p>
        </div>

        {/* Lighting */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            1) Use consistent lighting
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Lighting changes how shadows fall across your body. Overhead lights,
            side lighting, or sunlight at different times of day can all change
            how lean you appear.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Pick one lighting setup and stick to it. Neutral, even lighting is
            better than dramatic lighting.
          </p>
        </div>

        {/* Camera */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            2) Keep camera height and distance the same
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Camera angle affects proportions. A lower camera can exaggerate the
            torso; a higher camera can make the waist look smaller.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Place the camera at roughly chest height, at a fixed distance, and
            avoid wide-angle distortion when possible.
          </p>
        </div>

        {/* Pose */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            3) Use the same pose every time
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Subtle posture changes can alter how your body looks. Flexing,
            sucking in your stomach, or shifting weight changes the signal.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            A relaxed front-facing pose works well. Some people also include a
            relaxed side view for additional context.
          </p>
        </div>

        {/* Clothing */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            4) Wear minimal, consistent clothing
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Loose clothing hides body contours. Compression or tight-fitting
            clothing can distort shape.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Wear similar minimal clothing each time so the outline of your body
            is visible and comparable.
          </p>
        </div>

        {/* Frequency */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            How often to take body fat photos
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Daily photos tend to exaggerate small fluctuations that aren’t real
            fat changes. Most people get better signal by taking photos every
            1–2 weeks.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Spacing photos out helps you focus on meaningful trends rather than
            noise.
          </p>
        </div>

        {/* Common mistakes */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            Common mistakes to avoid
          </h2>

          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li>Changing lighting or time of day</li>
            <li>Using different poses or flexing</li>
            <li>Standing closer or farther from the camera</li>
            <li>Switching clothing styles</li>
            <li>Interpreting daily changes as real fat loss or gain</li>
          </ul>
        </div>

        {/* Bridge to tool */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            Why this improves estimation accuracy
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Photo-based body fat estimation works best when visual noise is
            minimized. Consistent photos let the estimator focus on real changes
            in shape and proportions.
          </p>

          <a
            href="/estimate"
            className="text-primary underline text-lg"
          >
            Estimate your body fat from a photo →
          </a>
        </div>

        <GuideStandardReferences slug="how-to-take-photos-for-body-fat-estimation" />

        <MoreArticles
            currentSlug="how-to-take-photos-for-body-fat-estimation"
            basePath="/guides"
            articles={[
                {
                slug: "why-body-fat-measurements-give-different-results",
                title: "Why Body Fat Measurement Methods Give Different Results",
                tag: "fat",
                description:
                "DEXA, smart scales, calculators, and visual estimates often disagree. Learn why body fat measurement methods give different results and how to interpret them correctly.",
                date: "Jan 13, 2026",
                readTime: "7 min read",
                image: "/guides/why-body-fat-measurements-give-different-results.webp",
                },
                {
                slug: "body-fat-estimation-methods",
                title: "Common Body Fat Estimation Methods Explained",
                tag: "fat",
                description:
                    "An overview of the most common body fat measurement methods — including the Navy tape method, skinfold calipers, BIA smart scales, and DEXA scans — with clear guidance on when each method makes sense.",
                date: "Jan 8, 2026",
                readTime: "7 min read",
                image: "/guides/body-fat-estimation-methods.webp",
                },
            ]}
        />
      </section>
    </main>
  );
}
