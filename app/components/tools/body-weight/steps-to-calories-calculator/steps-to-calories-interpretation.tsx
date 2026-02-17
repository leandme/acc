"use client";

import InterpretationTable from "@/app/components/tools/body-weight/shared/interpretation-table";
import { STEPS_ACTIVITY_RANGES } from "@/app/components/tools/body-weight/steps-to-calories-calculator/steps-to-calories-ranges";

export default function StepsToCaloriesInterpretation({
  stepsPerDay,
}: {
  stepsPerDay: number | null;
}) {
  return (
    <InterpretationTable
      title="Daily Step Volume Interpretation"
      subtitle="This interpretation classifies your current step total into practical daily movement ranges."
      value={stepsPerDay}
      ranges={STEPS_ACTIVITY_RANGES}
      valueDigits={0}
      rangeDigits={0}
      unitsLabel="steps/day"
    />
  );
}

