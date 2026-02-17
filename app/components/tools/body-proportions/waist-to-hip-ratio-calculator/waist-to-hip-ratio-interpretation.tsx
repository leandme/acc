"use client";

import type { Sex } from "@/app/components/tools/body-weight/shared/math";
import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { getWaistToHipRanges } from "@/app/components/tools/body-proportions/waist-to-hip-ratio-calculator/waist-to-hip-ratio-ranges";

export default function WaistToHipRatioInterpretation({
  sex,
  ratio,
}: {
  sex: Sex;
  ratio: number | null;
}) {
  const ranges = getWaistToHipRanges(sex);

  return (
    <InterpretationTable
      title="Waist-to-Hip Ratio Interpretation"
      subtitle="Interpretation thresholds differ for men and women in standard waist-to-hip risk models."
      value={ratio}
      ranges={ranges}
      valueDigits={2}
      rangeDigits={2}
      unitsLabel="ratio"
    />
  );
}

