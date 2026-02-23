import type { RangeBucket } from "@/app/components/tools/body-weight/shared/ui";
import { STANDARD_BUCKET_COLORS } from "@/app/components/tools/body-weight/shared/ui";

const HEIGHT_PERCENTILE_RANGES: RangeBucket[] = [
  {
    key: "shorter",
    label: "Shorter Range",
    shortLabel: "Shorter",
    min: 0,
    max: 10,
    rowClass: STANDARD_BUCKET_COLORS.red.row,
    color: STANDARD_BUCKET_COLORS.red.dot,
    note: "Predicted adult height is in lower population percentiles.",
  },
  {
    key: "below-average",
    label: "Below Average",
    shortLabel: "Below avg",
    min: 10,
    max: 30,
    rowClass: STANDARD_BUCKET_COLORS.orange.row,
    color: STANDARD_BUCKET_COLORS.orange.dot,
    note: "Predicted height is below median but within common population variation.",
  },
  {
    key: "average",
    label: "Average",
    shortLabel: "Average",
    min: 30,
    max: 70,
    rowClass: STANDARD_BUCKET_COLORS.yellow.row,
    color: STANDARD_BUCKET_COLORS.yellow.dot,
    note: "Predicted height is near the broad middle of population distribution.",
  },
  {
    key: "above-average",
    label: "Above Average",
    shortLabel: "Above avg",
    min: 70,
    max: 90,
    rowClass: STANDARD_BUCKET_COLORS.green.row,
    color: STANDARD_BUCKET_COLORS.green.dot,
    note: "Predicted height is above median and common in upper-percentile groups.",
  },
  {
    key: "tall",
    label: "Tall Range",
    shortLabel: "Tall",
    min: 90,
    max: Infinity,
    rowClass: STANDARD_BUCKET_COLORS.blue.row,
    color: STANDARD_BUCKET_COLORS.blue.dot,
    note: "Predicted adult height is in high population percentiles.",
  },
];

export function getMidParentalPercentileRanges() {
  return HEIGHT_PERCENTILE_RANGES;
}

export function getMidParentalPercentileScale() {
  return {
    min: 0,
    max: 100,
    ticks: [0, 10, 30, 50, 70, 90, 100],
  };
}
