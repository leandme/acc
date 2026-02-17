import { STANDARD_BUCKET_COLORS, type RangeBucket } from "@/app/components/tools/body-weight/shared/ui";

export const WAIST_TO_HEIGHT_RANGES: RangeBucket[] = [
  {
    key: "below-range",
    label: "Below Range",
    min: 0,
    max: 0.4,
    rowClass: STANDARD_BUCKET_COLORS.blue.row,
    color: STANDARD_BUCKET_COLORS.blue.dot,
    note: "Below common adult screening range. Recheck measurements and broader nutrition context.",
    shortLabel: "<0.40",
  },
  {
    key: "healthy",
    label: "Healthy Range",
    min: 0.4,
    max: 0.5,
    rowClass: STANDARD_BUCKET_COLORS.green.row,
    color: STANDARD_BUCKET_COLORS.green.dot,
    note: "Common target zone for lower central-fat risk in adult screening models.",
    shortLabel: "0.40-0.49",
  },
  {
    key: "elevated",
    label: "Elevated",
    min: 0.5,
    max: 0.6,
    rowClass: STANDARD_BUCKET_COLORS.orange.row,
    color: STANDARD_BUCKET_COLORS.orange.dot,
    note: "Central-fat risk is often higher above 0.50. Track waist trend and lifestyle factors.",
    shortLabel: "0.50-0.59",
  },
  {
    key: "high",
    label: "High",
    min: 0.6,
    max: Infinity,
    rowClass: STANDARD_BUCKET_COLORS.red.row,
    color: STANDARD_BUCKET_COLORS.red.dot,
    note: "High-risk screening band for abdominal adiposity. Consider full cardiometabolic assessment.",
    shortLabel: ">=0.60",
  },
];
