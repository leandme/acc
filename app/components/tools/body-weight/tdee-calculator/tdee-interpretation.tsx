"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { TDEE_ACTIVITY_FACTOR_RANGES } from "./tdee-ranges";

export default function TDEEInterpretation({
  activityFactor,
}: {
  activityFactor: number | null;
}) {
  return (
    <InterpretationTable
      title="Activity Multiplier Interpretation"
      subtitle="TDEE scales BMR by activity. The highlighted row reflects your selected activity multiplier."
      value={activityFactor}
      ranges={TDEE_ACTIVITY_FACTOR_RANGES}
      valueDigits={2}
      rangeDigits={2}
      unitsLabel="x"
    />
  );
}
