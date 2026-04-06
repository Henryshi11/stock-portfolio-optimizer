import { useMemo, useState } from "react";
import ControlPanel from "./components/ControlPanel";
import PortfolioView from "./components/PortfolioView";
import SummaryCards from "./components/SummaryCards";

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
import { runPGD, runGreedy, runGridSearch } from "./optimization";

function buildAllocationRows(tickers, weights, latestPrices, budget) {
  return tickers.map((ticker, index) => {
    const weight = weights[index] ?? 0;
    const dollars = weight * budget;
    const price = latestPrices[ticker] ?? 0;
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
  const config = useMemo(() => loadConfig(), []);
  const priceRows = useMemo(() => loadPrices(), []);
  const fundamentalsRows = useMemo(() => loadFundamentals(), []);
  const newsRows = useMemo(() => loadNews(), []);

  const tickers = useMemo(() => getTickersFromConfig(), []);
  const latestPrices = useMemo(() => getLatestPrices(priceRows), [priceRows]);

  const [budget, setBudget] = useState(config.budget ?? 1000);
  const [lambda, setLambda] = useState(config.risk_aversion ?? 1);
  const [maxWeight, setMaxWeight] = useState(config.max_weight_per_stock ?? 0.35);
  const [stepSize, setStepSize] = useState(0.1);
  const [maxIterations, setMaxIterations] = useState(30);
  const [algorithm, setAlgorithm] = useState("pgd");
  const [featureMode, setFeatureMode] = useState("hybrid");

  const marketData = useMemo(() => {
    const alignedSeries = alignPriceSeriesByTicker(priceRows, tickers);
    const stats = buildMarketStats(alignedSeries);

    const fundamentalsScore = computeFundamentalsScore(fundamentalsRows, tickers);
    const newsScore = computeNewsScore(newsRows, tickers);

    const blendedMu =
      featureMode === "returns"
        ? stats.mu
        : combineFeatures({
            mu: stats.mu,
            fundamentalsScore,
            newsScore,
            weights:
              featureMode === "hybrid"
                ? { returns: 0.6, fundamentals: 0.2, news: 0.2 }
                : { returns: 0.4, fundamentals: 0.4, news: 0.2 },
          });

    return {
      ...stats,
      fundamentalsScore,
      newsScore,
      finalMu: blendedMu,
    };
  }, [priceRows, fundamentalsRows, newsRows, tickers, featureMode]);

  const result = useMemo(() => {
    const mu = marketData.finalMu;
    const sigma = marketData.sigma;

    if (!mu.length || !sigma.length) {
      return null;
    }

    if (algorithm === "greedy") {
      return {
        method: "Greedy",
        ...runGreedy(mu, sigma, lambda, maxWeight),
        history: [],
      };
    }

    if (algorithm === "grid") {
      const smallMu = mu.slice(0, Math.min(4, mu.length));
      const smallSigma = sigma
        .slice(0, Math.min(4, sigma.length))
        .map((row) => row.slice(0, Math.min(4, row.length)));

      const gridResult = runGridSearch(smallMu, smallSigma, lambda, 0.1, 1);

      const fullWeights = new Array(mu.length).fill(0);
      for (let i = 0; i < gridResult.weights.length; i++) {
        fullWeights[i] = gridResult.weights[i];
      }

      return {
        method: "Grid Search",
        ...gridResult,
        weights: fullWeights,
        history: [],
      };
    }

    const initialWeights = createEqualWeights(mu.length);

    const pgdResult = runPGD({
      initialWeights,
      mu,
      sigma,
      lambda,
      stepSize,
      maxWeight,
      maxIterations,
    });

    return {
      method: "Projected Gradient Descent",
      ...pgdResult,
      weights: pgdResult.solution,
    };
  }, [marketData, algorithm, lambda, maxWeight, stepSize, maxIterations]);

  const allocationRows = useMemo(() => {
    if (!result?.weights) return [];
    return buildAllocationRows(tickers, result.weights, latestPrices, budget);
  }, [result, tickers, latestPrices, budget]);

  const finalIteration =
    result?.history?.length ? result.history[result.history.length - 1] : null;

  return (
    <div className="app-shell">
      <div className="app-header">
        <h1>Stock Portfolio Optimizer</h1>
        <p>
          Constrained portfolio optimization with Projected Gradient Descent,
          Greedy baseline, and Grid Search validation.
        </p>
      </div>

      <div className="app-grid">
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
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          featureMode={featureMode}
          setFeatureMode={setFeatureMode}
        />

        <div className="main-panel">
          <SummaryCards
            method={result?.method ?? "-"}
            objective={result?.objective ?? 0}
            expectedReturn={result?.expectedReturn ?? 0}
            risk={result?.risk ?? 0}
            iterations={result?.history?.length ?? 0}
          />

          <PortfolioView
            rows={allocationRows}
            history={result?.history ?? []}
            finalIteration={finalIteration}
            budget={budget}
          />
        </div>
      </div>
    </div>
  );
}