import type { RangeBucket } from "@/app/components/tools/body-weight/shared/ui";
import { STANDARD_BUCKET_COLORS } from "@/app/components/tools/body-weight/shared/ui";

const NATTY_SCORE_RANGES: RangeBucket[] = [
  {
    key: "very-likely-natural",
    label: "Very Likely Natural",
    shortLabel: "Very likely",
    min: 0,
    max: 90,
    rowClass: STANDARD_BUCKET_COLORS.green.row,
    color: STANDARD_BUCKET_COLORS.green.dot,
    note: "Mass and leanness are comfortably inside typical natural limits for your frame.",
  },
  {
    key: "likely-natural",
    label: "Likely Natural",
    shortLabel: "Likely",
    min: 90,
    max: 98,
    rowClass: STANDARD_BUCKET_COLORS.teal.row,
    color: STANDARD_BUCKET_COLORS.teal.dot,
    note: "Still within realistic natural range, especially with consistent training history.",
  },
  {
    key: "advanced-natural-range",
    label: "Advanced Natural Range",
    shortLabel: "Advanced",
    min: 98,
    max: 104,
    rowClass: STANDARD_BUCKET_COLORS.yellow.row,
    color: STANDARD_BUCKET_COLORS.yellow.dot,
    note: "Near the upper natural ceiling where genetics, measurement quality, and context matter more.",
  },
  {
    key: "gray-zone",
    label: "Gray Zone",
    shortLabel: "Gray zone",
    min: 104,
    max: 110,
    rowClass: STANDARD_BUCKET_COLORS.orange.row,
    color: STANDARD_BUCKET_COLORS.orange.dot,
    note: "Above common natural ceilings. Re-check body-fat input, height, and body-weight data first.",
  },
  {
    key: "unlikely-natural",
    label: "Unlikely Natural",
    shortLabel: "Unlikely",
    min: 110,
    max: 120,
    rowClass: STANDARD_BUCKET_COLORS.red.row,
    color: STANDARD_BUCKET_COLORS.red.dot,
    note: "Muscularity is above typical frame-adjusted natural limits in most datasets.",
  },
  {
    key: "highly-unlikely-natural",
    label: "Highly Unlikely Natural",
    shortLabel: "Highly unlikely",
    min: 120,
    max: Infinity,
    rowClass: STANDARD_BUCKET_COLORS.purple.row,
    color: STANDARD_BUCKET_COLORS.purple.dot,
    note: "Far above usual natural ceilings. This is a screening signal, not proof of PED use.",
  },
];

export function getNattyScoreRanges() {
  return NATTY_SCORE_RANGES;
}

export function getNattyScoreScale() {
  return {
    min: 70,
    max: 130,
    ticks: [70, 80, 90, 100, 110, 120, 130],
  };
}
