import { clamp, type Sex } from "@/app/components/tools/body-weight/shared/math";

const SEX_OFFSET_CM = 13;

const ADULT_HEIGHT_DISTRIBUTION: Record<Sex, { meanCm: number; sdCm: number }> = {
  male: { meanCm: 175.4, sdCm: 7.0 },
  female: { meanCm: 161.8, sdCm: 6.5 },
};

export function getAdultHeightDistribution(sex: Sex) {
  return ADULT_HEIGHT_DISTRIBUTION[sex];
}

export function getMidParentalTargetCm(fatherHeightCm: number, motherHeightCm: number, childSex: Sex) {
  if (childSex === "male") return (fatherHeightCm + motherHeightCm + SEX_OFFSET_CM) / 2;
  return (fatherHeightCm + motherHeightCm - SEX_OFFSET_CM) / 2;
}

export function getTargetRangeCm(targetCm: number, halfRangeCm = 8.5) {
  return {
    lowerCm: targetCm - halfRangeCm,
    upperCm: targetCm + halfRangeCm,
  };
}

function erfApprox(x: number) {
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1 / (1 + p * absX);
  const y =
    1 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) *
      Math.exp(-absX * absX);

  return sign * y;
}

export function normalCdf(z: number) {
  return 0.5 * (1 + erfApprox(z / Math.sqrt(2)));
}

export function getPopulationHeightPercentile(heightCm: number, sex: Sex) {
  const { meanCm, sdCm } = getAdultHeightDistribution(sex);
  const z = (heightCm - meanCm) / sdCm;
  return clamp(normalCdf(z) * 100, 0, 100);
}

export function getProbabilityAtLeastHeight(
  targetHeightCm: number,
  expectedMeanCm: number,
  expectedSdCm = 6.5,
) {
  const z = (targetHeightCm - expectedMeanCm) / expectedSdCm;
  const tail = 1 - normalCdf(z);
  return clamp(tail * 100, 0, 100);
}
