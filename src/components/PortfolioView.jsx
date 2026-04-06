import { formatCurrency, formatNumber, formatWeight } from "../utils/format";

function HistoryPanel({ history, finalIteration }) {
  return (
    <div className="panel">
      <h2>Optimization History</h2>

      {!history.length ? (
        <p className="muted">No iterative history available for this algorithm.</p>
      ) : (
        <>
          <div className="history-summary">
            <div>
              <strong>Last Iteration:</strong> {finalIteration?.iteration ?? "-"}
            </div>
            <div>
              <strong>Objective:</strong>{" "}
              {formatNumber(finalIteration?.objective ?? 0, 6)}
            </div>
          </div>

          <div className="history-list">
            {history.slice(0, 12).map((step) => (
              <div className="history-item" key={step.iteration}>
                <div>Iter {step.iteration}</div>
                <div>Obj: {formatNumber(step.objective, 6)}</div>
                <div>Risk: {formatNumber(step.risk, 6)}</div>
                <div>Return: {formatNumber(step.expectedReturn, 6)}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AllocationTable({ rows }) {
  return (
    <div className="panel">
      <h2>Portfolio Allocation</h2>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Weight</th>
              <th>Dollars</th>
              <th>Price</th>
              <th>Shares</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.ticker}>
                <td>{row.ticker}</td>
                <td>{formatWeight(row.weight)}</td>
                <td>{formatCurrency(row.dollars)}</td>
                <td>{formatCurrency(row.price)}</td>
                <td>{formatNumber(row.shares, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PortfolioView({ rows, history, finalIteration }) {
  return (
    <div className="portfolio-view">
      <AllocationTable rows={rows} />
      <HistoryPanel history={history} finalIteration={finalIteration} />
    </div>
  );
}