"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { getNattyScoreRanges } from "./natty-or-not-ranges";

export default function NattyOrNotInterpretation({
  nattyScore,
}: {
  nattyScore: number | null;
}) {
  return (
    <InterpretationTable
      title="Natty or Not Interpretation"
      subtitle="This score compares your normalized FFMI against a frame-adjusted natural ceiling. It is a screening model, not proof of PED use."
      value={nattyScore}
      ranges={getNattyScoreRanges()}
      valueDigits={0}
      rangeDigits={0}
      unitsLabel="% of frame-adjusted natural FFMI limit"
    />
  );
}
