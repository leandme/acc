export type BRIRange = {
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
  orange: { row: "bg-orange-50", dot: "#f97316" },
  red: { row: "bg-red-50", dot: "#ef4444" },
};

const BRI_RANGES: BRIRange[] = [
  {
    key: "very-lean",
    label: "Very Lean",
    min: 0,
    max: 3.41,
    rowClass: COLORS.blue.row,
    color: COLORS.blue.dot,
    note: "Lower roundness profile relative to height and waist.",
  },
  {
    key: "lean",
    label: "Lean",
    min: 3.41,
    max: 4.45,
    rowClass: COLORS.green.row,
    color: COLORS.green.dot,
    note: "Leaner waist-to-height profile for most adults.",
  },
  {
    key: "average",
    label: "Average",
    min: 4.45,
    max: 5.46,
    rowClass: COLORS.yellow.row,
    color: COLORS.yellow.dot,
    note: "Mid-range body roundness; best interpreted with trend data.",
  },
  {
    key: "above-average",
    label: "Above Average",
    min: 5.46,
    max: 6.91,
    rowClass: COLORS.orange.row,
    color: COLORS.orange.dot,
    note: "Higher waist-centered roundness compared with average ranges.",
  },
  {
    key: "high-roundness",
    label: "High Roundness",
    min: 6.91,
    max: Infinity,
    rowClass: COLORS.red.row,
    color: COLORS.red.dot,
    note: "High roundness profile; use with clinical context and long-term trends.",
  },
];

export function getBRIRanges() {
  return BRI_RANGES;
}

export function findBRIRange(value: number) {
  return BRI_RANGES.find((row) => value >= row.min && value < row.max) ?? BRI_RANGES[BRI_RANGES.length - 1];
}

export function rangeMidpoint(min: number, max: number) {
  if (!Number.isFinite(max)) return min + 0.75;
  return (min + max) / 2;
}
