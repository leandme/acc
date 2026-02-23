"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { getMuscularPotentialRanges } from "./muscular-potential-ranges";

export default function MuscularPotentialInterpretation({
  utilizationPct,
}: {
  utilizationPct: number | null;
}) {
  return (
    <InterpretationTable
      title="Muscular Potential Interpretation"
      subtitle="This compares your current lean mass against a frame-adjusted natural muscular ceiling model."
      value={utilizationPct}
      ranges={getMuscularPotentialRanges()}
      valueDigits={1}
      rangeDigits={0}
      unitsLabel="% of modelled potential"
    />
  );
}
