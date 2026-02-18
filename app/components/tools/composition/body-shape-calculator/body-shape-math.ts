import { clamp, safeDiv } from "@/app/components/tools/body-weight/shared/math";
import { BODY_SHAPE_ROWS, type BodyShapeKey } from "@/app/components/tools/composition/body-shape-calculator/body-shape-types";

export type BodyShapeResult = {
  shape: BodyShapeKey;
  scores: Record<BodyShapeKey, number>;
  topScore: number;
  bustToHip: number;
  waistToBust: number;
  waistToHip: number;
};

function roundedScore(value: number) {
  return Math.round(clamp(value, 0, 100));
}

export function estimateBodyShape(params: {
  bustCm: number;
  waistCm: number;
  hipCm: number;
}): BodyShapeResult {
  const bustCm = Math.max(params.bustCm, 1);
  const waistCm = Math.max(params.waistCm, 1);
  const hipCm = Math.max(params.hipCm, 1);

  const maxUpperLower = Math.max(bustCm, hipCm);
  const minUpperLower = Math.min(bustCm, hipCm);

  const symmetry = 1 - clamp(Math.abs(bustCm - hipCm) / maxUpperLower, 0, 1);
  const waistDefinition = clamp((minUpperLower - waistCm) / (minUpperLower * 0.35), 0, 1);
  const waistFullness = clamp((waistCm - minUpperLower * 0.78) / (minUpperLower * 0.35), 0, 1);
  const hipDominance = clamp((hipCm - bustCm) / (maxUpperLower * 0.2), 0, 1);
  const upperDominance = clamp((bustCm - hipCm) / (maxUpperLower * 0.2), 0, 1);

  const scores: Record<BodyShapeKey, number> = {
    hourglass: roundedScore(55 * symmetry + 45 * waistDefinition),
    pear: roundedScore(65 * hipDominance + 35 * waistDefinition),
    rectangle: roundedScore(70 * (1 - waistDefinition) + 30 * symmetry),
    "inverted-triangle": roundedScore(65 * upperDominance + 35 * waistDefinition),
    apple: roundedScore(70 * waistFullness + 30 * (1 - waistDefinition)),
  };

  const winner = [...BODY_SHAPE_ROWS]
    .sort((a, b) => scores[b.key] - scores[a.key])[0];

  return {
    shape: winner.key,
    scores,
    topScore: scores[winner.key],
    bustToHip: safeDiv(bustCm, hipCm),
    waistToBust: safeDiv(waistCm, bustCm),
    waistToHip: safeDiv(waistCm, hipCm),
  };
}
