export function safeDivide(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return numerator / denominator;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
