import { STANDARD_BUCKET_COLORS, type RangeBucket } from "@/app/components/tools/body-weight/shared/ui";

const BMI_BOUNDARIES = [18.5, 25, 30, 35, 40] as const;

export function ponderalFromBmiBoundary(heightM: number, bmiBoundary: number) {
  if (heightM <= 0) return 0;
  return bmiBoundary / heightM;
}

export function buildPonderalRanges(heightM: number): RangeBucket[] {
  const [b18, b25, b30, b35, b40] = BMI_BOUNDARIES.map((boundary) =>
    ponderalFromBmiBoundary(heightM, boundary),
  );

  return [
    {
      key: "underweight",
      label: "Underweight Equivalent",
      min: 0,
      max: b18,
      rowClass: STANDARD_BUCKET_COLORS.blue.row,
      color: STANDARD_BUCKET_COLORS.blue.dot,
      note: "Ponderal-index equivalent to BMI below 18.5 at your current height.",
      shortLabel: "Under",
    },
    {
      key: "healthy",
      label: "Healthy Equivalent",
      min: b18,
      max: b25,
      rowClass: STANDARD_BUCKET_COLORS.green.row,
      color: STANDARD_BUCKET_COLORS.green.dot,
      note: "Equivalent to BMI 18.5-24.9 for your current height.",
      shortLabel: "Healthy",
    },
    {
      key: "overweight",
      label: "Overweight Equivalent",
      min: b25,
      max: b30,
      rowClass: STANDARD_BUCKET_COLORS.yellow.row,
      color: STANDARD_BUCKET_COLORS.yellow.dot,
      note: "Equivalent to BMI 25.0-29.9 for your current height.",
      shortLabel: "Over",
    },
    {
      key: "obesity-class-1",
      label: "Obesity I Equivalent",
      min: b30,
      max: b35,
      rowClass: STANDARD_BUCKET_COLORS.orange.row,
      color: STANDARD_BUCKET_COLORS.orange.dot,
      note: "Equivalent to BMI 30.0-34.9 for your current height.",
      shortLabel: "Class I",
    },
    {
      key: "obesity-class-2",
      label: "Obesity II Equivalent",
      min: b35,
      max: b40,
      rowClass: STANDARD_BUCKET_COLORS.red.row,
      color: STANDARD_BUCKET_COLORS.red.dot,
      note: "Equivalent to BMI 35.0-39.9 for your current height.",
      shortLabel: "Class II",
    },
    {
      key: "obesity-class-3",
      label: "Obesity III Equivalent",
      min: b40,
      max: Infinity,
      rowClass: STANDARD_BUCKET_COLORS.purple.row,
      color: STANDARD_BUCKET_COLORS.purple.dot,
      note: "Equivalent to BMI >=40.0 for your current height.",
      shortLabel: "Class III",
    },
  ];
}
