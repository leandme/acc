export type Sex = "male" | "female";

export type BodyFatRange = {
  key: string;
  label: string;
  min: number;
  max: number;
  rowClass: string;
  color: string;
  note: string;
};

const COLORS = {
  blue: { row: "bg-blue-50", dot: "#3b82f6" },
  green: { row: "bg-green-50", dot: "#22c55e" },
  yellow: { row: "bg-yellow-50", dot: "#fde047" },
  amber: { row: "bg-amber-50", dot: "#f59e0b" },
  orange: { row: "bg-orange-50", dot: "#f97316" },
  red: { row: "bg-red-50", dot: "#ef4444" },
};

const MALE_RANGES: BodyFatRange[] = [
  {
    key: "essential",
    label: "Essential",
    min: 0,
    max: 6,
    rowClass: COLORS.blue.row,
    color: COLORS.blue.dot,
    note: "Extremely lean and difficult to sustain for most people.",
  },
  {
    key: "athletic",
    label: "Athletic",
    min: 6,
    max: 14,
    rowClass: COLORS.green.row,
    color: COLORS.green.dot,
    note: "Lean, performance-focused range with visible definition.",
  },
  {
    key: "fit",
    label: "Fit",
    min: 14,
    max: 18,
    rowClass: COLORS.yellow.row,
    color: COLORS.yellow.dot,
    note: "Lean and sustainable for many trained adults.",
  },
  {
    key: "average",
    label: "Average",
    min: 18,
    max: 25,
    rowClass: COLORS.amber.row,
    color: COLORS.amber.dot,
    note: "Common adult range. Trend direction matters most.",
  },
  {
    key: "high",
    label: "High",
    min: 25,
    max: 32,
    rowClass: COLORS.orange.row,
    color: COLORS.orange.dot,
    note: "Higher body-fat range. Focus on consistent habits and trend tracking.",
  },
  {
    key: "very-high",
    label: "Very High",
    min: 32,
    max: Infinity,
    rowClass: COLORS.red.row,
    color: COLORS.red.dot,
    note: "Very high range. Prioritize sustainable routines and consistency.",
  },
];

const FEMALE_RANGES: BodyFatRange[] = [
  {
    key: "essential",
    label: "Essential",
    min: 0,
    max: 14,
    rowClass: COLORS.blue.row,
    color: COLORS.blue.dot,
    note: "Extremely lean and difficult to sustain for most people.",
  },
  {
    key: "athletic",
    label: "Athletic",
    min: 14,
    max: 21,
    rowClass: COLORS.green.row,
    color: COLORS.green.dot,
    note: "Lean, performance-focused range with visible definition.",
  },
  {
    key: "fit",
    label: "Fit",
    min: 21,
    max: 28,
    rowClass: COLORS.yellow.row,
    color: COLORS.yellow.dot,
    note: "Balanced and sustainable range for many active women.",
  },
  {
    key: "average",
    label: "Average",
    min: 28,
    max: 35,
    rowClass: COLORS.amber.row,
    color: COLORS.amber.dot,
    note: "Common adult range. Track multi-week trends, not single readings.",
  },
  {
    key: "high",
    label: "High",
    min: 35,
    max: 42,
    rowClass: COLORS.orange.row,
    color: COLORS.orange.dot,
    note: "Higher body-fat range. Keep measurements consistent for useful tracking.",
  },
  {
    key: "very-high",
    label: "Very High",
    min: 42,
    max: Infinity,
    rowClass: COLORS.red.row,
    color: COLORS.red.dot,
    note: "Very high range. Use sustainable changes and long-term tracking.",
  },
];

export function getSkinfoldRanges(sex: Sex) {
  return sex === "female" ? FEMALE_RANGES : MALE_RANGES;
}

export function findSkinfoldRange(sex: Sex, bodyFatPct: number) {
  const rows = getSkinfoldRanges(sex);
  return rows.find((row) => bodyFatPct >= row.min && bodyFatPct < row.max) ?? rows[rows.length - 1];
}

export function rangeMidpoint(min: number, max: number) {
  if (max === Infinity) return min + 2;
  return (min + max) / 2;
}
