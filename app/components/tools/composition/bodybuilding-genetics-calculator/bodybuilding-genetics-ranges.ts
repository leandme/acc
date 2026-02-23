import type { RangeBucket } from "@/app/components/tools/body-weight/shared/ui";
import { STANDARD_BUCKET_COLORS } from "@/app/components/tools/body-weight/shared/ui";

const BODYBUILDING_GENETICS_RANGES: RangeBucket[] = [
  {
    key: "limited",
    label: "Limited Structural Advantage",
    shortLabel: "Limited",
    min: 0,
    max: 35,
    rowClass: STANDARD_BUCKET_COLORS.red.row,
    color: STANDARD_BUCKET_COLORS.red.dot,
    note: "Modelled frame leverage and projected muscular potential are on the lower side.",
  },
  {
    key: "average",
    label: "Average",
    shortLabel: "Average",
    min: 35,
    max: 50,
    rowClass: STANDARD_BUCKET_COLORS.orange.row,
    color: STANDARD_BUCKET_COLORS.orange.dot,
    note: "Typical profile. Progress depends heavily on consistency and training quality.",
  },
  {
    key: "favorable",
    label: "Favorable",
    shortLabel: "Favorable",
    min: 50,
    max: 65,
    rowClass: STANDARD_BUCKET_COLORS.yellow.row,
    color: STANDARD_BUCKET_COLORS.yellow.dot,
    note: "Above-average anthropometric profile for bodybuilding-oriented development.",
  },
  {
    key: "excellent",
    label: "Excellent",
    shortLabel: "Excellent",
    min: 65,
    max: 80,
    rowClass: STANDARD_BUCKET_COLORS.green.row,
    color: STANDARD_BUCKET_COLORS.green.dot,
    note: "Strong structural and potential profile for muscular development.",
  },
  {
    key: "elite",
    label: "Elite Profile",
    shortLabel: "Elite",
    min: 80,
    max: Infinity,
    rowClass: STANDARD_BUCKET_COLORS.blue.row,
    color: STANDARD_BUCKET_COLORS.blue.dot,
    note: "Rare model output with high projected potential and favorable structure metrics.",
  },
];

export function getBodybuildingGeneticsRanges() {
  return BODYBUILDING_GENETICS_RANGES;
}

export function getBodybuildingGeneticsScale() {
  return {
    min: 0,
    max: 100,
    ticks: [0, 20, 35, 50, 65, 80, 100],
  };
}
