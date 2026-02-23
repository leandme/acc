import type { RangeBucket } from "@/app/components/tools/body-weight/shared/ui";
import { STANDARD_BUCKET_COLORS } from "@/app/components/tools/body-weight/shared/ui";

const CASEY_BUTT_POTENTIAL_RANGES: RangeBucket[] = [
  {
    key: "modest",
    label: "Modest Potential",
    shortLabel: "Modest",
    min: 0,
    max: 20,
    rowClass: STANDARD_BUCKET_COLORS.blue.row,
    color: STANDARD_BUCKET_COLORS.blue.dot,
    note: "Lower projected FFMI ceiling. Progress still depends strongly on training quality and time.",
  },
  {
    key: "solid",
    label: "Solid Potential",
    shortLabel: "Solid",
    min: 20,
    max: 22,
    rowClass: STANDARD_BUCKET_COLORS.green.row,
    color: STANDARD_BUCKET_COLORS.green.dot,
    note: "Typical natural potential profile with room for meaningful development.",
  },
  {
    key: "advanced",
    label: "Advanced Potential",
    shortLabel: "Advanced",
    min: 22,
    max: 24,
    rowClass: STANDARD_BUCKET_COLORS.yellow.row,
    color: STANDARD_BUCKET_COLORS.yellow.dot,
    note: "Above-average anthropometric potential for muscular development.",
  },
  {
    key: "elite-natural",
    label: "Elite Natural Range",
    shortLabel: "Elite nat.",
    min: 24,
    max: 26,
    rowClass: STANDARD_BUCKET_COLORS.orange.row,
    color: STANDARD_BUCKET_COLORS.orange.dot,
    note: "High-end natural profile where most gains require long timelines and precision.",
  },
  {
    key: "exceptional",
    label: "Exceptional",
    shortLabel: "Exceptional",
    min: 26,
    max: 28,
    rowClass: STANDARD_BUCKET_COLORS.red.row,
    color: STANDARD_BUCKET_COLORS.red.dot,
    note: "Rare anthropometric profile in natural populations.",
  },
  {
    key: "extreme-outlier",
    label: "Extreme Outlier",
    shortLabel: "Outlier",
    min: 28,
    max: Infinity,
    rowClass: STANDARD_BUCKET_COLORS.purple.row,
    color: STANDARD_BUCKET_COLORS.purple.dot,
    note: "Very uncommon model output. Re-check measurement inputs before interpretation.",
  },
];

export function getCaseyButtRanges() {
  return CASEY_BUTT_POTENTIAL_RANGES;
}

export function getCaseyButtScale() {
  return {
    min: 18,
    max: 30,
    ticks: [18, 20, 22, 24, 26, 28, 30],
  };
}
