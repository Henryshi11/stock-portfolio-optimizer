export function projectToCappedSimplex(z, maxWeight = 1, tolerance = 1e-8, maxIterations = 100) {
  let low = Math.min(...z) - maxWeight
  let high = Math.max(...z)

  for (let iter = 0; iter < maxIterations; iter++) {
    const tau = (low + high) / 2
    const projected = z.map((value) => Math.min(maxWeight, Math.max(0, value - tau)))
    const sum = projected.reduce((a, b) => a + b, 0)

    if (Math.abs(sum - 1) < tolerance) {
      return projected
    }

    if (sum > 1) {
      low = tau
    } else {
      high = tau
    }
  }

  return z.map((value) => Math.min(maxWeight, Math.max(0, value)))
}
