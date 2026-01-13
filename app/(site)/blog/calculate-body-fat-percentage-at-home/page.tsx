import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Calculate Your Body Fat Percentage at Home",
  description:
    "Learn how to calculate your body fat percentage at home using simple methods, from tape measurements to AI photo analysis. Compare accuracy, pros, and cons.",
};

export default function BlogPostPage() {
  return (
    <main className="bg-base-100">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-12">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">
          How to Calculate Your Body Fat Percentage at Home
        </h1>

        <p className="mt-6 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          You don’t need a lab, a scan, or expensive equipment to estimate your
          body fat percentage. Today, there are several at-home methods — each
          with different trade-offs in accuracy, convenience, and cost.
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
            At-home body fat methods range from simple calculators to tape measurements and AI photo estimates.
          </figcaption>
        </figure>
      </section>


      {/* Content */}
      <section className="mx-auto max-w-3xl px-6 pb-20 space-y-12">
        {/* Intro */}
        <div className="space-y-4">
          <p className="text-gray-700 text-lg leading-relaxed">
            Body fat percentage is one of the most useful metrics for tracking
            physical progress. Unlike body weight, it helps you understand how
            much of your body is fat versus lean mass like muscle, bone, and
            organs.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            The challenge is accuracy. Some methods are simple but rough. Others
            are precise but impractical for frequent use. Below, we’ll break
            down the most common ways to calculate body fat percentage at home —
            and when each one makes sense.
          </p>
        </div>

        {/* Method 1 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            1. Body Fat Calculators (Formulas)
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Online body fat calculators use formulas based on height, weight,
            age, sex, and sometimes circumference measurements. Popular examples
            include BMI-based estimates and U.S. Navy formulas.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            These calculators are fast and accessible, but they rely on
            population averages. They don’t account well for muscle mass, fat
            distribution, or how your body actually looks.
          </p>

          <p className="text-gray-700 text-lg text-lg leading-relaxed">
            For someone athletic or visually lean, formula-based estimates often
            overestimate body fat. For others, they may underestimate it.
          </p>
        </div>

        {/* Method 2 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            2. Tape Measure Methods
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Tape-based methods (like the Navy method) use measurements of the
            waist, neck, and sometimes hips to estimate body fat percentage.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            These methods can be more accurate than BMI alone, but results vary
            depending on where and how measurements are taken. Small differences
            in tape placement can noticeably change the result.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            They’re useful for consistency if you measure the same way every
            time, but still don’t fully capture fat distribution or muscle
            definition.
          </p>
        </div>

        {/* Method 3 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            3. Visual Comparison Charts
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Body fat percentage picture charts show example bodies at different
            fat levels. People compare themselves visually to estimate where
            they fall.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            This approach can be surprisingly intuitive, especially for people
            familiar with training or physique changes. However, charts are
            subjective and don’t account for individual proportions.
          </p>
        </div>

        {/* Method 4 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            4. AI Body Fat Estimation from Photos
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Newer AI-based tools <a href="/estimate" className="text-primary underline">estimate body fat</a> percentage by analyzing a
            photo. Instead of relying only on numbers, they evaluate visible
            body composition, fat distribution, and proportions.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            This approach aligns more closely with how people perceive progress
            — how lean or soft they look — rather than abstract formulas. It’s
            especially useful for tracking changes over time using consistent
            photos.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Like all at-home methods, results depend on lighting, posture,
            clothing, and photo quality. But with consistent setup, AI photo
            estimates can be a practical and repeatable tracking tool.
          </p>
        </div>

        {/* Comparison */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Which Method Is Best?
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            There’s no single “perfect” at-home method. The best option depends
            on your goal:
          </p>

          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li>
              <strong>Quick estimate:</strong> Formula-based calculators
            </li>
            <li>
              <strong>Simple consistency:</strong> Tape measurements
            </li>
            <li>
              <strong>Visual awareness:</strong> Comparison charts
            </li>
            <li>
              <strong>Tracking appearance changes:</strong> AI photo estimation
            </li>
          </ul>

          <p className="text-gray-700 text-lg leading-relaxed">
            For most people, consistency matters more than absolute precision.
            Using the same method, under similar conditions, makes trends far
            more meaningful than a single “perfect” number.
          </p>
        </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center gap-6 rounded-2xl border p-6">
              <img
                src="/profile/matt-mapother-headshot.png"
                alt="Creator of BodyFatEstimator"
                className="w-24 h-24 rounded-full object-cover"
              />

              <div>
                <p className="text-lg font-bold">
                  Matt Mapother
                </p>

                <p className="text-gray-500 mt-1">
                  Independent product builder focused on practical fitness tools
                  and visual progress tracking.
                </p>
              </div>
            </div>

            {/* Footer */}
        <p className="text-sm text-gray-400 pt-0">
          Last updated: January 2026
        </p>

      </section>
    </main>
  );
}
