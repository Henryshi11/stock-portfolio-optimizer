function cappedSimplexSum(z, tau, maxWeight) {
  let sum = 0;

  for (let i = 0; i < z.length; i++) {
    sum += Math.min(maxWeight, Math.max(0, z[i] - tau));
  }

  return sum;
}

export function projectToCappedSimplex(
  z,
  maxWeight = 1,
  tolerance = 1e-8,
  maxIterations = 100
) {
  if (!Array.isArray(z) || z.length === 0) {
    return [];
  }

  let low = Math.min(...z) - maxWeight;
  let high = Math.max(...z);

  for (let iter = 0; iter < maxIterations; iter++) {
    const tau = (low + high) / 2;
    const currentSum = cappedSimplexSum(z, tau, maxWeight);

    if (Math.abs(currentSum - 1) < tolerance) {
      return z.map((value) => Math.min(maxWeight, Math.max(0, value - tau)));
    }

    if (currentSum > 1) {
      low = tau;
    } else {
      high = tau;
    }
  }

  const tau = (low + high) / 2;
  return z.map((value) => Math.min(maxWeight, Math.max(0, value - tau)));
}

export function projectToSimplex(z, tolerance = 1e-8, maxIterations = 100) {
  return projectToCappedSimplex(z, 1, tolerance, maxIterations);
}