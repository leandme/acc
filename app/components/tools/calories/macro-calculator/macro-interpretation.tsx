"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { MACRO_CALORIE_ADJUSTMENT_RANGES } from "@/app/components/tools/calories/macro-calculator/macro-ranges";

export default function MacroInterpretation({
  adjustmentPct,
}: {
  adjustmentPct: number | null;
}) {
  return (
    <InterpretationTable
      title="Calorie Adjustment Interpretation"
      subtitle="Your macro target is interpreted by how far calories are set below or above estimated maintenance."
      value={adjustmentPct}
      ranges={MACRO_CALORIE_ADJUSTMENT_RANGES}
      valueDigits={0}
      rangeDigits={0}
      unitsLabel="% vs maintenance"
    />
  );
}

