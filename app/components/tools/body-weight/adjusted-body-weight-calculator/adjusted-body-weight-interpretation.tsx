"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { ADJUSTED_BODY_WEIGHT_PERCENT_RANGES } from "./adjusted-body-weight-ranges";

export default function AdjustedBodyWeightInterpretation({
  percentOfIbw,
}: {
  percentOfIbw: number | null;
}) {
  return (
    <InterpretationTable
      title="Actual Weight Relative to IBW"
      subtitle="AdjBW is often considered when actual body weight is at or above 120% of ideal body weight."
      value={percentOfIbw}
      ranges={ADJUSTED_BODY_WEIGHT_PERCENT_RANGES}
      valueDigits={1}
      rangeDigits={0}
      unitsLabel="%"
    />
  );
}
