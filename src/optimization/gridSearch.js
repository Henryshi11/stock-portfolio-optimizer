import {
  portfolioObjective,
  portfolioReturn,
  portfolioRisk,
} from "./objective";

function roundToStep(value, digits = 10) {
  return Number(value.toFixed(digits));
}

export function runGridSearch(mu, sigma, lambda = 1, step = 0.1, maxWeight = 1) {
  const n = mu.length;

  if (n === 0) {
    return {
      weights: [],
      objective: 0,
      expectedReturn: 0,
      risk: 0,
      candidatesChecked: 0,
    };
  }

  if (n > 4) {
    throw new Error("Grid search is only intended for very small problems (n <= 4).");
  }

  let bestWeights = null;
  let bestObjective = Infinity;
  let candidatesChecked = 0;

  function search(currentWeights, remaining, depth) {
    if (depth === n - 1) {
      const lastWeight = roundToStep(remaining);
      const candidate = [...currentWeights, lastWeight];

      const valid = candidate.every(
        (weight) => weight >= -1e-8 && weight <= maxWeight + 1e-8
      );

      if (valid) {
        candidatesChecked += 1;
        const objective = portfolioObjective(candidate, mu, sigma, lambda);

        if (objective < bestObjective) {
          bestObjective = objective;
          bestWeights = candidate;
        }
      }
      return;
    }

    for (let weight = 0; weight <= remaining + 1e-8; weight += step) {
      const roundedWeight = roundToStep(weight);

      if (roundedWeight <= maxWeight + 1e-8) {
        search(
          [...currentWeights, roundedWeight],
          roundToStep(remaining - roundedWeight),
          depth + 1
        );
      }
    }
  }

  search([], 1, 0);

  if (!bestWeights) {
    return {
      weights: new Array(n).fill(0),
      objective: Infinity,
      expectedReturn: 0,
      risk: 0,
      candidatesChecked,
    };
  }

  return {
    weights: bestWeights,
    objective: bestObjective,
    expectedReturn: portfolioReturn(bestWeights, mu),
    risk: portfolioRisk(bestWeights, sigma),
    candidatesChecked,
  };
}