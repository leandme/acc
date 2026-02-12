"use client";

import { getCategoryMale, getCategoryFemale } from "@/app/libs/estimateUtils";
import { trackEvent } from "@/app/libs/amplitude";
import EstimateGauge from "./estimate-gauge";
import LoadingStatus from "@/app/components/common/loading-status";

type Accuracy = "low" | "medium" | "high";
type Gender = "male" | "female";

function accuracyStyles(level: Accuracy) {
  switch (level) {
    case "high":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
    default:
      return "bg-red-100 text-red-800";
  }
}

type Props = {
  estimate: number | null;
  loading: boolean;
  error: string | null;
  gender?: Gender;
  accuracy?: Accuracy;
};

export default function EstimatePanel({
  estimate,
  loading,
  error,
  gender = "male",
  accuracy = "low",
}: Props) {
  const p = !loading && typeof estimate === "number" ? estimate : null;

  const categoryLabel =
    p !== null
      ? gender === "female"
        ? getCategoryFemale(p)
        : getCategoryMale(p)
      : null;

  // (unused previously) remove gaugeValue to avoid lint/TS warnings
  // const gaugeValue = loading ? "..." : p !== null ? String(p) : error ? "Error" : "...";

  return (
    <div className="flex-1 px-4 lg:pl-8">
      <div className="text-center max-w-md">
        <div className="sm:-mt-4 min-h-[220px] flex items-center justify-center">
          {loading ? (
            <LoadingStatus />
          ) : error ? (
            <div className="text-center">
              <div className="text-6xl mb-2">🤦</div>
              <p className="text-red-500 text-lg whitespace-pre-line">{error}</p>
            </div>
          ) : p !== null ? (
            <EstimateGauge estimate={String(p)} />
          ) : null}
        </div>

        {/* Pills row (Category + Accuracy) */}
        {!loading && p !== null && !error && (
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-gray-800">
            {/* Category */}
            <div className="flex items-center gap-2">
              <span className="font-semibold">Category:</span>

              <a
                href="#where-you-sit"
                className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800 no-underline cursor-pointer
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                aria-label={`Jump to where you sit section for category ${
                  categoryLabel ?? "unknown"
                }`}
              >
                {categoryLabel ?? "—"}
              </a>
            </div>

            {/* Accuracy */}
            <div className="flex items-center gap-2">
              <span className="font-semibold">Accuracy:</span>

              <a
                href="#accuracy"
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold no-underline cursor-pointer
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2
                            ${accuracyStyles(accuracy)}`}
                title="Photo-based estimates vary with lighting, pose, distance, and clothing."
                aria-label={`Jump to accuracy section. Accuracy is ${accuracy}`}
              >
                {accuracy.toUpperCase()}
              </a>
            </div>
          </div>
        )}

        {!loading && (
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-4 flex-1">
              <a
                href="/estimate"
                onClick={() =>
                  trackEvent("Go to Estimate", { location: "estimate panel cta" })
                }
                className="btn btn-outline btn-lg w-full"
              >
                <span className="whitespace-nowrap">Estimate Again</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
