"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { WEIGHT_LOSS_PACE_RANGES } from "@/app/components/tools/body-weight/shared/weight-loss-pace-ranges";

export default function CalorieDeficitInterpretation({
  weeklyLossPct,
}: {
  weeklyLossPct: number | null;
}) {
  return (
    <InterpretationTable
      title="Weekly Loss Pace Interpretation"
      subtitle="The selected deficit is interpreted by projected body-weight change per week."
      value={weeklyLossPct}
      ranges={WEIGHT_LOSS_PACE_RANGES}
      valueDigits={2}
      rangeDigits={2}
      unitsLabel="% per week"
    />
  );
}
