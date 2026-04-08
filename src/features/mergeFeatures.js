import { normalizeScores } from "../utils/math";

export function combineFeatures({
  mu,
  fundamentalsScore = [],
  newsScore = [],
  weights = {
    returns: 0.6,
    fundamentals: 0.2,
    news: 0.2,
  },
}) {
  const n = mu.length;

  const normReturns = normalizeScores(mu);
  const normFund = normalizeScores(fundamentalsScore);
  const normNews = normalizeScores(newsScore);

  // Calculate raw scores based on user-defined weights
  const rawScores = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    rawScores[i] =
      weights.returns * (normReturns[i] ?? 0) +
      weights.fundamentals * (normFund[i] ?? 0) +
      weights.news * (normNews[i] ?? 0);
  }

  // Fix: Align the scale of the combined scores to the empirical returns (mu).
  // This prevents the variance (risk) from being ignored when lambda is applied in the objective function.
  const muMax = Math.max(...mu);
  const muMin = Math.min(...mu);

  const scoreMax = Math.max(...rawScores);
  const scoreMin = Math.min(...rawScores);

  const finalMu = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    if (scoreMax === scoreMin) {
      finalMu[i] = muMin;
    } else {
      // Map the raw score linearly back to the [muMin, muMax] range
      const normalizedScore = (rawScores[i] - scoreMin) / (scoreMax - scoreMin);
      finalMu[i] = muMin + normalizedScore * (muMax - muMin);
    }
  }

  return finalMu;
}