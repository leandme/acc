import { STANDARD_BUCKET_COLORS, type RangeBucket } from "@/app/components/tools/body-weight/shared/ui";

export const APE_INDEX_RANGES: RangeBucket[] = [
  {
    key: "negative",
    label: "Negative Ape Index",
    min: 0,
    max: 0.98,
    rowClass: STANDARD_BUCKET_COLORS.blue.row,
    color: STANDARD_BUCKET_COLORS.blue.dot,
    note: "Wingspan is shorter than height in this range.",
    shortLabel: "<0.98",
  },
  {
    key: "neutral",
    label: "Neutral Ape Index",
    min: 0.98,
    max: 1.02,
    rowClass: STANDARD_BUCKET_COLORS.green.row,
    color: STANDARD_BUCKET_COLORS.green.dot,
    note: "Wingspan and height are close to equal.",
    shortLabel: "0.98-1.01",
  },
  {
    key: "positive",
    label: "Positive Ape Index",
    min: 1.02,
    max: 1.06,
    rowClass: STANDARD_BUCKET_COLORS.yellow.row,
    color: STANDARD_BUCKET_COLORS.yellow.dot,
    note: "Wingspan is moderately longer than height.",
    shortLabel: "1.02-1.05",
  },
  {
    key: "strong-positive",
    label: "Strong Positive",
    min: 1.06,
    max: Infinity,
    rowClass: STANDARD_BUCKET_COLORS.purple.row,
    color: STANDARD_BUCKET_COLORS.purple.dot,
    note: "Wingspan is substantially longer than height.",
    shortLabel: ">=1.06",
  },
];
