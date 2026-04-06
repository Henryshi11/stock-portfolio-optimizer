export function sumWeights(weights) {
  return weights.reduce((sum, value) => sum + value, 0);
}

export function isWithinBounds(weights, maxWeight = 1) {
  return weights.every((weight) => weight >= -1e-8 && weight <= maxWeight + 1e-8);
}

export function sumsToOne(weights, tolerance = 1e-6) {
  return Math.abs(sumWeights(weights) - 1) <= tolerance;
}

export function isFeasible(weights, maxWeight = 1, tolerance = 1e-6) {
  return isWithinBounds(weights, maxWeight) && sumsToOne(weights, tolerance);
}

export function clampWeights(weights, maxWeight = 1) {
  return weights.map((weight) => Math.min(maxWeight, Math.max(0, weight)));
}

export function createEqualWeights(n) {
  if (n <= 0) {
    return [];
  }
  return new Array(n).fill(1 / n);
}