import type { Sex } from "@/app/components/tools/body-weight/shared/math";
import { STANDARD_BUCKET_COLORS, type RangeBucket } from "@/app/components/tools/body-weight/shared/ui";

export function getShoulderToWaistRanges(sex: Sex): RangeBucket[] {
  if (sex === "female") {
    return [
      {
        key: "lower-taper",
        label: "Lower Taper",
        min: 0,
        max: 1.15,
        rowClass: STANDARD_BUCKET_COLORS.blue.row,
        color: STANDARD_BUCKET_COLORS.blue.dot,
        note: "Shoulder-to-waist taper appears lower in this range.",
        shortLabel: "<1.15",
      },
      {
        key: "balanced",
        label: "Balanced",
        min: 1.15,
        max: 1.3,
        rowClass: STANDARD_BUCKET_COLORS.green.row,
        color: STANDARD_BUCKET_COLORS.green.dot,
        note: "Balanced shoulder-to-waist proportion range.",
        shortLabel: "1.15-1.29",
      },
      {
        key: "tapered",
        label: "Tapered",
        min: 1.3,
        max: 1.45,
        rowClass: STANDARD_BUCKET_COLORS.yellow.row,
        color: STANDARD_BUCKET_COLORS.yellow.dot,
        note: "More visible shoulder taper relative to waist circumference.",
        shortLabel: "1.30-1.44",
      },
      {
        key: "pronounced",
        label: "Pronounced Taper",
        min: 1.45,
        max: Infinity,
        rowClass: STANDARD_BUCKET_COLORS.purple.row,
        color: STANDARD_BUCKET_COLORS.purple.dot,
        note: "Pronounced V-taper profile from circumference ratio.",
        shortLabel: ">=1.45",
      },
    ];
  }

  return [
    {
      key: "lower-taper",
      label: "Lower Taper",
      min: 0,
      max: 1.3,
      rowClass: STANDARD_BUCKET_COLORS.blue.row,
      color: STANDARD_BUCKET_COLORS.blue.dot,
      note: "Shoulder-to-waist taper appears lower in this range.",
      shortLabel: "<1.30",
    },
    {
      key: "balanced",
      label: "Balanced",
      min: 1.3,
      max: 1.45,
      rowClass: STANDARD_BUCKET_COLORS.green.row,
      color: STANDARD_BUCKET_COLORS.green.dot,
      note: "Balanced shoulder-to-waist proportion range.",
      shortLabel: "1.30-1.44",
    },
    {
      key: "athletic",
      label: "Athletic Taper",
      min: 1.45,
      max: 1.6,
      rowClass: STANDARD_BUCKET_COLORS.yellow.row,
      color: STANDARD_BUCKET_COLORS.yellow.dot,
      note: "Visible shoulder dominance relative to waist size.",
      shortLabel: "1.45-1.59",
    },
    {
      key: "pronounced",
      label: "Pronounced Taper",
      min: 1.6,
      max: Infinity,
      rowClass: STANDARD_BUCKET_COLORS.purple.row,
      color: STANDARD_BUCKET_COLORS.purple.dot,
      note: "Strong V-taper profile from circumference ratio.",
      shortLabel: ">=1.60",
    },
  ];
}
