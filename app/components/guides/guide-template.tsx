import { Metadata } from "next";
import GuideHero from "@/app/components/guides/guide-hero";
import References from "./guide-references";
import { MoreArticles } from "./more-articles";

export const metadata: Metadata = {
  title: "XX",
  description:
    "YY",
};

export default function ZZ() {
  return (
    <main className="bg-base-100">
      <GuideHero
        title="XX"
        intro={
          <>
            <p>
              intro
            </p>
            <p>
              intro 2
            </p>
          </>
        }
        image={
          <figure className="max-w-3xl">
            <img
              src="/guides/xx.webp"
              alt="XX"
              loading="lazy"
              className="rounded-xl border"
            />
            <figcaption className="mt-2 text-sm text-gray-500 text-center">
              label for image
            </figcaption>
          </figure>
        }
      />

      {/* Content */}
      <section className="mx-auto max-w-3xl px-6 pb-20 space-y-12">

        {/* H2 section */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">
            H2 Title #1
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            text
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            text
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            The result is an inference — not a measurement of fat tissue in your body.
          </p>
        </div>

        {/* H2 section #2 */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">
            H2 Title #2
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            text
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            text
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            The result is an inference — not a measurement of fat tissue in your body.
          </p>
        </div>

        <References
                    references={[
                      {
                        label: "How AI Body Fat Estimation Works",
                        href: "/guides/how-ai-body-fat-estimation-works",
                      },
                      {
                        label: "How Accurate Is AI Body Fat Estimation?",
                        href: "/guides/how-accurate-is-ai-body-fat-estimation",
                      },
                      {
                        label: "Why Body Fat Measurement Methods Give Different Results",
                        href: "/guides/why-body-fat-measurements-give-different-results",
                      },
                    ]}
                  />
        
        <MoreArticles
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
