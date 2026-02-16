"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { IDEAL_WEIGHT_PERCENT_RANGES } from "./ideal-weight-ranges";

export default function IdealWeightInterpretation({
  percentOfTarget,
}: {
  percentOfTarget: number | null;
}) {
  return (
    <InterpretationTable
      title="Current Weight vs Target Reference"
      subtitle="This table compares your current weight against the selected ideal-weight reference (Devine IBW)."
      value={percentOfTarget}
      ranges={IDEAL_WEIGHT_PERCENT_RANGES}
      valueDigits={1}
      rangeDigits={0}
      unitsLabel="%"
    />
  );
}
