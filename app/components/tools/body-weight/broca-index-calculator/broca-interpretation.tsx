"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { BROCA_PERCENT_RANGES } from "./broca-ranges";

export default function BrocaInterpretation({
  percentOfBroca,
}: {
  percentOfBroca: number | null;
}) {
  return (
    <InterpretationTable
      title="Current Weight vs Broca Reference"
      subtitle="Broca is a historical height-based reference formula. Interpret with modern BMI and body-composition tools."
      value={percentOfBroca}
      ranges={BROCA_PERCENT_RANGES}
      valueDigits={1}
      rangeDigits={0}
      unitsLabel="%"
    />
  );
}
