export function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

export function mean(values) {
  if (!values.length) return 0;
  return sum(values) / values.length;
}

export function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

export function transpose(matrix) {
  if (!matrix.length) return [];
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

export function matrixVectorMultiply(matrix, vector) {
  return matrix.map((row) => dot(row, vector));
}

export function vectorSubtract(a, b) {
  return a.map((value, index) => value - b[index]);
}

export function vectorAdd(a, b) {
  return a.map((value, index) => value + b[index]);
}

export function scalarMultiply(vector, scalar) {
  return vector.map((value) => value * scalar);
}

export function covarianceMatrix(returnsMatrix) {
  if (!returnsMatrix.length) return [];

  const numSamples = returnsMatrix.length;
  const numAssets = returnsMatrix[0].length;

  if (numSamples < 2) {
    return Array.from({ length: numAssets }, () =>
      new Array(numAssets).fill(0)
    );
  }

  const means = new Array(numAssets).fill(0);

  for (let j = 0; j < numAssets; j++) {
    let total = 0;
    for (let t = 0; t < numSamples; t++) {
      total += returnsMatrix[t][j];
    }
    means[j] = total / numSamples;
  }

  const sigma = Array.from({ length: numAssets }, () =>
    new Array(numAssets).fill(0)
  );

  for (let i = 0; i < numAssets; i++) {
    for (let j = 0; j < numAssets; j++) {
      let total = 0;
      for (let t = 0; t < numSamples; t++) {
        total +=
          (returnsMatrix[t][i] - means[i]) *
          (returnsMatrix[t][j] - means[j]);
      }
      sigma[i][j] = total / (numSamples - 1);
    }
  }

  return sigma;
}

export function columnMeans(matrix) {
  if (!matrix.length) return [];

  const numCols = matrix[0].length;
  const means = new Array(numCols).fill(0);

  for (let j = 0; j < numCols; j++) {
    let total = 0;
    for (let i = 0; i < matrix.length; i++) {
      total += matrix[i][j];
    }
    means[j] = total / matrix.length;
  }

  return means;
}

export function normalizeScores(values) {
  if (!values.length) return [];

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  if (Math.abs(maxValue - minValue) < 1e-12) {
    return new Array(values.length).fill(0.5);
  }

  return values.map((value) => (value - minValue) / (maxValue - minValue));
}