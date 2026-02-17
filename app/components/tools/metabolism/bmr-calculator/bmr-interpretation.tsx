"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { BMR_PER_KG_RANGES } from "./bmr-ranges";

export default function BMRInterpretation({
  bmrPerKg,
}: {
  bmrPerKg: number | null;
}) {
  return (
    <InterpretationTable
      title="BMR per kg Interpretation"
      subtitle="This view normalizes resting energy by body mass to make output easier to compare."
      value={bmrPerKg}
      ranges={BMR_PER_KG_RANGES}
      valueDigits={1}
      rangeDigits={1}
      unitsLabel="kcal/kg/day"
    />
  );
}
