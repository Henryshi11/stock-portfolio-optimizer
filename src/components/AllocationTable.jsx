import { formatCurrency, formatNumber, formatWeight } from "../utils/format";

export default function AllocationTable({ rows }) {
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