import { normalizeScores } from "../utils/math";

export function computeNewsScore(newsRows, tickers) {
  const scoreMap = {};

  for (const row of newsRows) {
    const ticker = row.ticker;
    const sentiment = Number(row.news_sentiment) || 0;
    const impact = Number(row.news_impact) || 0;

    const score = sentiment * impact;

    if (!scoreMap[ticker]) {
      scoreMap[ticker] = [];
    }

    scoreMap[ticker].push(score);
  }

  const scores = tickers.map((ticker) => {
    const values = scoreMap[ticker] || [];
    if (!values.length) return 0;

    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
    return avg;
  });

  return normalizeScores(scores);
}