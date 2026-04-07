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

function buildAllocationRows(tickers, weights, latestPrices, budget) {
  return tickers.map((ticker, index) => {
    const weight = weights[index] ?? 0;
    const price = latestPrices[ticker] ?? 0;
    const dollars = weight * budget;
    const shares = price > 0 ? dollars / price : 0;

    return {
      ticker,
      weight,
      dollars,
      price,
      shares,
    };
  });
}

export default function App() {
  const [theme, setTheme] = useState("dark");

  const config = useMemo(() => loadConfig(), []);
  const priceRows = useMemo(() => loadPrices(), []);
  const fundamentalsRows = useMemo(() => loadFundamentals(), []);
  const newsRows = useMemo(() => loadNews(), []);

  const tickers = useMemo(() => getTickersFromConfig(), [config]);
  const latestPrices = useMemo(() => getLatestPrices(priceRows), [priceRows]);

  const [budget, setBudget] = useState(config.budget ?? 1000);
  const [lambda, setLambda] = useState(config.risk_aversion ?? 0.8);
  const [maxWeight, setMaxWeight] = useState(config.max_weight_per_stock ?? 0.35);
  const [stepSize, setStepSize] = useState(0.1);
  const [maxIterations, setMaxIterations] = useState(40);
  const [featureMode, setFeatureMode] = useState("hybrid");

  const market = useMemo(() => {
    const series = alignPriceSeriesByTicker(priceRows, tickers);
    const stats = buildMarketStats(series);

    const fundamentalsScore = computeFundamentalsScore(fundamentalsRows, tickers);
    const newsScore = computeNewsScore(newsRows, tickers);

    const mu =
      featureMode === "returns"
        ? stats.mu
        : combineFeatures({
            mu: stats.mu,
            fundamentalsScore,
            newsScore,
            weights:
              featureMode === "fundamental-heavy"
                ? { returns: 0.4, fundamentals: 0.4, news: 0.2 }
                : { returns: 0.6, fundamentals: 0.2, news: 0.2 },
          });

    return {
      ...stats,
      fundamentalsScore,
      newsScore,
      mu,
    };
  }, [priceRows, fundamentalsRows, newsRows, tickers, featureMode]);

  const result = useMemo(() => {
    if (!market.mu.length || !market.sigma.length) {
      return null;
    }

    return runPGD({
      initialWeights: createEqualWeights(market.mu.length),
      mu: market.mu,
      sigma: market.sigma,
      lambda,
      maxWeight,
      stepSize,
      maxIterations,
    });
  }, [market, lambda, maxWeight, stepSize, maxIterations]);

  const rows = useMemo(() => {
    if (!result) return [];
    return buildAllocationRows(tickers, result.solution, latestPrices, budget);
  }, [result, tickers, latestPrices, budget]);

  const finalIteration =
    result?.history?.length > 0 ? result.history[result.history.length - 1] : null;

  return (
    <div className={`app-shell ${theme}`}>
      <div className="page-container">
        <header className="app-header">
          <div>
            <h1>Stock Portfolio Optimizer</h1>
            <p>
              Constrained portfolio optimization with Projected Gradient Descent.
            </p>
          </div>

          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
          </button>
        </header>

        {result && (
          <SummaryCards
            method="Projected Gradient Descent"
            objective={result.objective}
            expectedReturn={result.expectedReturn}
            risk={result.risk}
            iterations={result.history.length}
          />
        )}

        <div className="main-layout">
          <aside className="sidebar">
            <ControlPanel
              budget={budget}
              setBudget={setBudget}
              lambda={lambda}
              setLambda={setLambda}
              maxWeight={maxWeight}
              setMaxWeight={setMaxWeight}
              stepSize={stepSize}
              setStepSize={setStepSize}
              maxIterations={maxIterations}
              setMaxIterations={setMaxIterations}
              featureMode={featureMode}
              setFeatureMode={setFeatureMode}
            />
          </aside>

          <main className="content-area">
            {result && (
              <>
                <div className="chart-grid">
                  <AllocationChart rows={rows} />
                  <ConvergenceChart history={result.history} />
                </div>

                <PortfolioView
                  rows={rows}
                  history={result.history}
                  finalIteration={finalIteration}
                />

                <DerivationPanel history={result.history} />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}