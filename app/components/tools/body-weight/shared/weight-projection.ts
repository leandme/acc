import { clamp, type Sex } from "./math";

export type ActivityLevelKey =
  | "sedentary"
  | "light"
  | "moderate"
  | "very"
  | "extra";

export type ActivityLevel = {
  key: ActivityLevelKey;
  label: string;
  factor: number;
  note: string;
};

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  {
    key: "sedentary",
    label: "Sedentary",
    factor: 1.2,
    note: "Mostly sitting; minimal planned exercise.",
  },
  {
    key: "light",
    label: "Lightly Active",
    factor: 1.375,
    note: "Light exercise 1-3 days/week.",
  },
  {
    key: "moderate",
    label: "Moderately Active",
    factor: 1.55,
    note: "Moderate exercise 3-5 days/week.",
  },
  {
    key: "very",
    label: "Very Active",
    factor: 1.725,
    note: "Hard exercise most days.",
  },
  {
    key: "extra",
    label: "Extra Active",
    factor: 1.9,
    note: "Very hard training or highly physical work.",
  },
];

export function getActivityLevel(key: ActivityLevelKey) {
  return ACTIVITY_LEVELS.find((level) => level.key === key) ?? ACTIVITY_LEVELS[2];
}

export function mifflinStJeorBmr(params: {
  sex: Sex;
  ageYears: number;
  heightCm: number;
  weightKg: number;
}) {
  const { sex, ageYears, heightCm, weightKg } = params;
  const sexConstant = sex === "male" ? 5 : -161;
  return 10 * weightKg + 6.25 * heightCm - 5 * ageYears + sexConstant;
}

type ProjectionParams = {
  sex: Sex;
  ageYears: number;
  heightCm: number;
  startWeightKg: number;
  activityFactor: number;
  days: number;
  intakeForDay: (dayIndex: number) => number;
};

export function simulateWeightProjection(params: ProjectionParams) {
  const { sex, ageYears, heightCm, startWeightKg, activityFactor, days, intakeForDay } = params;

  let weightKg = startWeightKg;
  let totalDeficitKcal = 0;

  for (let day = 0; day < days; day += 1) {
    const bmr = mifflinStJeorBmr({
      sex,
      ageYears,
      heightCm,
      weightKg,
    });

    const tdee = bmr * activityFactor;
    const intake = clamp(intakeForDay(day), 0, 10000);
    const deficit = tdee - intake;

    totalDeficitKcal += deficit;

    // 7,700 kcal per kg is an approximation; using daily recalculated TDEE makes the model adaptive.
    const deltaKg = deficit / 7700;
    weightKg = clamp(weightKg - deltaKg, 30, 400);
  }

  const totalLossKg = startWeightKg - weightKg;
  const avgDailyDeficit = days > 0 ? totalDeficitKcal / days : 0;

  return {
    endWeightKg: weightKg,
    totalLossKg,
    averageDailyDeficitKcal: avgDailyDeficit,
  };
}

export function estimateDaysToTarget(params: {
  sex: Sex;
  ageYears: number;
  heightCm: number;
  startWeightKg: number;
  targetWeightKg: number;
  activityFactor: number;
  intakeKcalPerDay: number;
  maxDays?: number;
}) {
  const {
    sex,
    ageYears,
    heightCm,
    startWeightKg,
    targetWeightKg,
    activityFactor,
    intakeKcalPerDay,
    maxDays = 5 * 365,
  } = params;

  if (targetWeightKg >= startWeightKg) return 0;

  let weightKg = startWeightKg;

  for (let day = 1; day <= maxDays; day += 1) {
    const bmr = mifflinStJeorBmr({ sex, ageYears, heightCm, weightKg });
    const tdee = bmr * activityFactor;
    const deficit = tdee - intakeKcalPerDay;

    if (deficit <= 0) return null;

    weightKg = clamp(weightKg - deficit / 7700, 30, 400);

    if (weightKg <= targetWeightKg) {
      return day;
    }
  }

  return null;
}
