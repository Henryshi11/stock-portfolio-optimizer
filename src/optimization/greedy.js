import {
  portfolioObjective,
  portfolioReturn,
  portfolioRisk,
  computeVariancesFromCovariance,
} from "./objective";

export function runGreedy(mu, sigma, lambda = 1, maxWeight = 0.35) {
  const variances = computeVariancesFromCovariance(sigma);

  const ranking = mu.map((expectedReturn, index) => {
    const variance = Math.max(variances[index], 1e-8);
    return {
      index,
      score: expectedReturn / variance,
    };
  });

  ranking.sort((a, b) => b.score - a.score);

  const weights = new Array(mu.length).fill(0);
  let remaining = 1;

  for (const asset of ranking) {
    if (remaining <= 1e-8) {
      break;
    }

    const allocation = Math.min(maxWeight, remaining);
    weights[asset.index] = allocation;
    remaining -= allocation;
  }

  return {
    weights,
    objective: portfolioObjective(weights, mu, sigma, lambda),
    expectedReturn: portfolioReturn(weights, mu),
    risk: portfolioRisk(weights, sigma),
    ranking,
  };
}