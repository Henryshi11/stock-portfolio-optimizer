export function computeVolatilityFromSigma(sigma) {
  return sigma.map((row, i) => Math.sqrt(Math.max(row[i], 0)));
}

export function computeCorrelationMatrix(sigma) {
  const n = sigma.length;
  const corr = Array.from({ length: n }, () => new Array(n).fill(0));

  const vol = computeVolatilityFromSigma(sigma);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const denom = vol[i] * vol[j];
      corr[i][j] = denom > 1e-8 ? sigma[i][j] / denom : 0;
    }
  }

  return corr;
}