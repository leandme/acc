"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { getCaseyButtRanges } from "./casey-butt-ranges";

export default function CaseyButtInterpretation({
  potentialNormalizedFFMI,
}: {
  potentialNormalizedFFMI: number | null;
}) {
  return (
    <InterpretationTable
      title="Casey Butt Potential Interpretation"
      subtitle="These buckets interpret modelled normalized FFMI potential from frame-based anthropometric inputs."
      value={potentialNormalizedFFMI}
      ranges={getCaseyButtRanges()}
      valueDigits={2}
      rangeDigits={0}
      unitsLabel="normalized FFMI potential"
    />
  );
}
