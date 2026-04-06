import { portfolioObjective } from "./objective"

export function runGridSearch(mu, sigma, lambda, step = 0.1, maxWeight = 1) {
  const n = mu.length
  if (n > 4) {
    throw new Error("Grid search is only intended for very small problems (n <= 4).")
  }

  let bestWeights = null
  let bestObjective = Infinity

  function generate(current, remaining, depth) {
    if (depth === n - 1) {
      const last = remaining
      const candidate = [...current, last]

      if (candidate.every((w) => w >= 0 && w <= maxWeight + 1e-8)) {
        const obj = portfolioObjective(candidate, mu, sigma, lambda)
        if (obj < bestObjective) {
          bestObjective = obj
          bestWeights = candidate
        }
      }
      return
    }

    for (let w = 0; w <= remaining + 1e-8; w += step) {
      if (w <= maxWeight + 1e-8) {
        generate([...current, Number(w.toFixed(10))], Number((remaining - w).toFixed(10)), depth + 1)
      }
    }
  }

  generate([], 1, 0)

  return {
    weights: bestWeights,
    objective: bestObjective
  }
}
