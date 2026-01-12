"use client";
import { parsePercent, getCategory, getRange } from "@/app/libs/estimateUtils";
import ConfidenceBand from "@/app/components/ConfidenceBand";
import { trackEvent } from "../libs/amplitude";

export default function EstimatePanel({
  estimate,
  loading,
  error,
}: {
  estimate: string;
  loading: boolean;
  error: string | null;
}) {
  const p = !loading && estimate !== "Error" ? parsePercent(estimate) : null;
  const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
  const toPct = (value: number, min: number, max: number) => {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * 100;
};

  return (
    <div className="flex-1 px-4 lg:pl-8">
      <div className="text-center lg:text-left max-w-md">
        <h2 className="text-base font-semibold mb-3">Your Body Fat Estimate:</h2>

        <div className="flex items-baseline justify-center lg:justify-start gap-2">
          <p className="text-5xl font-extrabold text-secondary">
            {loading ? "Estimating..." : estimate}
          </p>
        </div>

        {!loading && estimate !== "Error" && p != null && (() => {
          const { low, high } = getRange(p);
          const min = low;
          const max = high;

          // if you want the marker clamped inside the band:
          const value = clamp(p, min, max);

          // positions for marker + highlighted band
          const markerLeft = toPct(value, min, max);
          const bandLeft = toPct(low, min, max);   // will be 0
          const bandRight = toPct(high, min, max); // will be 100

          return (
            <div className="mt-3 space-y-2">

              <ConfidenceBand estimate={p} low={low} high={high} />
              

            </div>
          );
        })()}

        {estimate === "Error" && (
          <p className="text-red-500 text-sm mt-3">
            Something went wrong{error ? `: ${error}` : ""}. Try another image.
          </p>
        )}

        {!loading && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4 mt-8">
  {/* Primary CTA + helper */}
  <div className="flex flex-col gap-1 flex-1">
          <a
        href="/pricing"
        onClick={() =>
          trackEvent("Go to Pricing", { location: "estimate panel cta" })
        }
        className="btn btn-primary btn-lg text-white w-full"
      >
        <span className="whitespace-nowrap">Upgrade Accuracy →</span>
      </a>


    <p className="text-xs text-gray-600 font-medium mt-1">
      🎯 use multiple photos for high accuracy
    </p>
  </div>

  {/* Secondary CTA */}
  <div className="flex flex-col flex-1">
    <a href="/upload"
    onClick={() =>
          trackEvent("Estimate Again", { location: "estimate panel cta" })
        }
     className="btn btn-outline btn-lg w-full">
      <span className="whitespace-nowrap">Estimate Again</span>
    </a>
  </div>
</div>


        )}
      </div>
    </div>
  );
}
