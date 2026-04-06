# Stock Portfolio Optimizer (PGD)

A visual and interactive project for constrained portfolio optimization.

---

## Overview

This project studies how to allocate capital across a fixed set of stocks while balancing **expected return** and **risk**.

The main algorithm is **Projected Gradient Descent (PGD)**.
We also include:

* Greedy baseline
* Grid Search (for small-scale validation)

This is a **learning-focused optimization project**, not a real trading system.

---

## Optimization Model

Let $w \in \mathbb{R}^n$ be the portfolio weights.

We solve:

$$
\min f(w) = \frac{\lambda}{2} w^T \Sigma w - \mu^T w
$$

subject to:

$$
\sum_{i=1}^n w_i = 1
$$

$$
0 \leq w_i \leq u_i
$$

where:

* $w_i$ = weight of stock $i$
* $\mu$ = expected return vector
* $\Sigma$ = covariance matrix
* $\lambda$ = risk aversion parameter
* $u_i$ = max allocation per stock

---

## Algorithm (PGD)

At each iteration:

1. Gradient step
   $$
   z^{k+1} = w^k - \alpha \nabla f(w^k)
   $$

2. Projection step
   $$
   w^{k+1} = \Pi_{\mathcal{C}}(z^{k+1})
   $$

Gradient:

$$
\nabla f(w) = \lambda \Sigma w - \mu
$$

---

## Features

* Interactive portfolio visualization
* Step-by-step PGD process
* Real stock CSV dataset
* Adjustable parameters ($\lambda$, constraints, budget)
* Algorithm comparison (PGD vs Greedy vs Grid Search)

---

## Project Structure

```text
src/
  components/      # UI components
  config/          # parameters
  data/            # datasets
  features/        # preprocessing
  optimization/    # algorithms
  render/          # visualization
  styles/          # CSS
  utils/           # helpers
```

Core algorithms:

```text
src/optimization/
  pgd.js
  projection.js
  greedy.js
  gridSearch.js
  objective.js
  constraints.js
```

---

## Run

```bash
npm install
npm run dev
```
