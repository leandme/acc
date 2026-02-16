"use client";

import type { RangeBucket } from "@/app/components/tools/body-weight/shared/ui";
import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";

export default function PonderalInterpretation({
  ponderalIndex,
  ranges,
}: {
  ponderalIndex: number | null;
  ranges: RangeBucket[];
}) {
  return (
    <InterpretationTable
      title="Ponderal Index Interpretation"
      subtitle="Ranges are adjusted to your current height so they align with equivalent adult BMI categories."
      value={ponderalIndex}
      ranges={ranges}
      valueDigits={2}
      rangeDigits={2}
    />
  );
}
