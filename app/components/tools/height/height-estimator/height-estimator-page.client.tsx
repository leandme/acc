"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import H1 from "@/app/components/common/h1";
import TryExamples from "@/app/components/common/try-examples";
import EstimateDropZone from "@/app/components/tools/composition/body-fat-estimator/estimate-drop-zone";
import { MoreTools } from "../../template/more-tools";
import { cmToIn, formatFeetInches, round } from "@/app/components/tools/body-weight/shared/math";
import HeightEstimatorInterpretation from "@/app/components/tools/height/height-estimator/height-estimator-interpretation";
import { useHeightEstimate } from "@/app/hooks/useHeightEstimate";

function confidenceBadgeClass(confidence: "low" | "medium" | "high") {
  if (confidence === "high") return "bg-green-100 text-green-800 border-green-200";
  if (confidence === "low") return "bg-red-100 text-red-800 border-red-200";
  return "bg-yellow-100 text-yellow-800 border-yellow-200";
}

function heightBandLabel(key: string) {
  if (key === "very_short") return "Very Short Band";
  if (key === "short") return "Short Band";
  if (key === "average") return "Average Band";
  if (key === "tall") return "Tall Band";
  if (key === "very_tall") return "Very Tall Band";
  return "Unknown Band";
}

function perceivedGenderLabel(gender: "male" | "female" | "unknown") {
  if (gender === "male") return "Male (visual)";
  if (gender === "female") return "Female (visual)";
  return "Unknown / unclear";
}

function HeightEstimatorPageContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const source = searchParams.get("source") === "example" ? "example" : "upload";
  const { estimate, loading, error } = useHeightEstimate(imageUrl, { source });

  const estimatedHeightFeetInches = useMemo(() => {
    if (estimate?.estimatedHeightCm == null) return null;
    return formatFeetInches(cmToIn(estimate.estimatedHeightCm));
  }, [estimate?.estimatedHeightCm]);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10 px-6">
        <H1>Estimate Height from a Photo</H1>
        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Upload a full-body photo to estimate apparent height with a confidence rating, estimated range,
          and practical accuracy guidance.
        </p>

        {!imageUrl ? (
          <div className="w-full max-w-2xl mt-10 flex flex-col items-center">
            <div className="w-full max-w-md">
              <EstimateDropZone basePath="/height-estimator" buttonLabel="Upload Full-Body Photo" />
            </div>
            <div className="w-full max-w-lg mt-6 lg:max-w-xl">
              <TryExamples basePath="/height-estimator" />
            </div>
            <p className="mt-6 text-sm text-gray-600 max-w-md text-center">
              Best results come from a full-body standing photo with camera distance, minimal tilt, and
              visible shoes/ground context.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-5xl mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-16 items-start">
              <div className="w-full sm:max-w-sm lg:max-w-none justify-self-center">
                <img
                  src={imageUrl}
                  alt="Uploaded image for height estimation"
                  className="w-full max-w-[95vw] sm:max-w-sm lg:w-[360px] mx-auto rounded-2xl shadow-xl object-cover aspect-[3/4] bg-base-200"
                />
              </div>

              <div className="w-full rounded-2xl border bg-white p-6 lg:p-8 shadow-sm">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">Estimated Height</h2>

                {loading ? (
                  <p className="mt-4 text-lg text-gray-700">
                    Analyzing body proportions, perspective, and visual scale cues...
                  </p>
                ) : null}

                {error ? (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="whitespace-pre-line text-red-700">{error}</p>
                  </div>
                ) : null}

                {!loading && !error && estimate ? (
                  <div className="mt-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-4xl lg:text-5xl font-bold text-primary">
                        {estimate.estimatedHeightCm != null
                          ? `${round(estimate.estimatedHeightCm, 1)} cm`
                          : "—"}
                      </p>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${confidenceBadgeClass(
                          estimate.confidence
                        )}`}
                      >
                        {estimate.confidence.toUpperCase()} confidence
                      </span>
                    </div>

                    {estimatedHeightFeetInches ? (
                      <p className="mt-2 text-lg text-gray-700">{estimatedHeightFeetInches}</p>
                    ) : null}

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-xl bg-base-200/60 p-3">
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Estimated range</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {estimate.rangeMinCm != null && estimate.rangeMaxCm != null
                            ? `${round(estimate.rangeMinCm, 1)}-${round(estimate.rangeMaxCm, 1)} cm`
                            : "Range unavailable"}
                        </p>
                      </div>
                      <div className="rounded-xl bg-base-200/60 p-3">
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Likely height band</p>
                        <p className="text-lg font-semibold text-gray-900">{heightBandLabel(estimate.likelyBand)}</p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-gray-600">
                      Visual profile:{" "}
                      <span className="font-semibold text-gray-800">
                        {perceivedGenderLabel(estimate.perceivedGender)}
                      </span>
                    </p>

                    {estimate.rationale ? (
                      <p className="mt-5 text-gray-700 leading-relaxed">{estimate.rationale}</p>
                    ) : null}

                    {estimate.keyCues.length ? (
                      <div className="mt-5">
                        <h3 className="font-semibold text-gray-900">Model cues used</h3>
                        <ul className="mt-2 list-disc pl-6 text-gray-700 space-y-1">
                          {estimate.keyCues.map((cue, idx) => (
                            <li key={`${cue}-${idx}`}>{cue}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="px-6">
        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40" id="height-estimator-interpretation">
          <HeightEstimatorInterpretation estimatedHeightCm={estimate?.estimatedHeightCm ?? null} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How This Height Estimator Works</h2>
          <p className={pClass}>
            This tool estimates apparent adult height from one image by combining visual proportion signals
            with scene context and camera perspective cues. It returns an estimated height, a plausible
            range, and a confidence rating so uncertainty is visible, not hidden.
          </p>
          <p className={pClass}>
            A single photo is an indirect input. Results should be interpreted as rough visual estimates for
            planning and comparison, not exact measurement.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Improve Accuracy</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            {(estimate?.improvements?.length
              ? estimate.improvements
              : [
                  "Use a full-body standing photo from head to feet.",
                  "Keep camera farther back to reduce perspective distortion.",
                  "Avoid top-down and wide-angle close-up shots.",
                  "Stand next to a known-height reference object when possible.",
                  "Use even lighting and minimal pose asymmetry.",
                ]
            ).map((tip, idx) => (
              <li key={`${tip}-${idx}`}>{tip}</li>
            ))}
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use This With Other Height Tools</h2>
          <p className={pClass}>
            Photo-based height estimation is best used as an initial visual estimate. For family-based growth
            context and planning, compare with the{" "}
            <a className="text-primary underline" href="/height-calculator">
              Height Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/mid-parental-height-calculator">
              Mid-Parental Height Calculator
            </a>
            .
          </p>
          <p className={pClass}>
            If your goal is weight-range planning after height estimation, continue with the{" "}
            <a className="text-primary underline" href="/ideal-weight-calculator">
              Ideal Weight Calculator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/bmi-calculator">
              BMI Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Limitations</h2>
          <p className={pClass}>
            Camera distance, lens type, tilt, footwear, and posture can change perceived body proportions
            substantially. Without a known-size reference object, this estimate has meaningful uncertainty.
          </p>
          <p className={pClass}>
            For precise height, direct measurement (stadiometer or wall-based measurement protocol) is the
            correct method. Use this page as directional context only.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              CDC adult body measurement context and population distributions:
              <a className="text-primary underline ml-1" href="https://www.cdc.gov/nchs/fastats/body-measurements.htm">
                CDC FastStats
              </a>
            </li>
            <li>
              WHO growth reference standards and height-for-age context:
              <a className="text-primary underline ml-1" href="https://www.who.int/tools/growth-reference-data-for-5to19-years">
                WHO Growth Reference Data
              </a>
            </li>
            <li>
              OpenCV camera geometry and calibration fundamentals used in image-based scale reasoning:
              <a className="text-primary underline ml-1" href="https://docs.opencv.org/4.x/d9/d0c/group__calib3d.html">
                OpenCV calib3d documentation
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <MoreTools
            heading="More Tools"
            columns={2}
            toolSlugs={[
              "height-calculator",
              "mid-parental-height-calculator",
              "ideal-weight-calculator",
              "bmi-calculator",
              "body-frame-size-calculator",
              "overweight-calculator",
              "weight-loss-calculator",
            ]}
            excludeSlug="height-estimator"
          />
        </div>
      </section>
    </main>
  );
}

const HeightEstimatorPageClient = dynamic(() => Promise.resolve(HeightEstimatorPageContent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  ),
});

export default HeightEstimatorPageClient;
