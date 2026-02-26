import { STANDARD_BUCKET_COLORS, type RangeBucket } from "@/app/components/tools/body-weight/shared/ui";

export const IDEAL_WAIST_RATIO_RANGES: RangeBucket[] = [
  {
    key: "below-common",
    label: "Below Common Range",
    min: 0,
    max: 0.4,
    rowClass: STANDARD_BUCKET_COLORS.blue.row,
    color: STANDARD_BUCKET_COLORS.blue.dot,
    note: "Below common adult waist-to-height screening zone.",
    shortLabel: "<0.40",
  },
  {
    key: "target",
    label: "Target Range",
    min: 0.4,
    max: 0.5,
    rowClass: STANDARD_BUCKET_COLORS.green.row,
    color: STANDARD_BUCKET_COLORS.green.dot,
    note: "Common target zone used for practical waist screening.",
    shortLabel: "0.40-0.49",
  },
  {
    key: "above-target",
    label: "Above Target",
    min: 0.5,
    max: 0.6,
    rowClass: STANDARD_BUCKET_COLORS.orange.row,
    color: STANDARD_BUCKET_COLORS.orange.dot,
    note: "Above the common 0.50 waist-to-height screen threshold.",
    shortLabel: "0.50-0.59",
  },
  {
    key: "high",
    label: "High",
    min: 0.6,
    max: Infinity,
    rowClass: STANDARD_BUCKET_COLORS.red.row,
    color: STANDARD_BUCKET_COLORS.red.dot,
    note: "High central-fat screening zone from waist-to-height ratio.",
    shortLabel: ">=0.60",
  },
];
