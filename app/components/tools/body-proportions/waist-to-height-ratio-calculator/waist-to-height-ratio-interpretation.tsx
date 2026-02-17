"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { WAIST_TO_HEIGHT_RANGES } from "@/app/components/tools/body-proportions/waist-to-height-ratio-calculator/waist-to-height-ratio-ranges";

export default function WaistToHeightRatioInterpretation({
  ratio,
}: {
  ratio: number | null;
}) {
  return (
    <InterpretationTable
      title="Waist-to-Height Ratio Interpretation"
      subtitle="Adult screening uses waist-to-height ratio as a quick marker of central-fat distribution risk."
      value={ratio}
      ranges={WAIST_TO_HEIGHT_RANGES}
      valueDigits={2}
      rangeDigits={2}
      unitsLabel="ratio"
    />
  );
}
