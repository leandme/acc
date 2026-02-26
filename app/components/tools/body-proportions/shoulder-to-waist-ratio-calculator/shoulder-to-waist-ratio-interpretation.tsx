"use client";

import type { Sex } from "@/app/components/tools/body-weight/shared/math";
import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { getShoulderToWaistRanges } from "./shoulder-to-waist-ratio-ranges";

export default function ShoulderToWaistRatioInterpretation({
  sex,
  ratio,
}: {
  sex: Sex;
  ratio: number | null;
}) {
  return (
    <InterpretationTable
      title="Shoulder-to-Waist Ratio Interpretation"
      subtitle="The highlighted range shows your current shoulder-to-waist taper category."
      value={ratio}
      ranges={getShoulderToWaistRanges(sex)}
      valueDigits={2}
      rangeDigits={2}
      unitsLabel="ratio"
    />
  );
}
