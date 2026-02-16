import type { Sex } from "@/app/components/tools/body-weight/shared/math";
import {
  STANDARD_BUCKET_COLORS,
  type RangeBucket,
} from "@/app/components/tools/body-weight/shared/ui";

const MALE_MUSCLE_MASS_PCT_RANGES: RangeBucket[] = [
  {
    key: "low",
    label: "Low Relative Muscle",
    min: 0,
    max: 31.5,
    rowClass: STANDARD_BUCKET_COLORS.blue.row,
    color: STANDARD_BUCKET_COLORS.blue.dot,
    note: "Below common adult reference bands for relative skeletal muscle mass.",
    shortLabel: "<31.5",
  },
  {
    key: "reduced",
    label: "Reduced Relative Muscle",
    min: 31.5,
    max: 37,
    rowClass: STANDARD_BUCKET_COLORS.green.row,
    color: STANDARD_BUCKET_COLORS.green.dot,
    note: "Lower-middle range in relative muscle mass index literature.",
    shortLabel: "31.5-37",
  },
  {
    key: "reference",
    label: "Reference Range",
    min: 37,
    max: 43,
    rowClass: STANDARD_BUCKET_COLORS.yellow.row,
    color: STANDARD_BUCKET_COLORS.yellow.dot,
    note: "Common reference band for adult men.",
    shortLabel: "37-43",
  },
  {
    key: "high",
    label: "High Relative Muscle",
    min: 43,
    max: 48,
    rowClass: STANDARD_BUCKET_COLORS.orange.row,
    color: STANDARD_BUCKET_COLORS.orange.dot,
    note: "Higher relative muscle percentage than typical adult reference ranges.",
    shortLabel: "43-48",
  },
  {
    key: "very-high",
    label: "Very High Relative Muscle",
    min: 48,
    max: Infinity,
    rowClass: STANDARD_BUCKET_COLORS.red.row,
    color: STANDARD_BUCKET_COLORS.red.dot,
    note: "Very high relative muscle percentage. Verify measurements and assumptions.",
    shortLabel: "48+",
  },
];

const FEMALE_MUSCLE_MASS_PCT_RANGES: RangeBucket[] = [
  {
    key: "low",
    label: "Low Relative Muscle",
    min: 0,
    max: 22.1,
    rowClass: STANDARD_BUCKET_COLORS.blue.row,
    color: STANDARD_BUCKET_COLORS.blue.dot,
    note: "Below common adult reference bands for relative skeletal muscle mass.",
    shortLabel: "<22.1",
  },
  {
    key: "reduced",
    label: "Reduced Relative Muscle",
    min: 22.1,
    max: 28,
    rowClass: STANDARD_BUCKET_COLORS.green.row,
    color: STANDARD_BUCKET_COLORS.green.dot,
    note: "Lower-middle range in relative muscle mass index literature.",
    shortLabel: "22.1-28",
  },
  {
    key: "reference",
    label: "Reference Range",
    min: 28,
    max: 35,
    rowClass: STANDARD_BUCKET_COLORS.yellow.row,
    color: STANDARD_BUCKET_COLORS.yellow.dot,
    note: "Common reference band for adult women.",
    shortLabel: "28-35",
  },
  {
    key: "high",
    label: "High Relative Muscle",
    min: 35,
    max: 40,
    rowClass: STANDARD_BUCKET_COLORS.orange.row,
    color: STANDARD_BUCKET_COLORS.orange.dot,
    note: "Higher relative muscle percentage than typical adult reference ranges.",
    shortLabel: "35-40",
  },
  {
    key: "very-high",
    label: "Very High Relative Muscle",
    min: 40,
    max: Infinity,
    rowClass: STANDARD_BUCKET_COLORS.red.row,
    color: STANDARD_BUCKET_COLORS.red.dot,
    note: "Very high relative muscle percentage. Verify measurements and assumptions.",
    shortLabel: "40+",
  },
];

export function getMuscleMassPctRanges(sex: Sex): RangeBucket[] {
  return sex === "male"
    ? MALE_MUSCLE_MASS_PCT_RANGES
    : FEMALE_MUSCLE_MASS_PCT_RANGES;
}

export function getMuscleMassScale(sex: Sex) {
  if (sex === "male") {
    return {
      min: 20,
      max: 55,
      ticks: [20, 25, 30, 35, 40, 45, 50, 55],
    };
  }

  return {
    min: 15,
    max: 45,
    ticks: [15, 20, 25, 30, 35, 40, 45],
  };
}
