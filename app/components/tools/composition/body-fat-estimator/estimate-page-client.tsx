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
import EstimateRefineInline from "@/app/components/tools/composition/body-fat-estimator/estimate-refine-inline";
import EstimateExportCard from "@/app/components/tools/composition/body-fat-estimator/estimate-export-card";
import EstimateCompositionSnapshot from "@/app/components/tools/composition/body-fat-estimator/estimate-composition-snapshot";
import EstimateBodyShape from "@/app/components/tools/composition/body-fat-estimator/estimate-body-shape";
import LoadingStatus from "@/app/components/common/loading-status";
import HowBodyFatAiWorks from "@/app/components/home/how-body-fat-ai-works";
import { getCategoryFemale, getCategoryMale } from "@/app/libs/estimateUtils";
import { getBodyShapeCard, type BodyShapeKey } from "@/app/libs/body-shape";
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
  const bodyShape = initial.estimate?.bodyShape ?? null;
  const rationale = initial.estimate?.rationale ?? null;

  const [downloadingImage, setDownloadingImage] = useState(false);
  const [analysisUnits, setAnalysisUnits] = useState<Units>("imperial");
  const [analysisWeight, setAnalysisWeight] = useState<number | null>(null);
  const [analysisAutofilledFromRefine, setAnalysisAutofilledFromRefine] = useState(false);
  const [previewGender, setPreviewGender] = useState<Gender>("male");
  const [visitorCountryCode, setVisitorCountryCode] = useState<string | null>(null);
  const [refineAge, setRefineAge] = useState<number | null>(null);
  const [showBodyShapeSection, setShowBodyShapeSection] = useState(false);
  const exportCardRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");

  // If refine has started (loading/estimate/error), always use it for the top panel.
  const refineIsActive = refine.loading || !!refine.estimate || !!refine.error;
  const activeEstimate = refineIsActive ? refine : initial;
  const active = activeEstimate.estimate;

  const activeBodyFat = active?.bodyFat ?? bodyFat;
  const activeAccuracy = active?.accuracy ?? accuracy;
  const activeBodyShape: BodyShapeKey | null = active?.bodyShape ?? bodyShape;
  const activeRationale = active?.rationale ?? rationale;
  const activePerceivedAge =
    active?.perceivedAge ?? initial.estimate?.perceivedAge ?? null;
  const activeAgeForComparison = refineAge ?? activePerceivedAge;
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
  const activeBodyShapeCard = getBodyShapeCard(activeGender, activeBodyShape);
  const activeBodyShapeLabel = activeBodyShapeCard?.title ?? null;
  const isAnalyzing = activeEstimate.loading;
  const generatedAtLabel = `Estimated ${new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })}`;

  useEffect(() => {
    setShowBodyShapeSection(false);
  }, [activeBodyShapeLabel, imageUrl]);

  useEffect(() => {
    let cancelled = false;

    async function loadVisitorGeo() {
      try {
        const response = await fetch("/api/geo", { cache: "no-store" });
        if (!response.ok) return;

        const data = (await response.json()) as { countryCode?: string | null };
        const rawCode =
          typeof data.countryCode === "string" ? data.countryCode : null;
        const normalizedCode = rawCode?.trim().toUpperCase() ?? null;

        if (!cancelled && normalizedCode && /^[A-Z]{2}$/.test(normalizedCode)) {
          setVisitorCountryCode(normalizedCode);
        }
      } catch {
        // geo lookup is optional; we fall back gracefully
      }
    }

    loadVisitorGeo();

    return () => {
      cancelled = true;
    };
  }, []);

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

  if (!imageUrl) {
    const isHomepage = pathname === "/";

    return (
      <div className="mt-0">
        <Hero basePath={resolvedBasePath} />
        {isHomepage ? <HowBodyFatAiWorks /> : null}
        <div className="w-full max-w-3xl mx-auto pt-12 pb-10 lg:pt-16 lg:pb-16">
          <div className="mb-6 flex items-center justify-center">
            <div
              role="tablist"
              aria-label="Body fat ranges gender preview"
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1 shadow-sm"
            >
              <button
                type="button"
                role="tab"
                aria-selected={previewGender === "male"}
                onClick={() => setPreviewGender("male")}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  previewGender === "male"
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100",
                ].join(" ")}
              >
                MEN
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={previewGender === "female"}
                onClick={() => setPreviewGender("female")}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  previewGender === "female"
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100",
                ].join(" ")}
              >
                WOMEN
              </button>
            </div>
          </div>
          <EstimateWhereYouSit
            title="What Each Body Fat % Means"
            gender={previewGender}
          />
        </div>
        <div className="w-full max-w-5xl mx-auto pt-6 pb-12 lg:pt-12 lg:pb-20">
          <EstimateBodyFatLooksLike
            title="What Each Body Fat % Looks Like"
            gender={previewGender}
          />
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
                    bodyShapeLabel={activeBodyShapeLabel}
                    onBodyShapeClick={() => {
                      setShowBodyShapeSection(true);
                      window.setTimeout(() => {
                        document.getElementById("body-shape")?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 0);
                    }}
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
              age={activeAgeForComparison}
              countryCode={visitorCountryCode}
            />
          </div>

          <div id="what-it-looks-like" className="w-full max-w-5xl pt-6 pb-10 lg:pt-12 lg:pb-20">
            <EstimateBodyFatLooksLike
              estimate={activeBodyFat}
              gender={activeGender}
              rationale={activeRationale}
            />
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

          {activeBodyShape && showBodyShapeSection ? (
            <div id="body-shape" className="w-full max-w-5xl pt-6 pb-10 lg:pt-12 lg:pb-20">
              <EstimateBodyShape bodyShape={activeBodyShape} gender={activeGender} />
            </div>
          ) : null}

          <div id="increase-accuracy" className="w-full max-w-3xl pt-10 pb-10 lg:pt-20 lg:pb-20">
            <EstimateRefineInline
              initialImageUrl={imageUrl}
              onRefine={(payload) => {
                if (!imageUrl) return;

                setAnalysisUnits(payload.units);
                setAnalysisWeight(payload.weight);
                setAnalysisAutofilledFromRefine(true);
                setRefineAge(payload.age);
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
