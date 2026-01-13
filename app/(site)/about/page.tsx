import { Metadata } from "next";

const title = "About | Body Fat Estimator AI";
const description =
  "Learn what BodyFatEstimator is, how our AI-based body fat estimation works, its limitations, and how to use it responsibly for fitness tracking.";

export const metadata: Metadata = {
  title,
  description,
};

export default function AboutPage() {
  return (
    <>
      <div className="hero min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center mt-40 lg:mt-10 gap-10 px-4">

          <h1 className="text-3xl lg:text-4xl font-bold text-center">
            About BodyFatEstimator
          </h1>

          <div className="prose prose-invert max-w-3xl text-center lg:text-left">
            <p className="text-lg">
              BodyFatEstimator is a free online tool designed to help people get a
              quick, visual estimate of their body fat percentage using a single photo.
              The goal is simple: make body composition tracking more accessible,
              private, and practical for everyday fitness use.
            </p>

            <h2>Why this tool exists</h2>
            <p className="text-lg">
              Tracking body fat is useful for understanding physical changes that
              scale weight alone can’t explain. However, traditional methods like
              DEXA scans are expensive, inconvenient, and impractical for frequent use.
              BodyFatEstimator exists as a lightweight alternative for people who want
              to track trends over time without appointments, devices, or subscriptions.
            </p>

            <h2>How the estimate works (high level)</h2>
            <p className="text-lg">
              The estimator analyzes visual cues from an uploaded photo — such as body
              proportions, fat distribution patterns, and surface features — to produce
              an approximate body fat range. Results are generated automatically and are
              intended for general fitness tracking, not medical evaluation.
            </p>

            <p className="text-lg">
              Like all visual-based estimates, results are influenced by photo quality,
              lighting, camera angle, posture, clothing, and individual body structure.
              For best results, users should take consistent photos under similar
              conditions each time.
            </p>

            <h2>Accuracy and limitations</h2>
            <p className="text-lg">
              BodyFatEstimator provides a directional estimate, not a precise measurement.
              It is not a substitute for clinical methods or professional medical advice.
              The tool is best used to observe relative changes over time rather than to
              determine an exact body fat percentage on a single day.
            </p>

            <ul className="text-lg">
              <li>Not intended for medical diagnosis</li>
              <li>Accuracy varies with photo quality and consistency</li>
              <li>Most useful for tracking trends, not single data points</li>
            </ul>

            <h2>Privacy</h2>
            <p className="text-lg">
              Privacy matters. Uploaded photos are used solely to generate an estimate.
              Users should only upload photos they are comfortable sharing with a
              computer system. No guarantees are made beyond the technical requirements
              of operating the service.
            </p>

            <h2>Who should use this tool</h2>
            <ul className="text-lg">
              <li>People tracking fitness or weight loss progress</li>
              <li>Users who want a quick, private estimate at home</li>
              <li>Those looking for an alternative to frequent lab-based scans</li>
            </ul>

            <h2>Who should not rely on this tool</h2>
            <ul className="text-lg">
              <li>Anyone seeking medical or clinical body composition analysis</li>
              <li>Individuals requiring high-precision measurements</li>
            </ul>

            {/* 👤 Creator section — YMYL trust signal */}
            <h2>About the creator</h2>

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

                <a
                  href="https://www.linkedin.com/in/matt-phelps/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-primary underline"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            <h2>Contact</h2>
            <p className="text-lg">
              Have questions, feedback, or need assistance? You can reach us at{" "}
              <a
                href="mailto:matt@leandme.com"
                className="text-primary"
              >
                matt@leandme.com
              </a>.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
