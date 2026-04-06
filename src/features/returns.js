import { columnMeans, covarianceMatrix } from "../utils/math";

export function computeReturnsMatrix(priceSeriesByTicker) {
  if (!priceSeriesByTicker.length) return [];

  const minLength = Math.min(...priceSeriesByTicker.map(series => series.length));
  if (minLength < 2) return [];

  const returnsMatrix = [];

  for (let t = 1; t < minLength; t++) {
    const row = [];

    for (let i = 0; i < priceSeriesByTicker.length; i++) {
      const prev = priceSeriesByTicker[i][t - 1]?.close ?? 0;
      const curr = priceSeriesByTicker[i][t]?.close ?? 0;

      const ret = prev > 0 ? (curr - prev) / prev : 0;
      row.push(ret);
    }

    returnsMatrix.push(row);
  }

  return returnsMatrix;
}

export function computeExpectedReturns(returnsMatrix) {
  return columnMeans(returnsMatrix);
}

export function computeCovariance(returnsMatrix) {
  return covarianceMatrix(returnsMatrix);
}

export function buildMarketStats(priceSeriesByTicker) {
  const returnsMatrix = computeReturnsMatrix(priceSeriesByTicker);
  const mu = computeExpectedReturns(returnsMatrix);
  const sigma = computeCovariance(returnsMatrix);

  return {
    returnsMatrix,
    mu,
    sigma,
  };
}