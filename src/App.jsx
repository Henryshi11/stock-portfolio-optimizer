import { useMemo, useState } from "react";
import ControlPanel from "./components/ControlPanel";
import PortfolioView from "./components/PortfolioView";
import SummaryCards from "./components/SummaryCards";
import AllocationChart from "./components/AllocationChart";
import ConvergenceChart from "./components/ConvergenceChart";
import DerivationPanel from "./components/DerivationPanel";

import {
  loadConfig,
  loadPrices,
  loadFundamentals,
  loadNews,
  getTickersFromConfig,
  alignPriceSeriesByTicker,
  getLatestPrices,
} from "./data/loader";

import { buildMarketStats } from "./features/returns";
import { combineFeatures } from "./features/mergeFeatures";
import { computeFundamentalsScore } from "./features/fundamentals";
import { computeNewsScore } from "./features/news";

import { createEqualWeights } from "./optimization/constraints";
import { runPGD } from "./optimization";

export default function App() {
  const [theme, setTheme] = useState("dark");

  const config = useMemo(() => loadConfig(), []);
  const priceRows = useMemo(() => loadPrices(), []);
  const fundamentalsRows = useMemo(() => loadFundamentals(), []);
  const newsRows = useMemo(() => loadNews(), []);

  const tickers = useMemo(() => getTickersFromConfig(), []);
  const latestPrices = useMemo(() => getLatestPrices(priceRows), [priceRows]);

  const [lambda, setLambda] = useState(1);
  const [maxWeight, setMaxWeight] = useState(0.35);

  const market = useMemo(() => {
    const series = alignPriceSeriesByTicker(priceRows, tickers);
    const stats = buildMarketStats(series);

    const f = computeFundamentalsScore(fundamentalsRows, tickers);
    const n = computeNewsScore(newsRows, tickers);

    const mu = combineFeatures({
      mu: stats.mu,
      fundamentalsScore: f,
      newsScore: n,
    });

    return { ...stats, mu };
  }, [priceRows, fundamentalsRows, newsRows, tickers]);

  const result = useMemo(() => {
    if (!market.mu.length) return null;

    return runPGD({
      initialWeights: createEqualWeights(market.mu.length),
      mu: market.mu,
      sigma: market.sigma,
      lambda,
      maxWeight,
      maxIterations: 40,
    });
  }, [market, lambda, maxWeight]);

  const rows = useMemo(() => {
    if (!result) return [];

    return tickers.map((t, i) => ({
      ticker: t,
      weight: result.solution[i],
      price: latestPrices[t] || 0,
    }));
  }, [result, tickers, latestPrices]);

  return (
    <div className={`app-shell ${theme}`}>
      <div className="app-header">
        <h1>Stock Portfolio Optimizer</h1>
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          Toggle {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>

      <ControlPanel
        lambda={lambda}
        setLambda={setLambda}
        maxWeight={maxWeight}
        setMaxWeight={setMaxWeight}
      />

      {result && (
        <>
          <SummaryCards
            method="PGD"
            objective={result.objective}
            expectedReturn={result.expectedReturn}
            risk={result.risk}
            iterations={result.history.length}
          />

          <AllocationChart rows={rows} />
          <ConvergenceChart history={result.history} />

          <PortfolioView rows={rows} />

          <DerivationPanel history={result.history} />
        </>
      )}
    </div>
  );
}