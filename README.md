# Stock Portfolio Optimizer

A visual and interactive tool for exploring portfolio optimization strategies using real-world stock data.

This project is developed as part of a Facility Location / Optimization-related course, focusing on applying mathematical modeling and optimization techniques to financial data.

---

## Overview

This project builds a simplified portfolio optimization system that:

* Uses historical stock data (CSV-based)
* Computes multiple financial features (returns, risk, momentum, etc.)
* Combines different factors into a unified scoring model
* Solves an optimization problem to determine asset allocation
* Visualizes the final portfolio in an interactive web interface

The goal is not to build a production-level trading system, but to provide a **clear and visual understanding of optimization concepts applied to finance**.

---

## Features

* Multi-factor stock scoring:

  * Returns / Momentum
  * Risk (Volatility / Covariance)
  * Fundamentals (mock or simplified)
  * Valuation metrics
  * News sentiment (mock)

* Portfolio optimization model:

  Minimize risk while maximizing score:

  $$ \min_w \ \lambda w^T \Sigma w - s^T w $$

  Subject to:

  * $\sum w_i = 1$
  * $0 \le w_i \le u_i$

* Interactive visualization:

  * Allocation breakdown
  * Investment amount per stock
  * Portfolio comparison (planned)

---

## Tech Stack

* React (Vite)
* JavaScript
* HTML / CSS
* Canvas-based visualization

No backend is used — all computation is done on the client side using preloaded CSV data.

---

## Project Structure

```
src/
  components/        # UI components
  config/            # model weights, scenarios, themes
  data/              # CSV data + loaders
  features/          # feature engineering
  optimization/      # optimization logic
  render/            # canvas visualization
  styles/            # global styles
  utils/             # helper functions
```

---

## Data

This project uses a fixed dataset of ~10 stocks across different sectors, including:

* Tech (AAPL, MSFT, NVDA)
* Finance (JPM)
* Energy (XOM)
* Healthcare (JNJ)
* Consumer (WMT, KO)
* etc.

All data is stored locally in CSV format.

---

## Getting Started

### Install dependencies

```
npm install
```

### Run development server

```
npm run dev
```

Then open:

```
http://localhost:5173
```

---

## Current Status

This project is under active development.

Planned steps:

* [ ] Complete data pipeline (CSV → features)
* [ ] Implement scoring system
* [ ] Implement optimization solver
* [ ] Build UI control panel
* [ ] Add visualization (canvas)
* [ ] Compare with baseline strategies

---

## Notes

This is a learning-oriented project designed to:

* Reinforce optimization concepts
* Explore multi-factor decision making
* Build intuition through visualization

It is **not intended for real financial advice or trading use**.
