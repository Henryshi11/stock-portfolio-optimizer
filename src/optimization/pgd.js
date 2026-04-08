import {
  portfolioGradient,
  portfolioObjective,
  portfolioReturn,
  portfolioRisk,
} from "./objective";
import { projectToCappedSimplex } from "./projection";
import { isFeasible, createEqualWeights } from "./constraints";

export function runPGDStep(weights, mu, sigma, lambda, initialStepSize, maxWeight) {
  const gradient = portfolioGradient(weights, mu, sigma, lambda);
  const currentObj = portfolioObjective(weights, mu, sigma, lambda);

  let stepSize = initialStepSize;
  let nextWeights, rawStep, nextObj;

  // Fix: Backtracking line search implementation
  // This dynamically reduces the step size if the objective function does not improve,
  // preventing the algorithm from diverging when the risk aversion (lambda) is set too high.
  const beta = 0.5; // Step size reduction factor
  const maxLineSearchIter = 10;

  for (let i = 0; i < maxLineSearchIter; i++) {
    rawStep = weights.map((weight, index) => weight - stepSize * gradient[index]);
    nextWeights = projectToCappedSimplex(rawStep, maxWeight);
    nextObj = portfolioObjective(nextWeights, mu, sigma, lambda);

    // Check if the objective function has sufficiently decreased
    // Added 1e-6 to handle potential floating-point inaccuracies
    if (nextObj <= currentObj + 1e-6) {
      break;
    }
    
    // Reduce step size if the condition is not met
    stepSize *= beta;
  }

  return {
    previousWeights: [...weights],
    gradient,
    rawStep,
    weights: nextWeights,
    objective: nextObj,
    expectedReturn: portfolioReturn(nextWeights, mu),
    risk: portfolioRisk(nextWeights, sigma),
    feasible: isFeasible(nextWeights, maxWeight),
    effectiveStepSize: stepSize, // Track the actual step size used after line search
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
    // Note: stepSize passed here acts as the initial guess for the line search
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