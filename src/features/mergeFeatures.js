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

  const finalMu = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    finalMu[i] =
      weights.returns * (normReturns[i] ?? 0) +
      weights.fundamentals * (normFund[i] ?? 0) +
      weights.news * (normNews[i] ?? 0);
  }

  return finalMu;
}