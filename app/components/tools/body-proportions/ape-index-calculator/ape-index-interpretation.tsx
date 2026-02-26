"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { APE_INDEX_RANGES } from "./ape-index-ranges";

export default function ApeIndexInterpretation({
  ratio,
}: {
  ratio: number | null;
}) {
  return (
    <InterpretationTable
      title="Ape Index Interpretation"
      subtitle="Ape index compares wingspan to height. The highlighted band shows where your current ratio sits."
      value={ratio}
      ranges={APE_INDEX_RANGES}
      valueDigits={2}
      rangeDigits={2}
      unitsLabel="ratio"
    />
  );
}
