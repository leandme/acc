"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import EstimateDropZone from "@/app/components/tools/composition/body-fat-estimator/estimate-drop-zone";
import TryExamples from "@/app/components/common/try-examples";
import EstimatePanel from "@/app/components/tools/composition/body-fat-estimator/estimate-panel";
import { useBodyFatEstimate } from "@/app/hooks/useBodyFatEstimate";
import { useBodyFatEstimateRefine } from "@/app/hooks/useBodyFatEstimateRefine";
import H1 from "@/app/components/common/h1";
import EstimateSeoExplainer from "@/app/components/tools/composition/body-fat-estimator/estimate-seo-explainer";
import EstimateWhereYouSit from "@/app/components/tools/composition/body-fat-estimator/estimate-where-you-sit";
import EstimateAccuracy from "@/app/components/tools/composition/body-fat-estimator/estimate-accuracy";
import EstimateRationale from "@/app/components/tools/composition/body-fat-estimator/estimate-rationale";
import EstimateRefineInline from "@/app/components/tools/composition/body-fat-estimator/estimate-refine-inline";

type Gender = "male" | "female";
type EstimateSource = "example" | "upload";

function EstimatePageContent() {
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
  const refineRef = useRef<HTMLDivElement | null>(null);

  // If refine has started (loading/estimate/error), always use it for the top panel.
  const refineIsActive = refine.loading || !!refine.estimate || !!refine.error;
  const activeEstimate = refineIsActive ? refine : initial;
  const active = activeEstimate.estimate;

  const activeBodyFat = active?.bodyFat ?? bodyFat;
  const activeAccuracy = active?.accuracy ?? accuracy;
  const activeRationale = active?.rationale ?? rationale;
  const activeImprovements = active?.improve ?? improvements;

  // gender should come from active estimate if present, else initial
  const activeGender: Gender =
    active?.perceivedGender === "female" ? "female" : gender;

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
      <div className="hero min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center mt-10 gap-6">
          <div className="text-center lg:text-left w-full max-w-md">
            <div className="mb-12">
              <H1>Estimate Your Body Fat %</H1>
            </div>
            <EstimateDropZone />
          </div>

          <div className="w-full max-w-lg mt-6 lg:max-w-xl">
            <TryExamples basePath="/estimate" />
          </div>

          <div className="mt-20">
            <EstimateSeoExplainer />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center justify-start min-h-screen">
      <div className="w-full max-w-none px-0 sm:px-4 lg:max-w-5xl lg:px-8 lg:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-16 items-start justify-items-center lg:justify-items-start">
          <div className="w-full sm:max-w-sm lg:max-w-none">
            <img
              src={imageUrl}
              alt="Uploaded image"
              className="w-full max-w-[95vw] sm:max-w-sm lg:w-[360px] mx-auto rounded-2xl shadow-xl object-cover aspect-[3/4] bg-base-200"
            />
          </div>

          <div className="w-full max-w-md lg:max-w-none lg:pt-2">
            <EstimatePanel
              estimate={activeBodyFat}
              loading={activeEstimate.loading}
              error={activeEstimate.error}
              gender={activeGender}
              accuracy={activeAccuracy}
            />
          </div>
        </div>
      </div>

      <div id="where-you-sit" className="w-full max-w-3xl mt-20 lg:mt-40">
        <EstimateWhereYouSit
          estimate={activeBodyFat}
          gender={activeGender}
          rationale={activeRationale}
        />
      </div>

      <div id="rationale" className="w-full max-w-3xl mt-20 lg:mt-40">
        <EstimateRationale estimate={activeBodyFat} rationale={activeRationale} />
      </div>

      <div id="accuracy" className="w-full max-w-3xl mt-20 lg:mt-40">
        <EstimateAccuracy
          accuracy={activeAccuracy}
          improvements={activeImprovements}
          onImproveAccuracy={() => setShowRefine(true)}
          improveCtaLabel="Improve Accuracy →"
        />
      </div>

      {showRefine && (
        <div ref={refineRef} className="w-full max-w-3xl mt-20 lg:mt-40">
          <EstimateRefineInline
            initialImageUrl={imageUrl}
            onRefine={(payload) => {
              if (!imageUrl) return;

              setShowRefine(true);
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
