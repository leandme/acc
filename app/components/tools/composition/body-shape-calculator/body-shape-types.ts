import { STANDARD_BUCKET_COLORS, type RangeBucket } from "@/app/components/tools/body-weight/shared/ui";

export type BodyShapeKey =
  | "hourglass"
  | "pear"
  | "rectangle"
  | "inverted-triangle"
  | "apple";

export type BodyShapeRow = {
  key: BodyShapeKey;
  label: string;
  rowClass: string;
  color: string;
  pattern: string;
  note: string;
};

export const BODY_SHAPE_ROWS: BodyShapeRow[] = [
  {
    key: "hourglass",
    label: "Hourglass",
    rowClass: STANDARD_BUCKET_COLORS.green.row,
    color: STANDARD_BUCKET_COLORS.green.dot,
    pattern: "Upper and lower measurements are similar with a clearly narrower waist.",
    note: "Balanced upper/lower proportions with visible waist definition.",
  },
  {
    key: "pear",
    label: "Pear (Triangle)",
    rowClass: STANDARD_BUCKET_COLORS.yellow.row,
    color: STANDARD_BUCKET_COLORS.yellow.dot,
    pattern: "Hip measurement is larger than upper-body measurement with a defined waist.",
    note: "Lower body is proportionally wider than upper body.",
  },
  {
    key: "rectangle",
    label: "Rectangle",
    rowClass: STANDARD_BUCKET_COLORS.blue.row,
    color: STANDARD_BUCKET_COLORS.blue.dot,
    pattern: "Upper, waist, and hip measurements are closer in size with lower waist contrast.",
    note: "Straighter body-line profile with less waist narrowing.",
  },
  {
    key: "inverted-triangle",
    label: "Inverted Triangle",
    rowClass: STANDARD_BUCKET_COLORS.orange.row,
    color: STANDARD_BUCKET_COLORS.orange.dot,
    pattern: "Upper-body measurement is larger than hip measurement with visible waist taper.",
    note: "Upper body is proportionally wider than lower body.",
  },
  {
    key: "apple",
    label: "Apple (Oval)",
    rowClass: STANDARD_BUCKET_COLORS.red.row,
    color: STANDARD_BUCKET_COLORS.red.dot,
    pattern: "Waist measurement is closer to upper and hip measurements with less taper.",
    note: "More proportional fullness around the midsection.",
  },
];

export const BODY_SHAPE_MATCH_RANGES: RangeBucket[] = [
  {
    key: "low-match",
    label: "Low Match",
    min: 0,
    max: 45,
    rowClass: STANDARD_BUCKET_COLORS.red.row,
    color: STANDARD_BUCKET_COLORS.red.dot,
    note: "Measurements are close across categories; classification confidence is lower.",
    shortLabel: "Low",
  },
  {
    key: "moderate-match",
    label: "Moderate Match",
    min: 45,
    max: 65,
    rowClass: STANDARD_BUCKET_COLORS.yellow.row,
    color: STANDARD_BUCKET_COLORS.yellow.dot,
    note: "Result is usable but nearby categories may still overlap.",
    shortLabel: "Mod",
  },
  {
    key: "strong-match",
    label: "Strong Match",
    min: 65,
    max: 80,
    rowClass: STANDARD_BUCKET_COLORS.green.row,
    color: STANDARD_BUCKET_COLORS.green.dot,
    note: "Measurements align clearly with one shape category.",
    shortLabel: "Strong",
  },
  {
    key: "very-strong-match",
    label: "Very Strong Match",
    min: 80,
    max: Infinity,
    rowClass: STANDARD_BUCKET_COLORS.blue.row,
    color: STANDARD_BUCKET_COLORS.blue.dot,
    note: "High separation from other categories using current measurements.",
    shortLabel: "V Strong",
  },
];

export function getBodyShapeRow(key: BodyShapeKey) {
  return BODY_SHAPE_ROWS.find((row) => row.key === key) ?? BODY_SHAPE_ROWS[0];
}
