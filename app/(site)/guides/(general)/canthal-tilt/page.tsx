import { Metadata } from "next";
import GuideHero from "@/app/components/guides/guide-hero";
import { MoreArticles } from "@/app/components/guides/more-articles";
import References from "@/app/components/guides/guide-references";
import { buildPageMetadata } from "@/app/libs/seo";
import Image from "next/image";

export const metadata: Metadata = buildPageMetadata({
  title: "Canthal Tilt: What It Is and Why It Matters",
  description:
    "Learn what canthal tilt means, how to estimate it from a photo, why it affects facial perception, and what can realistically change it.",
  canonical: "https://bodyfatestimator.ai/guides/canthal-tilt",
});

export default function CanfulTiltGuidePage() {
  return (
    <main className="bg-base-100 pt-10">
      <GuideHero
        slug="canthal-tilt"
        title="Canthal Tilt: What It Is and Why It Matters"
        intro={
          <>
            <p>
              Canthal tilt is one of those facial features that gets discussed constantly in aesthetics
              conversations. You will hear terms like positive canthal tilt, negative canthal tilt,
              and PCT vs NCT all the time.
            </p>
            <p>
              Once you strip away the jargon, it is a simple concept. More importantly, it is one
              piece of a much bigger facial-harmony picture.
            </p>
          </>
        }
        image={
          <figure className="max-w-3xl">
            <Image
              src="/examples/woman-selfie.webp"
              alt="Portrait example for canthal tilt analysis"
              width={1200}
              height={1200}
              sizes="(max-width: 768px) 100vw, 768px"
              className="rounded-xl border h-auto w-full object-cover"
            />
            <figcaption className="mt-2 text-sm text-gray-500 text-center">
              Even small eye-corner angle differences can change perceived expression.
            </figcaption>
          </figure>
        }
      />

      <section className="mx-auto mt-16 lg:mt-24 max-w-3xl px-6 pb-20 [&>div+div]:mt-20 lg:[&>div+div]:mt-40">
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">What Is Canthal Tilt?</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            At its core, canthal tilt is the angle formed between the inner and outer corners of your
            eye.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            More specifically, it describes the line between the medial canthus (inner corner) and
            lateral canthus (outer corner). That line can slope upward, stay level, or slope downward.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            It sounds like a minor detail, but this angle can strongly influence how your eyes and
            overall expression are perceived.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">The Three Types of Canthal Tilt</h2>

          <div className="rounded-2xl border bg-white p-6 space-y-3">
            <h3 className="text-2xl font-semibold text-gray-900">Positive Canthal Tilt (PCT)</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Positive tilt means the outer eye corner sits slightly higher than the inner corner.
              This usually reads as more alert and lifted, often with a subtle almond or cat-eye
              effect.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 space-y-3">
            <h3 className="text-2xl font-semibold text-gray-900">Neutral Canthal Tilt</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Neutral tilt means the inner and outer corners are close to level. This is very common
              and tends to look balanced without strongly pushing your expression in either direction.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 space-y-3">
            <h3 className="text-2xl font-semibold text-gray-900">Negative Canthal Tilt (NCT)</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Negative tilt means the outer corner sits lower than the inner corner. It can create a
              softer or more relaxed look, and in stronger cases may read as slightly tired.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Mild negative tilt is common and often not a problem by itself.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">Why People Care About It</h2>
          <ol className="space-y-6">
            <li className="rounded-2xl border bg-white p-6 space-y-3">
              <h3 className="text-2xl font-semibold text-gray-900">
                1. It Affects Expression, Even at Rest
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Faces are read quickly. Upward angles are often perceived as more engaged or confident,
                while downward angles can be read as softer, sadder, or more relaxed. One clinical
                attractiveness paper specifically examined this cue in the medial eye area{" "}
                <a
                  className="text-primary underline"
                  href="https://pubmed.ncbi.nlm.nih.gov/17237692/"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  (PMID: 17237692)
                </a>
                .
              </p>
            </li>
            <li className="rounded-2xl border bg-white p-6 space-y-3">
              <h3 className="text-2xl font-semibold text-gray-900">2. It Is Often Associated with Youth</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                With age, tissue support and skin elasticity can change around the eye area. Because of
                that, a more level or upward-appearing tilt is often interpreted as younger.
              </p>
            </li>
            <li className="rounded-2xl border bg-white p-6 space-y-3">
              <h3 className="text-2xl font-semibold text-gray-900">3. It Contributes to Facial Harmony</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Tilt does not exist in isolation. It interacts with brow position, eye depth,
                cheekbones, jaw structure, and overall proportions. Harmony matters more than one
                isolated metric.
              </p>
            </li>
          </ol>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">How To Measure Your Canthal Tilt</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            For most people, the practical method is a straight-on photo with head level, neutral
            expression, and eyes looking directly at the camera.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            You can run this through our{" "}
            <a className="text-primary underline" href="/eye-shape-detector">
              cantal tilt calculator
            </a>{" "}
            workflow, where the scan estimates canthal angle and category together with eye-shape
            context.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            A manual check also works: draw a horizontal reference line, then compare it to the line
            from inner corner to outer corner. Upward equals positive, flat equals neutral, downward
            equals negative.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            In technical terms, canthal tilt is the angle between a horizontal facial plane and the
            line connecting the medial and lateral canthus.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">Important Things To Keep in Mind</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
            <li>Slight asymmetry is normal. Most eyes are not perfectly matched.</li>
            <li>Lighting and camera angle can skew results.</li>
            <li>If you need extreme zoom to notice it, it is usually not a major factor.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">What Causes Canthal Tilt?</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Genetics is the primary driver. Orbital structure, soft-tissue position, and tendon
            attachment are mostly inherited.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Aging can also affect apparent tilt over time due to tissue and support changes around the
            lateral eye area.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Bone support around the orbital rim also influences whether the eye area appears more
            lifted or flatter.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">Can You Change It?</h2>
          <div className="rounded-2xl border bg-white p-6 space-y-3">
            <h3 className="text-2xl font-semibold text-gray-900">Non-Surgical Methods</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              You cannot directly change bone structure or tendon positioning with exercises, massage,
              or eye training. But you can improve how the eye area is perceived.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
              <li>Reduce puffiness through sleep, hydration, and nutrition consistency.</li>
              <li>Manage dark-circle contrast and under-eye fatigue cues.</li>
              <li>Use brow grooming and frame shape strategically.</li>
              <li>Keep photos consistent and avoid angle distortions.</li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-white p-6 space-y-3">
            <h3 className="text-2xl font-semibold text-gray-900">Surgical Option: Canthoplasty</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Canthoplasty can reposition and support the outer corner of the eye, but it is serious
              surgery in a high-precision area and should never be approached casually.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Typical considerations include financial cost, recovery time, and risks such as
              asymmetry, overcorrection, dryness, or results that look unnatural.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">When Does It Actually Matter?</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            This is where most people over-focus. A mildly negative tilt is common and usually not the
            main reason someone looks better or worse.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            It becomes more relevant when the tilt is pronounced, significantly affects resting
            expression, or strongly clashes with surrounding features.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">
            Canthal Tilt vs the Rest of the Eye Area
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            The eye area is a system, not a single metric. Important factors include eye shape, upper
            lid exposure, brow ridge position, eye depth, under-eye structure, and scleral show.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Someone can have negative tilt and still look very attractive when surrounding features are
            strong. Someone else can have positive tilt but weak eye-area harmony overall.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            If you want broader context, compare your eye findings with{" "}
            <a className="text-primary underline" href="/guides/what-makes-a-face-attractive">
              what makes a face attractive
            </a>{" "}
            and run one additional scan from{" "}
            <a className="text-primary underline" href="/tools/face">
              Face Tools
            </a>
            .
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">The Bottom Line</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Canthal tilt is real and does influence perception. Positive tilt often reads sharper,
            neutral reads balanced, and negative reads softer. But it is not everything.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Most people will get more return by focusing on overall facial harmony, sleep/recovery,
            grooming, and consistent photo quality than by fixating on one angle.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Use canthal tilt as one useful signal, not the only one.
          </p>
        </div>

        <References
          references={[
            {
              label: "Facial landmark detection in the wild (RetinaFace, arXiv)",
              href: "https://arxiv.org/abs/1905.00641",
            },
            {
              label: "Anthropometric Analysis of the Periocular Region (PubMed)",
              href: "https://pubmed.ncbi.nlm.nih.gov/25299756/",
            },
            {
              label:
                "Is medial canthal tilt a powerful cue for facial attractiveness? (PubMed)",
              href: "https://pubmed.ncbi.nlm.nih.gov/17237692/",
            },
            {
              label: "Periorbital Aesthetic Analysis (PubMed)",
              href: "https://pubmed.ncbi.nlm.nih.gov/30688968/",
            },
            {
              label: "The ideal male jaw angle - An Internet survey (PubMed)",
              href: "https://pubmed.ncbi.nlm.nih.gov/26888465/",
            },
            {
              label: "Aesthetic lateral canthoplasty (PubMed)",
              href: "https://pubmed.ncbi.nlm.nih.gov/20489545/",
            },
            {
              label: "Anthropometry of the Head and Face (Google Books)",
              href: "https://books.google.com/books/about/Anthropometry_of_the_Head_and_Face.html?id=MKVpAAAAMAAJ",
            },
            {
              label:
                "Measuring the Physical in Physical Attractiveness (DOI)",
              href: "https://doi.org/10.1037/0022-3514.50.5.925",
            },
            {
              label: "Effects of sexual dimorphism on facial attractiveness (Nature)",
              href: "https://doi.org/10.1038/29772",
            },
            {
              label: "Normality mediates the effect of symmetry on facial attractiveness (PubMed)",
              href: "https://pubmed.ncbi.nlm.nih.gov/33933836/",
            },
          ]}
        />

        <MoreArticles
          currentSlug="canthal-tilt"
          basePath="/guides"
          articles={[
            {
              slug: "what-makes-a-face-attractive",
              title: "What Makes a Face Attractive?",
              tag: "face",
              description:
                "A practical guide to facial attractiveness: structure, symmetry, expression, and the high-leverage habits that change first impressions.",
              date: "Mar 12, 2026",
              readTime: "6 min read",
              image: "/examples/woman-selfie.webp",
            },
            {
              slug: "estimate-body-fat-percentage-from-photo",
              title: "How to Estimate Body Fat % from Photos",
              tag: "fat",
              description:
                "Learn which visual cues matter in photos, how accurate appearance-based estimates are, and how to use automated tools more effectively.",
              date: "Jan 27, 2026",
              readTime: "5 min read",
              image: "/guides/estimate-body-fat-percentage-from-photo.webp",
            },
          ]}
        />
      </section>
    </main>
  );
}
