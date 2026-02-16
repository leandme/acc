export type Sex = "male" | "female";

export type FrameRange = {
  key: string;
  label: string;
  min: number;
  max: number;
  rowClass: string;
  color: string;
  note: string;
  adjustment: string;
};

const COLORS = {
  blue: { row: "bg-blue-50", dot: "#3b82f6" },
  green: { row: "bg-green-50", dot: "#22c55e" },
  orange: { row: "bg-orange-50", dot: "#f97316" },
};

const MALE_RANGES: FrameRange[] = [
  {
    key: "large",
    label: "Large Frame",
    min: 0,
    max: 9.6,
    rowClass: COLORS.orange.row,
    color: COLORS.orange.dot,
    note: "Broader skeletal build relative to height.",
    adjustment: "Often +10% vs medium-frame weight targets.",
  },
  {
    key: "medium",
    label: "Medium Frame",
    min: 9.6,
    max: 10.4,
    rowClass: COLORS.green.row,
    color: COLORS.green.dot,
    note: "Average skeletal build for height.",
    adjustment: "Baseline reference for many weight-range charts.",
  },
  {
    key: "small",
    label: "Small Frame",
    min: 10.4,
    max: Infinity,
    rowClass: COLORS.blue.row,
    color: COLORS.blue.dot,
    note: "Narrower skeletal build relative to height.",
    adjustment: "Often -10% vs medium-frame weight targets.",
  },
];

const FEMALE_RANGES: FrameRange[] = [
  {
    key: "large",
    label: "Large Frame",
    min: 0,
    max: 10.1,
    rowClass: COLORS.orange.row,
    color: COLORS.orange.dot,
    note: "Broader skeletal build relative to height.",
    adjustment: "Often +10% vs medium-frame weight targets.",
  },
  {
    key: "medium",
    label: "Medium Frame",
    min: 10.1,
    max: 11,
    rowClass: COLORS.green.row,
    color: COLORS.green.dot,
    note: "Average skeletal build for height.",
    adjustment: "Baseline reference for many weight-range charts.",
  },
  {
    key: "small",
    label: "Small Frame",
    min: 11,
    max: Infinity,
    rowClass: COLORS.blue.row,
    color: COLORS.blue.dot,
    note: "Narrower skeletal build relative to height.",
    adjustment: "Often -10% vs medium-frame weight targets.",
  },
];

export function getFrameRanges(sex: Sex) {
  return sex === "female" ? FEMALE_RANGES : MALE_RANGES;
}

export function findFrameRange(sex: Sex, ratio: number) {
  const rows = getFrameRanges(sex);
  return rows.find((row) => ratio >= row.min && ratio < row.max) ?? rows[rows.length - 1];
}

export function rangeMidpoint(min: number, max: number) {
  if (!Number.isFinite(max)) return min + 0.35;
  return (min + max) / 2;
}
