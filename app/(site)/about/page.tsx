import { Metadata } from "next";
import H1 from "@/app/components/common/h1";
import Author from "@/app/components/common/author";
import { buildPageMetadata } from "@/app/libs/seo";

const title = "About";
const description =
  "Learn what AI Calorie Counter is, how photo-based calorie estimation works, key accuracy limitations, and how to use it for practical meal tracking.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  canonical: "https://ai-calorie-counter.com/about",
});

export default function AboutPage() {
  return (
    <>
      <div className="hero min-h-screen flex mt-10 items-center justify-center">
        <div className="flex flex-col items-center gap-10 px-4">

          <H1>About</H1>

          <div className="prose prose-invert max-w-3xl text-center lg:text-left">
            <p className="text-lg">
              AI Calorie Counter is a free online tool that estimates calories from a food photo.
              It is built for fast meal logging when you want practical calorie guidance without
              manually searching every ingredient.
            </p>

            <h2>Why this tool exists</h2>
            <p className="text-lg">
              Calorie tracking is useful, but manual logging is often slow and inconsistent.
              AI Calorie Counter exists to make that process simpler: upload a food photo, get a
              directional estimate, and use the result to make better day-to-day nutrition choices.
            </p>

            <h2>How the estimate works (high level)</h2>
            <p className="text-lg">
              The model analyzes visible foods, likely ingredients, portion size cues, and meal
              density. It then estimates total calories, a practical calorie range, and a macro
              split (protein, carbs, and fat) where possible.
            </p>

            <p className="text-lg">
              Results are strongest when the whole meal is visible in bright, even lighting.
              Including sides, sauces, and drinks improves estimate quality.
            </p>

            <h2>Accuracy and limitations</h2>
            <p className="text-lg">
              AI Calorie Counter provides a directional estimate, not a lab-verified
              measurement. It is most useful for consistent tracking and trend awareness,
              not exact precision on a single meal.
            </p>

            <ul className="text-lg">
              <li>Not intended for medical or dietetic diagnosis</li>
              <li>Accuracy varies with photo quality, angle, and hidden ingredients</li>
              <li>Best used for repeatable meal tracking over time</li>
            </ul>

            <h2>Privacy</h2>
            <p className="text-lg">
              Privacy matters. Uploaded images are processed to generate your estimate.
              We do not sell your images, and we aim to minimize retained data as part of
              normal service operation.
            </p>

            <h2>Who should use this tool</h2>
            <ul className="text-lg">
              <li>People who want faster meal calorie tracking</li>
              <li>Users building awareness of eating patterns and portions</li>
              <li>Anyone wanting a free photo-based calorie estimate workflow</li>
            </ul>

            <h2>Who should not rely on this tool</h2>
            <ul className="text-lg">
              <li>Anyone requiring medical-grade nutrition measurement</li>
              <li>Users who need exact gram-level macro accounting for clinical reasons</li>
            </ul>

            {/* 👤 Creator section — YMYL trust signal */}
            <h2 id="founder">About the Founder</h2>

            <Author />

            <h2>Contact</h2>
            <p className="text-lg mb-12">
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
