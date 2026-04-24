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

function formatBodyShapeLabel(label: string) {
  return label
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

type Props = {
  estimate: number | null;
  loading: boolean;
  error: string | null;
  gender?: Gender;
  bodyShapeLabel?: string | null;
  accuracy?: Accuracy;
  onDownloadResults?: () => void;
  downloadingResults?: boolean;
  compactGauge?: boolean;
  showActions?: boolean;
  estimateAgainHref?: "/" | "/estimate";
};

export default function EstimatePanel({
  estimate,
  loading,
  error,
  gender = "male",
  bodyShapeLabel = null,
  accuracy = "low",
  onDownloadResults,
  downloadingResults = false,
  compactGauge = false,
  showActions = true,
  estimateAgainHref = "/estimate",
}: Props) {
  const p = !loading && typeof estimate === "number" ? estimate : null;
  const canShowDownload = !loading && p !== null && !error && !!onDownloadResults;
  const normalizedBodyShapeLabel = bodyShapeLabel
    ? formatBodyShapeLabel(bodyShapeLabel)
    : null;

  const categoryLabel =
    p !== null
      ? gender === "female"
        ? getCategoryFemale(p)
        : getCategoryMale(p)
      : null;

  // (unused previously) remove gaugeValue to avoid lint/TS warnings
  // const gaugeValue = loading ? "..." : p !== null ? String(p) : error ? "Error" : "...";

  return (
    <div className="flex-1 w-full px-3 sm:px-4 lg:pl-8">
      <div className={`mx-auto text-center ${compactGauge ? "max-w-[23rem]" : "max-w-md"}`}>
        <div
          className={`sm:-mt-4 flex items-center justify-center ${
            compactGauge ? "min-h-[228px] sm:min-h-[240px]" : "min-h-[176px] sm:min-h-[220px]"
          }`}
        >
          {loading ? (
            <LoadingStatus />
          ) : error ? (
            <div className="text-center">
              <div className="text-6xl mb-2">🤦</div>
              <p className="text-red-500 text-lg whitespace-pre-line">{error}</p>
            </div>
          ) : p !== null ? (
            <EstimateGauge estimate={String(p)} compact={compactGauge} />
          ) : null}
        </div>

        {/* Pills row (Category + Accuracy) */}
        {!loading && p !== null && !error && (
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-sm sm:text-base font-semibold text-gray-800">
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

            {normalizedBodyShapeLabel ? (
              <div className="flex items-center gap-2">
                <span className="font-semibold">Body Shape:</span>

                <a
                  href="#body-shape"
                  className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800 no-underline cursor-pointer
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                  aria-label={`Jump to body shape section. Body shape is ${normalizedBodyShapeLabel}`}
                >
                  {normalizedBodyShapeLabel}
                </a>
              </div>
            ) : null}

            {/* Accuracy */}
            <div className="flex items-center gap-2">
              <span className="font-semibold">Accuracy:</span>

              <a
                href="#increase-accuracy"
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold no-underline cursor-pointer
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2
                            ${accuracyStyles(accuracy)}`}
                title="Photo-based estimates vary with lighting, pose, distance, and clothing."
                aria-label={`Jump to increase estimate accuracy section. Accuracy is ${accuracy}`}
              >
                {accuracy.toUpperCase()}
              </a>
            </div>
          </div>
        )}

        {!loading && showActions && (
          <div className="mt-6 sm:mt-8 flex flex-col gap-3">
            {canShowDownload && (
              <button
                type="button"
                className="btn btn-primary btn-lg w-full text-white"
                onClick={onDownloadResults}
                disabled={downloadingResults}
              >
                <span className="whitespace-nowrap">
                  {downloadingResults ? "Preparing Image..." : "Download Image"}
                </span>
              </button>
            )}

            <a
              href={estimateAgainHref}
              onClick={() =>
                trackEvent("Go to Tool", { tool: "body fat estimator", location: "estimate panel cta" })
              }
              className="btn btn-outline btn-lg w-full"
            >
              <span className="whitespace-nowrap">Estimate Again</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
