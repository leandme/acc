import { Metadata } from "next";
import GuideHero from "@/app/components/guides/guide-hero";
import { MoreArticles } from "@/app/components/guides/more-articles";
import CTA from "@/app/components/common/cta";

export const metadata: Metadata = {
  title: "How to Estimate Body Fat % from Photos (Mirror Selfies)",
  description:
    "Learn how body fat percentage can be estimated from photos and mirror selfies, which visual cues matter, how accurate photo-based estimates are, and how automated tools compare to human eyeballing.",
};

export default function HowToEstimateBodyFatFromPhotos() {
  return (
    <main className="bg-base-100">
      <GuideHero
        title="How to Estimate Body Fat % from Photos"
        intro={
          <>
            <p>
              Estimating body fat percentage from photos — including mirror selfies —
              has become increasingly common. From fitness forums to AI-powered tools,
              people regularly try to infer body fat levels just by looking.
            </p>
            <p>
              This guide explains how photo-based body fat estimation actually works,
              which visual cues are used for men and women, how accurate these estimates
              tend to be, and where photos are useful — and where they fail.
            </p>
          </>
        }
        image={
          <figure className="max-w-3xl">
            <img
              src="/guides/estimate-body-fat-percentage-from-photo.png"
              alt="Estimating body fat percentage from photos and mirror selfies"
              loading="lazy"
              className="rounded-xl border"
            />
            <figcaption className="mt-2 text-sm text-gray-500 text-center">
              Photo-based body fat estimation relies on visual patterns, not direct
              measurement of fat tissue.
            </figcaption>
          </figure>
        }
      />

      {/* Content */}
      <section className="mx-auto max-w-3xl px-6 pb-20 space-y-12">

        {/* H2 section */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            What it means to estimate body fat from photos
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Estimating body fat percentage from photos does not mean measuring fat
            directly. A photo — whether a professional progress photo or a casual
            mirror selfie — contains no information about tissue composition.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Instead, photo-based estimation works by comparing visible features of the
            body to known appearance patterns that tend to correlate with certain body
            fat ranges. These patterns have been observed across thousands of people,
            both men and women.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            The result is an inference — not a measurement of fat tissue in your body.
          </p>
        </div>

        {/* H2 section */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            Visual cues used in photo-based body fat estimation
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Whether done by a human observer or an automated tool, photo-based body fat
            estimation relies on a consistent set of visual cues. These cues are not
            arbitrary — they reflect how fat is distributed on the body as levels rise
            or fall.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Common visual cues include fat distribution across the abdomen, chest,
            jawline, limbs, and lower back. In men, abdominal definition, oblique
            visibility, and jawline sharpness are strong indicators. In women, fat
            distribution around the hips, thighs, upper arms, and waist-to-hip ratio
            plays a larger role.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Limb thickness, muscle separation, and the presence or absence of soft
            tissue around joints also provide signals. No single cue determines body
            fat percentage — estimates emerge from the combination.
          </p>
        </div>

        {/* H2 section */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            Why mirror selfies can work — and where they fail
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Mirror selfies are often dismissed as unreliable, but they can still be
            useful for body fat estimation if taken consistently. As long as lighting,
            distance, posture, and clothing remain similar, mirror selfies capture the
            same visual cues as traditional progress photos.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            However, mirror selfies fail when angles, lighting, or poses are manipulated.
            Overhead lighting, flexing, twisting, or shooting from above can exaggerate
            leanness and distort fat distribution.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Photos work best for tracking changes over time, not for producing a
            perfectly precise number from a single image.
          </p>
        </div>

        {/* CTA */}
        <CTA
          title="Estimate Your Body Fat % from a Photo"
          href="/estimate"
        />

        {/* H2 section */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            How close photo-based body fat estimates typically are
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Photo-based body fat estimates are usually directionally accurate rather
            than exact. Under good conditions, estimates often fall within a few
            percentage points of lab-based methods like DEXA — but variability is real.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Accuracy depends heavily on <a className="underline text-primary" href="/guides/how-to-take-photos-for-body-fat-estimation">photo quality</a>, consistency, sex-specific fat
            distribution, and individual differences such as muscle mass and frame
            size. Two people at the same body fat percentage can look meaningfully
            different.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            This is why photo-based methods are best used for trend tracking rather
            than single-point validation.
          </p>
        </div>

        {/* H2 section */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            Automated tools vs human eyeballing
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Human eyeballing relies on subjective pattern recognition. While experienced
            observers can be reasonably accurate, human estimates vary widely and are
            influenced by bias, recent comparisons, and expectations.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Automated body fat estimation tools analyze photos more consistently. They
            evaluate the same visual features every time, without fatigue or bias, and
            are better suited for tracking change across weeks or months.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Automated tools do not “see” fat directly — but they excel at consistency,
            which is often more valuable than absolute precision.
          </p>
        </div>

        {/* H2 section */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            When photo-based estimation makes sense
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Estimating body fat from photos makes sense when lab methods are unavailable,
            expensive, or impractical. It is especially useful for people tracking
            appearance changes during fat loss or recomposition.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            For both men and women, consistency matters more than perfection. Taking
            similar photos over time provides more insight than chasing a single
            “accurate” number.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Used correctly, photos become a practical proxy for body composition trends.
          </p>
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
