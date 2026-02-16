export type Units = "imperial" | "metric";
export type Sex = "male" | "female";

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function round(n: number, digits = 1) {
  const factor = Math.pow(10, digits);
  return Math.round(n * factor) / factor;
}

export function lbToKg(lb: number) {
  return lb * 0.45359237;
}

export function kgToLb(kg: number) {
  return kg / 0.45359237;
}

export function inToCm(inches: number) {
  return inches * 2.54;
}

export function cmToIn(cm: number) {
  return cm / 2.54;
}

export function cmToM(cm: number) {
  return cm / 100;
}

export function mToCm(m: number) {
  return m * 100;
}

export function formatFeetInches(totalInches: number) {
  const rounded = Math.round(totalInches);
  const feet = Math.floor(rounded / 12);
  const inches = rounded % 12;
  return `${feet} ft ${inches} in`;
}

export function safeDiv(numerator: number, denominator: number) {
  if (denominator === 0) return 0;
  return numerator / denominator;
}
