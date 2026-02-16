import { Metadata } from "next";
import GuideHero from "@/app/components/guides/guide-hero";
import { MoreArticles } from "@/app/components/guides/more-articles";
import GuideStandardReferences from "@/app/components/guides/guide-standard-references";
import { buildPageMetadata } from "@/app/libs/seo";
import Image from "next/image";

export const metadata: Metadata = buildPageMetadata({
  title: "How Accurate Are Smart Scales?",
  description: "Learn how smart scales estimate body fat using BIA, why results change overnight, and when smart scales are useful (and when they aren’t).",
  canonical: "https://bodyfatestimator.ai/guides/how-accurate-are-smart-scales",
});

export default function BlogPostPage() {
  return (
    <main className="bg-base-100">
      <GuideHero
              slug="how-accurate-are-smart-scales"
        title="How Accurate Are Smart Scales?"
        intro={
          <>
            <p>
              Smart scales promise quick body fat percentages with a single step.
              But if you’ve ever seen your body fat jump or drop overnight, you’ve
              probably wondered how accurate they really are.
            </p>
            <p>
              This guide explains how smart scales estimate body fat, why their
              results fluctuate so much, and how to use them correctly — without
              misinterpreting the numbers.
            </p>
          </>
        }
        image={
          <figure className="max-w-3xl">
            <Image
  src="/guides/how-accurate-are-smart-scales.png"
  alt="Smart scale body fat accuracy explained"
  width={1200}
  height={675}
  sizes="(max-width: 768px) 100vw, 768px"
  className="rounded-xl border h-auto w-full"
/>
            <figcaption className="mt-2 text-sm text-gray-500 text-center">
              Smart scales estimate body fat indirectly — not by measuring fat itself
            </figcaption>
          </figure>
        }
      />

      {/* Content */}
      <section className="mx-auto max-w-3xl px-6 pb-20 [&>div+div]:mt-20 lg:[&>div+div]:mt-40">
        {/* What smart scales actually measure */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            What smart scales actually measure
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Smart scales do not measure body fat directly. Instead, most use a method
            called <strong>bioelectrical impedance analysis (BIA)</strong>.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            BIA sends a very small electrical current through your body and measures
            how easily it travels. Because water conducts electricity better than fat,
            the scale estimates body composition based on resistance.
          </p>

          <p className="text-gray-500 text-lg leading-relaxed">
            The key word is estimate. The scale is inferring body fat using assumptions
            — not observing fat tissue.
          </p>
        </div>

        {/* Why results change */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            Why smart scale body fat changes overnight
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            The biggest limitation of smart scales is sensitivity. Because BIA depends
            heavily on body water, small day-to-day changes can cause large swings in
            reported body fat.
          </p>

          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li><strong>Hydration:</strong> drinking more water often lowers the reading</li>
            <li><strong>Food intake:</strong> glycogen and sodium affect water retention</li>
            <li><strong>Exercise:</strong> sweating temporarily increases impedance</li>
            <li><strong>Time of day:</strong> morning vs evening can differ noticeably</li>
            <li><strong>Foot contact:</strong> dry skin or positioning changes results</li>
          </ul>

          <p className="text-gray-700 text-lg leading-relaxed">
            This is why someone can appear leaner in the mirror while their smart scale
            says they gained body fat.
          </p>
        </div>

        {/* Accuracy vs consistency */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            Accuracy vs consistency (the real issue)
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            When people ask if smart scales are “accurate,” they usually mean one of two
            things — even if they don’t realize it.
          </p>

          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li><strong>Accuracy:</strong> does the number match your true body fat?</li>
            <li><strong>Consistency:</strong> does the number change when your body changes?</li>
          </ul>

          <p className="text-gray-700 text-lg leading-relaxed">
            Smart scales often struggle with accuracy. The absolute number can be off
            by several percentage points. Consistency can be decent — but only under
            tightly controlled conditions.
          </p>
        </div>

        {/* When smart scales are useful */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            When smart scales are useful
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Smart scales can be useful if you treat them as a trend tool, not a truth
            machine.
          </p>

          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li>Weigh at the same time each day (ideally mornings)</li>
            <li>Focus on multi-week trends, not single readings</li>
            <li>Ignore small day-to-day fluctuations</li>
            <li>Use alongside photos or measurements for context</li>
          </ul>
          <p className="text-gray-700 text-lg leading-relaxed">
            To quantify progress cleanly from your scale logs, use the{" "}
            <a className="text-primary underline" href="/weight-loss-percentage-calculator">
              Weight Loss Percentage Calculator
            </a>
            .
          </p>
        </div>

        {/* Comparison */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            Smart scales vs other body fat methods
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Compared to other methods, smart scales sit at the convenience end of the
            spectrum — not the precision end.
          </p>

          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li><strong>DEXA scans:</strong> more accurate, but expensive and infrequent</li>
            <li><strong>Tape or Navy method:</strong> formula-based, assumption-heavy (compare with the{" "}
              <a className="text-primary underline" href="/body-fat-calculator">Body Fat Calculator</a>)</li>
            <li>
              <strong>BRI:</strong> waist-height roundness estimate (try the{" "}
              <a className="text-primary underline" href="/bri-calculator">
                BRI Calculator
              </a>
              )
            </li>
            <li>
              <strong>BAI:</strong> hip-height adiposity estimate (try the{" "}
              <a className="text-primary underline" href="/bai-calculator">
                BAI Calculator
              </a>
              )
            </li>
            <li>
              <strong>Lean mass equations:</strong> fast height/weight estimates (try the{" "}
              <a className="text-primary underline" href="/lean-body-mass-calculator">
                Lean Body Mass Calculator
              </a>
              )
            </li>
            <li>
              <strong>BMI screening:</strong> quick category context from height and weight (try the{" "}
              <a className="text-primary underline" href="/bmi-calculator">
                BMI Calculator
              </a>
              )
            </li>
            <li>
              <strong>Timeline planning:</strong> estimate pace to target weight (try the{" "}
              <a className="text-primary underline" href="/weight-loss-calculator">
                Weight Loss Calculator
              </a>
              )
            </li>
            <li>
              <strong>Skinfold calipers:</strong> site-based fat-thickness estimates (try the{" "}
              <a className="text-primary underline" href="/skinfold-body-fat-calculator">
                Skinfold Body Fat Calculator
              </a>
              )
            </li>
            <li><strong>Photo-based estimation:</strong> aligns better with appearance</li>
            <li><strong>Smart scales:</strong> easy, but noisy</li>
          </ul>
        </div>

        {/* Verdict */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold">
            So, how accurate are smart scales?
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Smart scales are directionally useful but numerically unreliable. They can
            help you notice long-term change, but the exact percentage should be treated
            with skepticism.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            If your goal is understanding how your body actually looks and changes,
            combining visual context with consistent tracking usually beats relying on
            a single device. If your estimates disagree, this guide explains why:{" "}
            <a className="text-primary underline" href="/guides/why-body-fat-estimators-give-different-results">Why Body Fat Estimators Give Different Results</a>.
          </p>
        </div>

        <GuideStandardReferences slug="how-accurate-are-smart-scales" />

        <MoreArticles
            currentSlug="how-accurate-are-smart-scales"
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
