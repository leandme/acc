"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { CALORIES_BURNED_RANGES } from "@/app/components/tools/calories/calories-burned-calculator/calories-burned-ranges";

export default function CaloriesBurnedInterpretation({
  activeCalories,
}: {
  activeCalories: number | null;
}) {
  return (
    <InterpretationTable
      title="Session Burn Interpretation"
      subtitle="This banding interprets active calories for a single workout session."
      value={activeCalories}
      ranges={CALORIES_BURNED_RANGES}
      valueDigits={0}
      rangeDigits={0}
      unitsLabel="active kcal/session"
    />
  );
}
