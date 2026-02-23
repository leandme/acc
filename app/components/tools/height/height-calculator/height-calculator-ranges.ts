import type { RangeBucket } from "@/app/components/tools/body-weight/shared/ui";
import { STANDARD_BUCKET_COLORS } from "@/app/components/tools/body-weight/shared/ui";

const HEIGHT_PROBABILITY_RANGES: RangeBucket[] = [
  {
    key: "very-low",
    label: "Very Low",
    shortLabel: "Very low",
    min: 0,
    max: 10,
    rowClass: STANDARD_BUCKET_COLORS.red.row,
    color: STANDARD_BUCKET_COLORS.red.dot,
    note: "This target is far above the model's expected adult-height center.",
  },
  {
    key: "low",
    label: "Low",
    shortLabel: "Low",
    min: 10,
    max: 30,
    rowClass: STANDARD_BUCKET_COLORS.orange.row,
    color: STANDARD_BUCKET_COLORS.orange.dot,
    note: "Possible but less common without exceptionally favorable growth outcomes.",
  },
  {
    key: "moderate-low",
    label: "Moderate-Low",
    shortLabel: "Mod-low",
    min: 30,
    max: 50,
    rowClass: STANDARD_BUCKET_COLORS.yellow.row,
    color: STANDARD_BUCKET_COLORS.yellow.dot,
    note: "Near the upper half of expected outcomes but not the most likely zone.",
  },
  {
    key: "moderate",
    label: "Moderate",
    shortLabel: "Moderate",
    min: 50,
    max: 70,
    rowClass: STANDARD_BUCKET_COLORS.green.row,
    color: STANDARD_BUCKET_COLORS.green.dot,
    note: "Close to the model's center range and generally plausible.",
  },
  {
    key: "high",
    label: "High",
    shortLabel: "High",
    min: 70,
    max: 90,
    rowClass: STANDARD_BUCKET_COLORS.teal.row,
    color: STANDARD_BUCKET_COLORS.teal.dot,
    note: "Target is near or below expected adult-height center for this profile.",
  },
  {
    key: "very-high",
    label: "Very High",
    shortLabel: "Very high",
    min: 90,
    max: Infinity,
    rowClass: STANDARD_BUCKET_COLORS.blue.row,
    color: STANDARD_BUCKET_COLORS.blue.dot,
    note: "Target is comfortably within expected outcomes under this model.",
  },
];

export function getHeightProbabilityRanges() {
  return HEIGHT_PROBABILITY_RANGES;
}

export function getHeightProbabilityScale() {
  return {
    min: 0,
    max: 100,
    ticks: [0, 10, 30, 50, 70, 90, 100],
  };
}
