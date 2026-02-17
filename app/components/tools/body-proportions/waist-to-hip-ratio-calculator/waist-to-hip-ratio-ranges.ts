import type { Sex } from "@/app/components/tools/body-weight/shared/math";
import { STANDARD_BUCKET_COLORS, type RangeBucket } from "@/app/components/tools/body-weight/shared/ui";

export function getWaistToHipRanges(sex: Sex): RangeBucket[] {
  if (sex === "female") {
    return [
      {
        key: "low-risk",
        label: "Low Risk",
        min: 0,
        max: 0.8,
        rowClass: STANDARD_BUCKET_COLORS.green.row,
        color: STANDARD_BUCKET_COLORS.green.dot,
        note: "Lower central-fat risk category for adult women in this model.",
        shortLabel: "Low",
      },
      {
        key: "moderate-risk",
        label: "Moderate Risk",
        min: 0.8,
        max: 0.85,
        rowClass: STANDARD_BUCKET_COLORS.yellow.row,
        color: STANDARD_BUCKET_COLORS.yellow.dot,
        note: "Intermediate risk range; monitor waist and body-composition trends.",
        shortLabel: "Mod",
      },
      {
        key: "high-risk",
        label: "High Risk",
        min: 0.85,
        max: Infinity,
        rowClass: STANDARD_BUCKET_COLORS.red.row,
        color: STANDARD_BUCKET_COLORS.red.dot,
        note: "Higher central-fat risk category for adult women in this model.",
        shortLabel: "High",
      },
    ];
  }

  return [
    {
      key: "low-risk",
      label: "Low Risk",
      min: 0,
      max: 0.9,
      rowClass: STANDARD_BUCKET_COLORS.green.row,
      color: STANDARD_BUCKET_COLORS.green.dot,
      note: "Lower central-fat risk category for adult men in this model.",
      shortLabel: "Low",
    },
    {
      key: "moderate-risk",
      label: "Moderate Risk",
      min: 0.9,
      max: 1,
      rowClass: STANDARD_BUCKET_COLORS.yellow.row,
      color: STANDARD_BUCKET_COLORS.yellow.dot,
      note: "Intermediate risk range; monitor waist and body-composition trends.",
      shortLabel: "Mod",
    },
    {
      key: "high-risk",
      label: "High Risk",
      min: 1,
      max: Infinity,
      rowClass: STANDARD_BUCKET_COLORS.red.row,
      color: STANDARD_BUCKET_COLORS.red.dot,
      note: "Higher central-fat risk category for adult men in this model.",
      shortLabel: "High",
    },
  ];
}

