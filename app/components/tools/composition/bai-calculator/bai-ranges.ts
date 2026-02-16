export type Sex = "male" | "female";

export type BAIAgeBand = "20-39" | "40-59" | "60-79";

export type BAIRange = {
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
  orange: { row: "bg-orange-50", dot: "#f97316" },
  red: { row: "bg-red-50", dot: "#ef4444" },
};

type BandThresholds = {
  underMax: number;
  healthyMax: number;
  overweightMax: number;
};

const THRESHOLDS: Record<Sex, Record<BAIAgeBand, BandThresholds>> = {
  male: {
    "20-39": { underMax: 8, healthyMax: 21, overweightMax: 26 },
    "40-59": { underMax: 11, healthyMax: 23, overweightMax: 29 },
    "60-79": { underMax: 13, healthyMax: 25, overweightMax: 31 },
  },
  female: {
    "20-39": { underMax: 21, healthyMax: 33, overweightMax: 39 },
    "40-59": { underMax: 23, healthyMax: 35, overweightMax: 41 },
    "60-79": { underMax: 25, healthyMax: 38, overweightMax: 43 },
  },
};

export function getAgeBand(age: number): BAIAgeBand {
  if (age >= 60) return "60-79";
  if (age >= 40) return "40-59";
  return "20-39";
}

export function getBAIRanges(sex: Sex, age: number): BAIRange[] {
  const ageBand = getAgeBand(age);
  const t = THRESHOLDS[sex][ageBand];

  return [
    {
      key: "underweight",
      label: "Underweight",
      min: 0,
      max: t.underMax,
      rowClass: COLORS.blue.row,
      color: COLORS.blue.dot,
      note: "Lower-than-typical adiposity for this sex and age band.",
    },
    {
      key: "healthy",
      label: "Healthy",
      min: t.underMax,
      max: t.healthyMax,
      rowClass: COLORS.green.row,
      color: COLORS.green.dot,
      note: "Typical healthy adiposity range for this sex and age band.",
    },
    {
      key: "overweight",
      label: "Overweight",
      min: t.healthyMax,
      max: t.overweightMax,
      rowClass: COLORS.orange.row,
      color: COLORS.orange.dot,
      note: "Elevated adiposity range relative to this sex and age band.",
    },
    {
      key: "obese",
      label: "Obese",
      min: t.overweightMax,
      max: Infinity,
      rowClass: COLORS.red.row,
      color: COLORS.red.dot,
      note: "High adiposity range; prioritize sustainable long-term habits.",
    },
  ];
}

export function findBAIRange(sex: Sex, age: number, bai: number) {
  const rows = getBAIRanges(sex, age);
  return rows.find((row) => bai >= row.min && bai < row.max) ?? rows[rows.length - 1];
}

export function rangeMidpoint(min: number, max: number) {
  if (!Number.isFinite(max)) return min + 2;
  return (min + max) / 2;
}
