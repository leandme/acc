"use client";

import EstimateDropZone from "@/app/components/Common/EstimateDropZone"
import TryExamples from "../Common/TryExamples";

export default function SecondaryUploadCTA() {
  return (
    <section className="mt-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-2xl p-8 text-center">
          <h3 className="text-3xl lg:text-4xl font-semibold mb-4">
            Body Fat Estimate
          </h3>

          <p className="text-lg mb-6 max-w-xl mx-auto leading-relaxed">
            Get a visual AI body fat estimate in seconds.
          </p>

          <div className="mx-auto w-full max-w-md">
            <EstimateDropZone />

            <div className="mt-6 text-left mb-20">
              <TryExamples basePath="/estimate" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
