"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useSearchParams } from "next/navigation";
import { toBlob as toImageBlob } from "html-to-image";
import EstimatePanel from "@/app/components/tools/composition/body-fat-estimator/estimate-panel";
import { useBodyFatEstimate } from "@/app/hooks/useBodyFatEstimate";
import { useBodyFatEstimateRefine } from "@/app/hooks/useBodyFatEstimateRefine";
import EstimateWhereYouSit from "@/app/components/tools/composition/body-fat-estimator/estimate-where-you-sit";
import EstimateBodyFatLooksLike from "@/app/components/tools/composition/body-fat-estimator/estimate-body-fat-looks-like";
import EstimateAccuracy from "@/app/components/tools/composition/body-fat-estimator/estimate-accuracy";
import EstimateRationale from "@/app/components/tools/composition/body-fat-estimator/estimate-rationale";
import EstimateRefineInline from "@/app/components/tools/composition/body-fat-estimator/estimate-refine-inline";
import EstimateExportCard from "@/app/components/tools/composition/body-fat-estimator/estimate-export-card";
import EstimateCompositionSnapshot from "@/app/components/tools/composition/body-fat-estimator/estimate-composition-snapshot";
import LoadingStatus from "@/app/components/common/loading-status";
import { getCategoryFemale, getCategoryMale } from "@/app/libs/estimateUtils";
import { showErrorToast, showSuccessToast } from "@/app/libs/toast";
import { trackEvent } from "@/app/libs/amplitude";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import Hero from "@/app/components/home/hero";

type Gender = "male" | "female";
type EstimateSource = "example" | "upload";
type Accuracy = "low" | "medium" | "high";
type Units = "metric" | "imperial";

// 9:16 portrait ratio (social-story friendly)
const CARD_EXPORT_WIDTH = 1080;
const CARD_EXPORT_HEIGHT = 1920;

type EstimatePageContentProps = {
  basePath?: "/" | "/estimate";
};

