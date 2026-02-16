"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { OVERWEIGHT_BMI_RANGES } from "@/app/components/tools/body-weight/overweight-calculator/overweight-ranges";

export default function BMIInterpretation({ bmi }: { bmi: number | null }) {
  return (
    <InterpretationTable
      title="Adult BMI Interpretation"
      subtitle="BMI is a screening measure based on height and weight. Use with waist and body-composition context."
      value={bmi}
      ranges={OVERWEIGHT_BMI_RANGES}
      valueDigits={1}
      rangeDigits={1}
    />
  );
}
