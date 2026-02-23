import type { RangeBucket } from "@/app/components/tools/body-weight/shared/ui";
import { STANDARD_BUCKET_COLORS } from "@/app/components/tools/body-weight/shared/ui";

const MUSCULAR_POTENTIAL_RANGES: RangeBucket[] = [
  {
    key: "early",
    label: "Early Stage",
    shortLabel: "Early",
    min: 0,
    max: 60,
    rowClass: STANDARD_BUCKET_COLORS.blue.row,
    color: STANDARD_BUCKET_COLORS.blue.dot,
    note: "You are still far from modelled muscular ceiling. Highest growth potential remains.",
  },
  {
    key: "developing",
    label: "Developing",
    shortLabel: "Developing",
    min: 60,
    max: 75,
    rowClass: STANDARD_BUCKET_COLORS.green.row,
    color: STANDARD_BUCKET_COLORS.green.dot,
    note: "Solid progress phase. Most lifters still have substantial lean-mass runway.",
  },
  {
    key: "advanced",
    label: "Advanced",
    shortLabel: "Advanced",
    min: 75,
    max: 90,
    rowClass: STANDARD_BUCKET_COLORS.yellow.row,
    color: STANDARD_BUCKET_COLORS.yellow.dot,
    note: "You are approaching upper natural potential and progress usually slows.",
  },
  {
    key: "near-ceiling",
    label: "Near Ceiling",
    shortLabel: "Near ceiling",
    min: 90,
    max: 100,
    rowClass: STANDARD_BUCKET_COLORS.orange.row,
    color: STANDARD_BUCKET_COLORS.orange.dot,
    note: "Close to modelled ceiling. Improvements tend to be incremental and harder won.",
  },
  {
    key: "at-or-above",
    label: "At/Above Model Ceiling",
    shortLabel: "At/above",
    min: 100,
    max: Infinity,
    rowClass: STANDARD_BUCKET_COLORS.red.row,
    color: STANDARD_BUCKET_COLORS.red.dot,
    note: "Current lean mass is at or above the modelled ceiling. Re-check body-fat and measurement inputs.",
  },
];

export function getMuscularPotentialRanges() {
  return MUSCULAR_POTENTIAL_RANGES;
}

export function getMuscularPotentialScale() {
  return {
    min: 40,
    max: 120,
    ticks: [40, 60, 75, 90, 100, 110, 120],
  };
}
