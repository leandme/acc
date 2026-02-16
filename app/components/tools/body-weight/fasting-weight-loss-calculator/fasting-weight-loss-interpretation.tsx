"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { FASTING_WEEKLY_LOSS_RANGES } from "./fasting-weight-loss-ranges";

export default function FastingWeightLossInterpretation({
  weeklyLossPct,
}: {
  weeklyLossPct: number | null;
}) {
  return (
    <InterpretationTable
      title="Projected Weekly Loss Pace"
      subtitle="Interpretation is based on projected percent body-weight change per week in your fasting setup."
      value={weeklyLossPct}
      ranges={FASTING_WEEKLY_LOSS_RANGES}
      valueDigits={2}
      rangeDigits={2}
      unitsLabel="% per week"
    />
  );
}
