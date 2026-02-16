export type Gender = "male" | "female";

export type LeanMassRange = {
  key: string;
  label: string;
  min: number;
  max: number;
  rowClass: string;
  color: string;
  note: string;
};

const COLORS = {
  red: { row: "bg-red-50", dot: "#ef4444" },
  orange: { row: "bg-orange-50", dot: "#f97316" },
  yellow: { row: "bg-yellow-50", dot: "#fde047" },
  green: { row: "bg-green-50", dot: "#22c55e" },
  teal: { row: "bg-emerald-50", dot: "#10b981" },
  blue: { row: "bg-blue-50", dot: "#3b82f6" },
  purple: { row: "bg-violet-50", dot: "#7c3aed" },
};

const MALE_RANGES: LeanMassRange[] = [
  {
    key: "very-low",
    label: "Very Low",
    min: 0,
    max: 70,
    rowClass: COLORS.red.row,
    color: COLORS.red.dot,
    note: "Lower lean-mass share for body weight. Recheck measurements and monitor trends.",
  },
  {
    key: "low",
    label: "Low",
    min: 70,
    max: 75,
    rowClass: COLORS.orange.row,
    color: COLORS.orange.dot,
    note: "Below typical male lean-mass percentage ranges.",
  },
  {
    key: "healthy",
    label: "Healthy",
    min: 75,
    max: 80,
    rowClass: COLORS.yellow.row,
    color: COLORS.yellow.dot,
    note: "Within common healthy lean-mass ranges for men.",
  },
  {
    key: "good",
    label: "Good",
    min: 80,
    max: 85,
    rowClass: COLORS.green.row,
    color: COLORS.green.dot,
    note: "Solid lean-mass share often seen with regular training.",
  },
  {
    key: "athletic",
    label: "Athletic",
    min: 85,
    max: 90,
    rowClass: COLORS.teal.row,
    color: COLORS.teal.dot,
    note: "Athletic range with higher lean-mass proportion.",
  },
  {
    key: "exceptional",
    label: "Exceptional",
    min: 90,
    max: 95,
    rowClass: COLORS.blue.row,
    color: COLORS.blue.dot,
    note: "Unusually high lean-mass percentage. Verify inputs for realism.",
  },
  {
    key: "rare",
    label: "Rare",
    min: 95,
    max: Infinity,
    rowClass: COLORS.purple.row,
    color: COLORS.purple.dot,
    note: "Very rare naturally. Double-check height and weight entries.",
  },
];

const FEMALE_RANGES: LeanMassRange[] = [
  {
    key: "very-low",
    label: "Very Low",
    min: 0,
    max: 60,
    rowClass: COLORS.red.row,
    color: COLORS.red.dot,
    note: "Lower lean-mass share for body weight. Recheck measurements and monitor trends.",
  },
  {
    key: "low",
    label: "Low",
    min: 60,
    max: 68,
    rowClass: COLORS.orange.row,
    color: COLORS.orange.dot,
    note: "Below typical female lean-mass percentage ranges.",
  },
  {
    key: "healthy",
    label: "Healthy",
    min: 68,
    max: 74,
    rowClass: COLORS.yellow.row,
    color: COLORS.yellow.dot,
    note: "Within common healthy lean-mass ranges for women.",
  },
  {
    key: "good",
    label: "Good",
    min: 74,
    max: 80,
    rowClass: COLORS.green.row,
    color: COLORS.green.dot,
    note: "Solid lean-mass share often seen with regular training.",
  },
  {
    key: "athletic",
    label: "Athletic",
    min: 80,
    max: 86,
    rowClass: COLORS.teal.row,
    color: COLORS.teal.dot,
    note: "Athletic range with higher lean-mass proportion.",
  },
  {
    key: "exceptional",
    label: "Exceptional",
    min: 86,
    max: 92,
    rowClass: COLORS.blue.row,
    color: COLORS.blue.dot,
    note: "Unusually high lean-mass percentage. Verify inputs for realism.",
  },
  {
    key: "rare",
    label: "Rare",
    min: 92,
    max: Infinity,
    rowClass: COLORS.purple.row,
    color: COLORS.purple.dot,
    note: "Very rare naturally. Double-check height and weight entries.",
  },
];

export function getLeanMassRanges(gender: Gender) {
  return gender === "female" ? FEMALE_RANGES : MALE_RANGES;
}

export function findLeanMassRange(gender: Gender, leanMassPct: number) {
  const rows = getLeanMassRanges(gender);
  return rows.find((row) => leanMassPct >= row.min && leanMassPct < row.max) ?? rows[0];
}

export function leanMassRangeMidpoint(range: Pick<LeanMassRange, "min" | "max">) {
  if (!Number.isFinite(range.max)) {
    return range.min + 2;
  }

  return (range.min + range.max) / 2;
}
