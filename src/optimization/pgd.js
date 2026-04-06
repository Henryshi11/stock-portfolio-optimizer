import { portfolioGradient, portfolioObjective } from "./objective"
import { projectToCappedSimplex } from "./projection"

export function runPGDStep(weights, mu, sigma, lambda, stepSize, maxWeight) {
  const gradient = portfolioGradient(weights, mu, sigma, lambda)
  const z = weights.map((w, i) => w - stepSize * gradient[i])
  const nextWeights = projectToCappedSimplex(z, maxWeight)
  const objective = portfolioObjective(nextWeights, mu, sigma, lambda)

  return {
    previousWeights: weights,
    gradient,
    rawStep: z,
    weights: nextWeights,
    objective
  }
}

export function runPGD({
  initialWeights,
  mu,
  sigma,
  lambda = 1,
  stepSize = 0.1,
  maxWeight = 0.35,
  maxIterations = 50
}) {
  let weights = [...initialWeights]
  const history = []

  for (let iter = 0; iter < maxIterations; iter++) {
    const step = runPGDStep(weights, mu, sigma, lambda, stepSize, maxWeight)
    history.push({
      iteration: iter + 1,
      ...step
    })
    weights = step.weights
  }

  return {
    solution: weights,
    history
  }
}
