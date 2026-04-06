import { formatNumber } from "../utils/format";

function Card({ label, value }) {
  return (
    <div className="summary-card">
      <div className="summary-label">{label}</div>
      <div className="summary-value">{value}</div>
    </div>
  );
}

export default function SummaryCards({
  method,
  objective,
  expectedReturn,
  risk,
  iterations,
}) {
  return (
    <div className="summary-grid">
      <Card label="Method" value={method} />
      <Card label="Objective" value={formatNumber(objective, 6)} />
      <Card label="Expected Return" value={formatNumber(expectedReturn, 6)} />
      <Card label="Risk" value={formatNumber(risk, 6)} />
      <Card label="Iterations" value={String(iterations)} />
    </div>
  );
}