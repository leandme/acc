"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { getBodybuildingGeneticsRanges } from "./bodybuilding-genetics-ranges";

export default function BodybuildingGeneticsInterpretation({
  geneticsScore,
}: {
  geneticsScore: number | null;
}) {
  return (
    <InterpretationTable
      title="Bodybuilding Genetics Interpretation"
      subtitle="These ranges interpret a modelled genetics score built from structural leverage and projected muscular potential."
      value={geneticsScore}
      ranges={getBodybuildingGeneticsRanges()}
      valueDigits={1}
      rangeDigits={0}
      unitsLabel="genetics score"
    />
  );
}
