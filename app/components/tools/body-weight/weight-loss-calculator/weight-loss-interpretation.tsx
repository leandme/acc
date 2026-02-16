"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { WEIGHT_LOSS_PACE_RANGES } from "@/app/components/tools/body-weight/shared/weight-loss-pace-ranges";

export default function WeightLossInterpretation({
  weeklyLossPct,
}: {
  weeklyLossPct: number | null;
}) {
  return (
    <InterpretationTable
      title="Projected Weekly Loss Pace"
      subtitle="Interpretation is based on projected percent body-weight change per week at your selected intake and activity."
      value={weeklyLossPct}
      ranges={WEIGHT_LOSS_PACE_RANGES}
      valueDigits={2}
      rangeDigits={2}
      unitsLabel="% per week"
    />
  );
}
