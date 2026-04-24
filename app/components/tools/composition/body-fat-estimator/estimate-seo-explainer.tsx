"use client";

import React from "react";
type Props = {
  className?: string;
};

export default function EstimateSeoExplainer({ className = "" }: Props) {
  return (
    <section className={`w-full max-w-3xl ${className}`}>
      <div className="p-6 md:p-8">
        {/* MAIN HEADING */}
        <h2 className="text-3xl text-center lg:text-4xl font-semibold">
          How to Estimate Body Fat % from a Photo
        </h2>

        <p className="mt-6 text-gray-700 text-lg leading-relaxed">
          A photo-based body fat estimate is a practical way to understand your{" "}
          <strong>body composition</strong> without a scan, calipers, or a smart scale.
          Instead of “calculating” from population formulas, an AI photo estimator
          looks at <strong>visual patterns</strong> — your silhouette, proportions,
          and fat distribution — to give a directional estimate you can use for{" "}
          <strong>progress tracking</strong>.
        </p>

        <p className="mt-4 text-gray-700 text-lg leading-relaxed">
          The right mental model is: <strong>range + trend</strong>, not “perfect truth.”
          If you take consistent photos, the estimate becomes very useful for answering
          the real question people care about: <em>Am I getting leaner over time?</em>
        </p>

        {/* WHAT IT MEANS */}
        <div className="mt-10 pb-10 space-y-4">
          <h2 className="text-2xl lg:text-3xl font-semibold text-center">
            What a photo body fat estimate actually means
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Body fat percentage is an estimate of how much of your total body mass
            comes from fat. A photo estimate doesn’t measure internal tissue like a
            DEXA scan. It infers where you likely fall based on how body fat tends to
            present visually across many examples.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            That’s why this approach is especially good for <strong>tracking change</strong>
            — because the input (photos) reflects the thing you actually see in real life:
            shape, definition, and where softness appears.
          </p>
        </div>

        {/* WHY PHOTOS WORK */}
        <div className="mt-10 pb-10 space-y-4">
          <h2 className="text-2xl lg:text-3xl font-semibold text-center">
            Why photos are a good way to track body fat (for normal people)
          </h2>

          <ul className="mt-4 list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li>
              <strong>Accessible:</strong> you can do it at home in under a minute.
            </li>
            <li>
              <strong>Repeatable:</strong> same setup = better trend signal.
            </li>
            <li>
              <strong>Appearance-aligned:</strong> matches how progress is usually noticed.
            </li>
            <li>
              <strong>Less obsessive:</strong> encourages weekly check-ins vs daily noise.
            </li>
          </ul>

          <p className="text-gray-700 text-lg leading-relaxed">
            The biggest win is consistency: when your photo setup stays similar,
            your results get <strong>more useful over time</strong>.
          </p>
        </div>

        {/* HOW TO TAKE PHOTOS */}
        <div className="mt-10 pb-10 space-y-4">
          <h2 className="text-2xl lg:text-3xl font-semibold text-center">
            How to take photos for the most accurate estimate
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            The most common reason people get “weird” results is that their photos
            are inconsistent. You don’t need perfect photos — you need{" "}
            <strong>repeatable photos</strong>.
          </p>

          <ul className="mt-4 list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li>
              <strong>Lighting:</strong> use similar lighting each time (avoid harsh overhead shadows).
            </li>
            <li>
              <strong>Distance:</strong> keep the camera at a consistent distance (avoid close wide-angle distortion).
            </li>
            <li>
              <strong>Angle:</strong> keep the camera level with your torso, not looking up or down.
            </li>
            <li>
              <strong>Clothing:</strong> wear fitted clothing (baggy clothing hides shape and creates false shadows).
            </li>
            <li>
              <strong>Pose:</strong> relaxed stance, neutral posture, same pose every time.
            </li>
            <li>
              <strong>Multiple angles:</strong> front + side is usually more reliable than front only.
            </li>
          </ul>

          <p className="text-gray-700 text-lg leading-relaxed">
            If you want the estimate to be more stable, treat it like a lab test:
            same conditions, same setup, same cadence.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            For a deeper guide:{" "}
            <a
              href="/blog/how-to-take-photos-for-body-fat-estimation"
              className="text-primary underline"
            >
              how to take photos for body fat estimation
            </a>
            .
          </p>
        </div>

        {/* WHY IT CAN CHANGE */}
        <div className="mt-10 pb-10 space-y-4">
          <h2 className="text-2xl lg:text-3xl font-semibold text-center">
            Why your estimate can change between photos (even on the same day)
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            If you upload two different photos, it’s normal to see slightly different results.
            Your body didn’t change in 10 minutes — the <strong>photo conditions</strong> did.
          </p>

          <ul className="mt-4 list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li>
              <strong>Lighting</strong> can add/remove definition like a magic trick.
            </li>
            <li>
              <strong>Camera lens distortion</strong> changes proportions (especially close-up shots).
            </li>
            <li>
              <strong>Posture and breathing</strong> can change waist appearance.
            </li>
            <li>
              <strong>Clothing wrinkles/shadows</strong> can look like softness.
            </li>
          </ul>

          <p className="text-gray-700 text-lg leading-relaxed">
            The fix is simple: pick a setup and stick to it. Track weekly or bi-weekly,
            and focus on the trend line.
          </p>
        </div>

        {/* COMPARED TO OTHER METHODS */}
        <div className="mt-10 pb-10 space-y-4">
          <h2 className="text-2xl lg:text-3xl font-semibold text-center">
            Photo estimation vs smart scales vs DEXA
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Different methods answer different questions — which is why they disagree.
            A DEXA scan is great for a one-time baseline. Smart scales (BIA) are convenient,
            but can swing with hydration and timing. Photo estimation is often the best fit
            for <strong>visual progress tracking</strong>.
          </p>

          <ul className="mt-4 list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li>
              <strong>DEXA:</strong> higher precision, expensive, impractical frequently.
            </li>
            <li>
              <strong>Smart scales (BIA):</strong> easy, but noisy day-to-day.
            </li>
            <li>
              <strong>Photo estimation:</strong> appearance-aligned, best for repeatable check-ins.
            </li>
          </ul>

          <p className="text-gray-700 text-lg leading-relaxed">
            If you want more:{" "}
            <a
              href="/blog/why-body-fat-estimators-give-different-results"
              className="text-primary underline"
            >
              why body fat methods give different numbers
            </a>
            .
          </p>
        </div>

        {/* HOW TO USE RESULT */}
        <div className="mt-10 pb-10 space-y-4">
          <h2 className="text-2xl lg:text-3xl font-semibold text-center">
            How to use your result (without obsessing)
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Most people get the most value from body fat estimation when they use it
            as a <strong>trend tool</strong>. Here’s a simple workflow that works:
          </p>

          <ol className="mt-4 list-decimal pl-6 text-lg text-gray-700 space-y-2">
            <li>Take 1–2 photos in a consistent setup.</li>
            <li>Estimate once per week (or every 2 weeks).</li>
            <li>Compare the trend across 4–8 weeks, not day-to-day.</li>
            <li>Use it alongside photos, measurements, and how clothes fit.</li>
          </ol>

          <p className="text-gray-700 text-lg leading-relaxed">
            More practical tracking guidance:{" "}
            <a
              href="/blog/how-to-track-body-fat-changes"
              className="text-primary underline"
            >
              how to track body fat changes over time
            </a>
            .
          </p>
        </div>

        {/* SAFETY / DISCLAIMER */}
        <div className="mt-10 rounded-2xl border bg-base-100 p-5">
          <h2 className="text-xl font-semibold text-gray-900 text-center">
            Important note about accuracy and limitations
          </h2>
          <p className="mt-2 text-gray-700 text-lg leading-relaxed">
            This tool provides a <strong>non-medical visual estimate</strong>. It’s best used
            for fitness progress tracking, not diagnosis or clinical decisions. If you need
            medical-grade body composition data, use a clinical method and talk with a professional.
          </p>
        </div>

      </div>
    </section>
  );
}
