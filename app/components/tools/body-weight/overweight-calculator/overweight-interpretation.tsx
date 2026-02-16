"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { OVERWEIGHT_BMI_RANGES } from "./overweight-ranges";

export default function OverweightInterpretation({ bmi }: { bmi: number | null }) {
  return (
    <InterpretationTable
      title="Adult BMI Categories"
      subtitle="This overweight calculator uses standard adult BMI ranges from CDC for screening context."
      value={bmi}
      ranges={OVERWEIGHT_BMI_RANGES}
      valueDigits={1}
      rangeDigits={1}
    />
  );
}
