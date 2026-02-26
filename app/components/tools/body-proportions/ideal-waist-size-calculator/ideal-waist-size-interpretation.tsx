"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { IDEAL_WAIST_RATIO_RANGES } from "./ideal-waist-size-ranges";

export default function IdealWaistSizeInterpretation({
  ratio,
}: {
  ratio: number | null;
}) {
  return (
    <InterpretationTable
      title="Ideal Waist Ratio Interpretation"
      subtitle="Your current waist-to-height ratio is mapped to practical target bands for waist-size planning."
      value={ratio}
      ranges={IDEAL_WAIST_RATIO_RANGES}
      valueDigits={2}
      rangeDigits={2}
      unitsLabel="ratio"
    />
  );
}
