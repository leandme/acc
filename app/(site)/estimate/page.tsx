"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import UploadDropzone from "@/app/components/UploadDropZone";
import TryExamples from "@/app/components/TryExamples";
import EstimatePanel from "@/app/components/EstimatePanel";
import { useBodyFatEstimate } from "@/app/hooks/useBodyFatEstimate";

function UploadPageContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");

  const { estimate, loading, error } = useBodyFatEstimate(imageUrl);

  if (!imageUrl) {
    return (
      <>
        <div className="hero min-h-screen -mt-24 flex items-center justify-center">
          <div className="flex flex-col items-center mt-10 gap-6">
            <div className="text-center lg:text-left w-full max-w-md">
              <h1 className="text-center text-2xl lg:text-3xl font-bold mb-12">
                Upload a Photo to Estimate Body Fat %
              </h1>
              <UploadDropzone />
            </div>

            <div className="w-full max-w-lg mt-6 lg:max-w-xl">
              <TryExamples />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <section className="hero flex flex-col items-center justify-start min-h-screen pt-0">
      <div className="hero-content flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-4xl mt-4 lg:mt-0">
        <div className="flex-shrink-0">
          <img
            src={imageUrl}
            alt="Uploaded image"
            className="w-64 sm:w-80 lg:w-[22rem] rounded-lg shadow-xl object-cover aspect-[3/4] bg-base-200"
          />
        </div>

        <EstimatePanel estimate={estimate} loading={loading} error={error} />
      </div>
    </section>
  );
}

export default function UploadPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      }
    >
      <UploadPageContent />
    </Suspense>
  );
}
