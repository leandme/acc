"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { getHeightEstimatorRanges } from "./height-estimator-ranges";

export default function HeightEstimatorInterpretation({
  estimatedHeightCm,
}: {
  estimatedHeightCm: number | null;
}) {
  return (
    <InterpretationTable
      title="Estimated Height Interpretation"
      subtitle="The highlighted row shows where your photo-based height estimate sits in broad adult-height bands."
      value={estimatedHeightCm}
      ranges={getHeightEstimatorRanges()}
      valueDigits={1}
      rangeDigits={0}
      unitsLabel="cm"
    />
  );
}
