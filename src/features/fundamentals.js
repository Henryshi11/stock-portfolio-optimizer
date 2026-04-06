import { normalizeScores } from "../utils/math";

export function computeFundamentalsScore(fundamentalsRows, tickers) {
  const scoreMap = {};

  for (const row of fundamentalsRows) {
    const ticker = row.ticker;

    const revenueGrowth = Number(row.revenue_growth) || 0;
    const roe = Number(row.roe) || 0;
    const fcfMargin = Number(row.fcf_margin) || 0;
    const debtToEquity = Number(row.debt_to_equity) || 0;
    const epsGrowth = Number(row.eps_growth) || 0;

    const score =
      0.30 * revenueGrowth +
      0.20 * roe +
      0.20 * fcfMargin +
      0.25 * epsGrowth -
      0.15 * debtToEquity;

    scoreMap[ticker] = score;
  }

  const scores = tickers.map((ticker) => scoreMap[ticker] ?? 0);
  return normalizeScores(scores);
}