export function portfolioObjective(weights, mu, sigma, lambda) {
  let risk = 0;
  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights.length; j++) {
      risk += weights[i] * sigma[i][j] * weights[j];
    }
  }

  let expectedReturn = 0;
  for (let i = 0; i < weights.length; i++) {
    expectedReturn += mu[i] * weights[i];
  }

  return (lambda / 2) * risk - expectedReturn;
}

export function portfolioRisk(weights, sigma) {
  let risk = 0;
  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights.length; j++) {
      risk += weights[i] * sigma[i][j] * weights[j];
    }
  }
  return risk;
}

export function portfolioReturn(weights, mu) {
  let expectedReturn = 0;
  for (let i = 0; i < weights.length; i++) {
    expectedReturn += mu[i] * weights[i];
  }
  return expectedReturn;
}

export function portfolioGradient(weights, mu, sigma, lambda) {
  const gradient = new Array(weights.length).fill(0);

  for (let i = 0; i < weights.length; i++) {
    let sigmaW = 0;
    for (let j = 0; j < weights.length; j++) {
      sigmaW += sigma[i][j] * weights[j];
    }
    gradient[i] = lambda * sigmaW - mu[i];
  }

  return gradient;
}

export function computeVariancesFromCovariance(sigma) {
  return sigma.map((row, i) => row[i]);
}