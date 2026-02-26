"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { CALORIE_GOAL_ADJUSTMENT_RANGES } from "./calorie-ranges";

export default function CalorieInterpretation({
  adjustmentPct,
}: {
  adjustmentPct: number | null;
}) {
  return (
    <InterpretationTable
      title="Calorie Target Interpretation"
      subtitle="Your target intake is interpreted by percentage adjustment from estimated maintenance calories."
      value={adjustmentPct}
      ranges={CALORIE_GOAL_ADJUSTMENT_RANGES}
      valueDigits={1}
      rangeDigits={0}
      unitsLabel="% vs maintenance"
    />
  );
}
