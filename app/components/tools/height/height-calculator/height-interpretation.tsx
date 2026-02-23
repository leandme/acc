"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { getHeightProbabilityRanges } from "./height-calculator-ranges";

export default function HeightInterpretation({
  probability,
}: {
  probability: number | null;
}) {
  return (
    <InterpretationTable
      title="Height Probability Interpretation"
      subtitle="This probability estimates the chance of reaching at least your selected adult-height target using a parent-based center estimate and normal-distribution assumption."
      value={probability}
      ranges={getHeightProbabilityRanges()}
      valueDigits={1}
      rangeDigits={0}
      unitsLabel="% probability"
    />
  );
}
