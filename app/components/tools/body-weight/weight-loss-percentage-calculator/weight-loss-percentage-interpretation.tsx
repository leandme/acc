"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { WEIGHT_LOSS_PERCENTAGE_RANGES } from "./weight-loss-percentage-ranges";

export default function WeightLossPercentageInterpretation({
  value,
}: {
  value: number | null;
}) {
  return (
    <InterpretationTable
      title="Weight Loss Percentage Interpretation"
      subtitle="Use this as a trend tool. Most guidelines treat 5-10% body-weight reduction as a meaningful first milestone."
      value={value}
      valueDigits={1}
      rangeDigits={0}
      unitsLabel="%"
      ranges={WEIGHT_LOSS_PERCENTAGE_RANGES}
    />
  );
}
