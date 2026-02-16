"use client";

import type { Sex } from "@/app/components/tools/body-weight/shared/math";
import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { getMuscleMassPctRanges } from "./muscle-mass-ranges";

export default function MuscleMassInterpretation({
  sex,
  muscleMassPct,
}: {
  sex: Sex;
  muscleMassPct: number | null;
}) {
  const ranges = getMuscleMassPctRanges(sex);

  return (
    <InterpretationTable
      title="Estimated Skeletal Muscle % Interpretation"
      subtitle="Interpretation bands reflect relative skeletal muscle percentage of total body weight."
      value={muscleMassPct}
      ranges={ranges}
      valueDigits={1}
      rangeDigits={1}
      unitsLabel="% of body weight"
    />
  );
}