function EstimatePageContent({ basePath }: EstimatePageContentProps) {
  const pathname = usePathname();
  const resolvedBasePath = basePath ?? (pathname === "/" ? "/" : "/estimate");
  const searchParams = useSearchParams();

  const sourceParam = searchParams.get("source");
  const estimateSource: EstimateSource =
    sourceParam === "example" ? "example" : "upload";

  const imageUrl = searchParams.get("imageUrl");

  // initial estimate
  const initial = useBodyFatEstimate(imageUrl, { source: estimateSource });

  // refine estimate hook
  const refine = useBodyFatEstimateRefine();

  const gender: Gender =
    initial.estimate?.perceivedGender === "female" ? "female" : "male";

  const bodyFat = initial.estimate?.bodyFat ?? null;
  const accuracy = initial.estimate?.accuracy ?? "low";
  const improvements = initial.estimate?.improve ?? null;
  const rationale = initial.estimate?.rationale ?? null;

  const [showRefine, setShowRefine] = useState(false);
  const [downloadingImage, setDownloadingImage] = useState(false);
  const [analysisUnits, setAnalysisUnits] = useState<Units>("imperial");
  const [analysisWeight, setAnalysisWeight] = useState<number | null>(null);
  const [analysisAutofilledFromRefine, setAnalysisAutofilledFromRefine] = useState(false);
  const refineRef = useRef<HTMLDivElement | null>(null);
  const exportCardRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");

  // If refine has started (loading/estimate/error), always use it for the top panel.
  const refineIsActive = refine.loading || !!refine.estimate || !!refine.error;
  const activeEstimate = refineIsActive ? refine : initial;
  const active = activeEstimate.estimate;

  const activeBodyFat = active?.bodyFat ?? bodyFat;
  const activeAccuracy = active?.accuracy ?? accuracy;
  const activeRationale = active?.rationale ?? rationale;
  const activeImprovements = active?.improve ?? improvements;
  const normalizedActiveAccuracy: Accuracy =
    activeAccuracy === "high" || activeAccuracy === "medium" ? activeAccuracy : "low";

  // gender should come from active estimate if present, else initial
  const activeGender: Gender =
    active?.perceivedGender === "female" ? "female" : gender;
  const activeCategory =
    typeof activeBodyFat === "number"
      ? activeGender === "female"
        ? getCategoryFemale(activeBodyFat)
        : getCategoryMale(activeBodyFat)
      : null;
  const isAnalyzing = activeEstimate.loading;
  const generatedAtLabel = `Estimated ${new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })}`;

  async function downloadResultsImage(
    location: "estimate cta" | "estimate mobile cta" = "estimate cta"
  ) {
    if (downloadingImage) return;

    if (!imageUrl || typeof activeBodyFat !== "number") {
      showErrorToast("Your estimate is still loading. Try again in a moment.");
      return;
    }

    trackEvent("Download File", {
      "file type": "image",
      tool: "body fat estimator",
      "download type": refineIsActive ? "refined estimate" : "standard estimate",
      location,
    });

    setDownloadingImage(true);
    try {
      const exportCardNode = exportCardRef.current;
      if (!exportCardNode) {
        throw new Error("Export card is not ready");
      }

      if (document.fonts) {
        await document.fonts.ready;
      }

      const blob = await toImageBlob(exportCardNode, {
        cacheBust: true,
        pixelRatio: 1,
        width: CARD_EXPORT_WIDTH,
        height: CARD_EXPORT_HEIGHT,
        canvasWidth: CARD_EXPORT_WIDTH,
        canvasHeight: CARD_EXPORT_HEIGHT,
        skipAutoScale: true,
      });
      if (!blob) throw new Error("Could not generate image blob");

      const fileName = `body-fat-estimate-${new Date().toISOString().slice(0, 10)}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      const canShareFile =
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (isMobile && canShareFile) {
        try {
          await navigator.share({
            files: [file],
            title: "Body Fat Estimate",
            text: "Generated with bodyfatestimator.ai",
          });
          trackEvent("Result Image Shared", {
            tool: "body fat estimator",
            location,
            accuracy: normalizedActiveAccuracy,
          });
          showSuccessToast("Share sheet opened. Save it to Photos or Files.");
          return;
        } catch (err) {
          if (err instanceof DOMException && err.name === "AbortError") {
            return;
          }
        }
      }

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

      trackEvent("Result Image Downloaded", {
        tool: "body fat estimator",
        location,
        accuracy: normalizedActiveAccuracy,
      });
      showSuccessToast(
        isMobile ? "Image saved to Photos." : "Image saved to Downloads."
      );
    } catch (err) {
      console.error("Failed to export result image", err);
      showErrorToast(
        "Could not generate the image. If this was pasted from a URL, upload the file directly and try again."
      );
    } finally {
      setDownloadingImage(false);
    }
  }

  // scroll to refine block when it opens
  useEffect(() => {
    if (!showRefine) return;
    const t = window.setTimeout(() => {
      refineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    return () => window.clearTimeout(t);
  }, [showRefine]);

  if (!imageUrl) {
    return (
      <div className="mt-0">
        <Hero basePath={resolvedBasePath} />
        <div className="w-full max-w-3xl mx-auto pt-4 pb-10 lg:pt-8 lg:pb-16">
          <EstimateWhereYouSit
            title="What Your Body Fat % Means"
            gender="male"
          />
        </div>
        <div className="w-full max-w-5xl mx-auto pt-6 pb-12 lg:pt-12 lg:pb-20">
          <EstimateBodyFatLooksLike />
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center justify-start min-h-screen">
      {isAnalyzing ? (
        <div className="w-full max-w-none px-4 pt-4 sm:px-6 sm:pt-6 lg:max-w-5xl lg:px-8 lg:pt-10">
          <LoadingStatus imageUrl={imageUrl} />
        </div>
      ) : (
        <>
          <div className="w-full max-w-none px-0 sm:px-4 lg:max-w-5xl lg:px-8 lg:mt-10 min-h-[calc(100svh-5.5rem)] md:min-h-0 flex items-center md:block">
            <div className="mx-auto w-full max-w-md lg:max-w-none">
              <div className="flex flex-col items-center gap-3 lg:grid lg:grid-cols-[360px_1fr] lg:gap-16 lg:items-start lg:justify-items-start">
                <div className="w-full max-w-[min(88vw,20.5rem)] sm:max-w-[min(76vw,21.5rem)] lg:max-w-none lg:w-[360px]">
                <img
                  src={imageUrl}
                  alt="Uploaded image"
                  className="w-full mx-auto rounded-2xl shadow-xl object-cover aspect-[3/4] bg-base-200"
                />
                </div>

                <div className="w-full max-w-[min(92vw,23.5rem)] lg:max-w-none lg:pt-2">
                  <EstimatePanel
                    estimate={activeBodyFat}
                    loading={activeEstimate.loading}
                    error={activeEstimate.error}
                    gender={activeGender}
                    accuracy={normalizedActiveAccuracy}
                    onDownloadResults={() => downloadResultsImage("estimate cta")}
                    downloadingResults={downloadingImage}
                    compactGauge={isMobile}
                    showActions={!isMobile}
                    estimateAgainHref={resolvedBasePath}
                  />
                </div>
              </div>
            </div>
          </div>

          {isMobile && (
            <div className="w-full max-w-md px-3 sm:px-4 mt-8 sm:mt-10">
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  className="btn btn-primary btn-lg w-full text-white"
                  onClick={() => downloadResultsImage("estimate mobile cta")}
                  disabled={downloadingImage || typeof activeBodyFat !== "number"}
                >
                  <span className="whitespace-nowrap">
                    {downloadingImage ? "Preparing Image..." : "Save Image"}
                  </span>
                </button>

                <a
                  href={resolvedBasePath}
                  onClick={() =>
                    trackEvent("Go to Tool", {
                      tool: "body fat estimator",
                      location: "estimate page mobile actions",
                    })
                  }
                  className="btn btn-outline btn-lg w-full"
                >
                  <span className="whitespace-nowrap">Estimate Again</span>
                </a>
              </div>
            </div>
          )}
        </>
      )}

      {!isAnalyzing && typeof activeBodyFat === "number" && (
        <div className="fixed left-[-10000px] top-[-10000px] pointer-events-none" aria-hidden="true">
          <EstimateExportCard
            ref={exportCardRef}
            imageUrl={imageUrl}
            estimate={activeBodyFat}
            category={activeCategory ?? "UNKNOWN"}
            accuracy={normalizedActiveAccuracy}
            generatedAtLabel={generatedAtLabel}
          />
        </div>
      )}

      {!isAnalyzing && (
        <>
          <div id="where-you-sit" className="w-full max-w-3xl pt-14 pb-10 lg:pt-24 lg:pb-20">
            <EstimateWhereYouSit
              estimate={activeBodyFat}
              gender={activeGender}
              rationale={activeRationale}
            />
          </div>

          <div id="what-it-looks-like" className="w-full max-w-5xl pt-6 pb-10 lg:pt-12 lg:pb-20">
            <EstimateBodyFatLooksLike estimate={activeBodyFat} />
          </div>

          <div id="rationale" className="w-full max-w-3xl pt-10 pb-10 lg:pt-20 lg:pb-20">
            <EstimateRationale estimate={activeBodyFat} rationale={activeRationale} />
          </div>

          <div id="current-snapshot" className="w-full max-w-3xl pt-10 pb-10 lg:pt-20 lg:pb-20">
            <EstimateCompositionSnapshot
              bodyFat={activeBodyFat}
              gender={activeGender}
              units={analysisUnits}
              weight={analysisWeight}
              prefilledFromRefine={analysisAutofilledFromRefine}
              onUnitsChange={(nextUnits) => {
                setAnalysisWeight((previousWeight) => {
                  if (previousWeight === null) return null;
                  if (nextUnits === analysisUnits) return previousWeight;
                  if (nextUnits === "metric") {
                    return Number((previousWeight * 0.45359237).toFixed(1));
                  }
                  return Number((previousWeight / 0.45359237).toFixed(1));
                });
                setAnalysisUnits(nextUnits);
                setAnalysisAutofilledFromRefine(false);
              }}
              onWeightChange={(nextWeight) => {
                setAnalysisWeight(nextWeight);
                setAnalysisAutofilledFromRefine(false);
              }}
            />
          </div>

          <div id="accuracy" className="w-full max-w-3xl pt-10 pb-10 lg:pt-20 lg:pb-20">
            <EstimateAccuracy
              accuracy={normalizedActiveAccuracy}
              improvements={activeImprovements}
              onImproveAccuracy={() => setShowRefine(true)}
              improveCtaLabel="Improve Accuracy →"
            />
          </div>

          {showRefine && (
            <div ref={refineRef} className="w-full max-w-3xl pt-10 pb-10 lg:pt-20 lg:pb-20">
              <EstimateRefineInline
                initialImageUrl={imageUrl}
                onRefine={(payload) => {
                  if (!imageUrl) return;

                  setShowRefine(true);
                  setAnalysisUnits(payload.units);
                  setAnalysisWeight(payload.weight);
                  setAnalysisAutofilledFromRefine(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });

                  refine.refine({
                    imageUrl,
                    units: payload.units,
                    age: payload.age,
                    height: payload.height,
                    weight: payload.weight,
                    waist: payload.waist ?? null,
                    extraImageFiles: payload.extraImages,
                  });
                }}
              />
            </div>
          )}

        </>
      )}
    </section>
  );
}

const EstimatePageClient = dynamic(() => Promise.resolve(EstimatePageContent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  ),
});

export default EstimatePageClient;
