export function formatPercent(value, digits = 2) {
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatCurrency(value, digits = 2) {
  return `$${Number(value).toFixed(digits)}`;
}

export function formatNumber(value, digits = 4) {
  return Number(value).toFixed(digits);
}

export function formatWeight(value, digits = 2) {
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatArray(values, digits = 4) {
  return `[${values.map((value) => Number(value).toFixed(digits)).join(", ")}]`;
}