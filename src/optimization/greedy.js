export function runGreedy(mu, variances, maxWeight = 0.35) {
  const scores = mu.map((value, i) => ({
    index: i,
    score: value / Math.max(variances[i], 1e-8)
  }))

  scores.sort((a, b) => b.score - a.score)

  const weights = new Array(mu.length).fill(0)
  let remaining = 1

  for (const item of scores) {
    const allocation = Math.min(maxWeight, remaining)
    weights[item.index] = allocation
    remaining -= allocation
    if (remaining <= 1e-8) break
  }

  return weights
}
