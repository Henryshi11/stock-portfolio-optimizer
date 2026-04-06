import pricesCsv from "./prices.csv?raw";
import fundamentalsCsv from "./fundamentals.csv?raw";
import newsCsv from "./news_mock.csv?raw";
import configJson from "./config.json";

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) return [];

  const headers = lines[0].split(",").map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((value) => value.trim());
    const row = {};

    headers.forEach((header, index) => {
      const rawValue = values[index] ?? "";
      const numericValue = Number(rawValue);

      row[header] = Number.isNaN(numericValue) || rawValue === "" ? rawValue : numericValue;
    });

    return row;
  });
}

export function loadConfig() {
  return configJson;
}

export function loadPrices() {
  return parseCsv(pricesCsv);
}

export function loadFundamentals() {
  return parseCsv(fundamentalsCsv);
}

export function loadNews() {
  return parseCsv(newsCsv);
}

export function getTickersFromConfig() {
  const config = loadConfig();
  return Array.isArray(config.tickers) ? config.tickers : [];
}

export function groupPricesByTicker(priceRows) {
  const grouped = {};

  for (const row of priceRows) {
    if (!grouped[row.ticker]) {
      grouped[row.ticker] = [];
    }
    grouped[row.ticker].push(row);
  }

  for (const ticker of Object.keys(grouped)) {
    grouped[ticker].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }

  return grouped;
}

export function getLatestPrices(priceRows) {
  const grouped = groupPricesByTicker(priceRows);
  const latest = {};

  for (const ticker of Object.keys(grouped)) {
    const rows = grouped[ticker];
    latest[ticker] = rows[rows.length - 1]?.close ?? 0;
  }

  return latest;
}

export function alignPriceSeriesByTicker(priceRows, tickers) {
  const grouped = groupPricesByTicker(priceRows);
  return tickers.map((ticker) => grouped[ticker] ?? []);
}