"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { getMidParentalPercentileRanges } from "./mid-parental-height-ranges";

export default function MidParentalHeightInterpretation({
  percentile,
}: {
  percentile: number | null;
}) {
  return (
    <InterpretationTable
      title="Mid-Parental Height Interpretation"
      subtitle="Percentile is estimated from adult population distributions and helps contextualize where the family-based target sits."
      value={percentile}
      ranges={getMidParentalPercentileRanges()}
      valueDigits={1}
      rangeDigits={0}
      unitsLabel="percentile"
    />
  );
}
