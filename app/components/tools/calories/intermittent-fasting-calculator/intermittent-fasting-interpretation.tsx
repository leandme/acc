"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { WEIGHT_LOSS_PACE_RANGES } from "@/app/components/tools/body-weight/shared/weight-loss-pace-ranges";

export default function IntermittentFastingInterpretation({
  weeklyLossPct,
}: {
  weeklyLossPct: number | null;
}) {
  const normalizedValue =
    weeklyLossPct == null ? null : Math.max(-0.99, weeklyLossPct);

  return (
    <InterpretationTable
      title="Projected Weekly Change Pace"
      subtitle="Interpretation is based on projected percent body-weight change per week from your intermittent fasting setup."
      value={normalizedValue}
      ranges={WEIGHT_LOSS_PACE_RANGES}
      valueDigits={2}
      rangeDigits={2}
      unitsLabel="% per week"
    />
  );
}
