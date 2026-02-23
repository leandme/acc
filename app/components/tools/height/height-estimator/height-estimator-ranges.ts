import type { RangeBucket } from "@/app/components/tools/body-weight/shared/ui";
import { STANDARD_BUCKET_COLORS } from "@/app/components/tools/body-weight/shared/ui";

const HEIGHT_ESTIMATOR_RANGES: RangeBucket[] = [
  {
    key: "very_short",
    label: "Very Short Band",
    shortLabel: "Very Short",
    min: 120,
    max: 155,
    rowClass: STANDARD_BUCKET_COLORS.red.row,
    color: STANDARD_BUCKET_COLORS.red.dot,
    note: "Below common adult-height medians in most populations; treat image-based estimates cautiously.",
  },
  {
    key: "short",
    label: "Short Band",
    shortLabel: "Short",
    min: 155,
    max: 166,
    rowClass: STANDARD_BUCKET_COLORS.orange.row,
    color: STANDARD_BUCKET_COLORS.orange.dot,
    note: "Lower-than-average adult-height band in many cohorts; camera perspective can shift this result.",
  },
  {
    key: "average",
    label: "Average Band",
    shortLabel: "Average",
    min: 166,
    max: 180,
    rowClass: STANDARD_BUCKET_COLORS.yellow.row,
    color: STANDARD_BUCKET_COLORS.yellow.dot,
    note: "Common adult-height band across many populations; still image- and context-dependent.",
  },
  {
    key: "tall",
    label: "Tall Band",
    shortLabel: "Tall",
    min: 180,
    max: 193,
    rowClass: STANDARD_BUCKET_COLORS.green.row,
    color: STANDARD_BUCKET_COLORS.green.dot,
    note: "Above-average adult-height band in many cohorts; uncertainty remains without reference objects.",
  },
  {
    key: "very_tall",
    label: "Very Tall Band",
    shortLabel: "Very Tall",
    min: 193,
    max: Infinity,
    rowClass: STANDARD_BUCKET_COLORS.blue.row,
    color: STANDARD_BUCKET_COLORS.blue.dot,
    note: "Uncommon adult-height band; verify with direct measurement for practical decisions.",
  },
];

export function getHeightEstimatorRanges() {
  return HEIGHT_ESTIMATOR_RANGES;
}

export function getHeightEstimatorScale() {
  return {
    min: 120,
    max: 220,
    ticks: [120, 140, 155, 166, 180, 193, 220],
  };
}
