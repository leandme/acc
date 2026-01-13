"use client";

import { trackEvent } from "@/app/libs/amplitude";

export default function BodyShapePanel({
  shape,
  loading,
  error,
}: {
  shape: string;
  loading: boolean;
  error: string | null;
}) {
  const pretty = (s: string) => (s || "").trim();

  return (
    <div className="flex-1 px-4 lg:pl-8">
      <div className="text-center lg:text-left max-w-md">
        <h2 className="text-base font-semibold mb-3">Your Body Shape:</h2>

        <div className="flex items-baseline justify-center lg:justify-start gap-2">
          <p className="text-4xl sm:text-5xl font-extrabold text-secondary">
            {loading ? "Analyzing..." : pretty(shape)}
          </p>
        </div>

        {!loading && shape === "Error" && (
          <p className="text-red-500 text-sm mt-3">
            Something went wrong{error ? `: ${error}` : ""}. Try another image.
          </p>
        )}

        {!loading && shape !== "Error" && shape !== "..." && (
          <p className="text-sm text-gray-600 mt-3">
            This is a best-effort classification from a single photo. Lighting, pose, and clothing can affect results.
          </p>
        )}

        {!loading && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4 mt-8">
            <div className="flex flex-col gap-1 flex-1">
              <a
                href="/pricing"
                onClick={() =>
                  trackEvent("Go to Pricing", { location: "body shape panel cta" })
                }
                className="btn btn-primary btn-lg text-white w-full"
              >
                <span className="whitespace-nowrap">Upgrade Accuracy →</span>
              </a>

              <p className="text-xs text-gray-600 font-medium mt-1">
                🎯 use multiple photos for higher accuracy
              </p>
            </div>

            <div className="flex flex-col flex-1">
              <a
                href="/body-shape-analyzer"
                onClick={() =>
                  trackEvent("Analyze Body Shape Again", { location: "body shape panel cta" })
                }
                className="btn btn-outline btn-lg w-full"
              >
                <span className="whitespace-nowrap">Analyze Again</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
