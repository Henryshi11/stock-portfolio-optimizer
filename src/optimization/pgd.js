import {
  portfolioGradient,
  portfolioObjective,
  portfolioReturn,
  portfolioRisk,
} from "./objective";
import { projectToCappedSimplex } from "./projection";
import { isFeasible, createEqualWeights } from "./constraints";

export function runPGDStep(weights, mu, sigma, lambda, stepSize, maxWeight) {
  const gradient = portfolioGradient(weights, mu, sigma, lambda);

  const rawStep = weights.map((weight, index) => weight - stepSize * gradient[index]);
  const nextWeights = projectToCappedSimplex(rawStep, maxWeight);

  return {
    previousWeights: [...weights],
    gradient,
    rawStep,
    weights: nextWeights,
    objective: portfolioObjective(nextWeights, mu, sigma, lambda),
    expectedReturn: portfolioReturn(nextWeights, mu),
    risk: portfolioRisk(nextWeights, sigma),
    feasible: isFeasible(nextWeights, maxWeight),
  };
}

export function runPGD({
  initialWeights,
  mu,
  sigma,
  lambda = 1,
  stepSize = 0.1,
  maxWeight = 0.35,
  maxIterations = 50,
  tolerance = 1e-8,
}) {
  const n = mu.length;
  let weights =
    Array.isArray(initialWeights) && initialWeights.length === n
      ? [...initialWeights]
      : createEqualWeights(n);

  const history = [];

  let previousObjective = portfolioObjective(weights, mu, sigma, lambda);

  for (let iter = 0; iter < maxIterations; iter++) {
    const step = runPGDStep(weights, mu, sigma, lambda, stepSize, maxWeight);

    history.push({
      iteration: iter + 1,
      ...step,
    });

    const improvement = Math.abs(previousObjective - step.objective);
    weights = step.weights;

    if (improvement < tolerance) {
      break;
    }

    previousObjective = step.objective;
  }

  return {
    solution: weights,
    objective: portfolioObjective(weights, mu, sigma, lambda),
    expectedReturn: portfolioReturn(weights, mu),
    risk: portfolioRisk(weights, sigma),
    history,
  };
}