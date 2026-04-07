import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ConvergenceChart({ history }) {
  const data = history.map((h) => ({
    iteration: h.iteration,
    objective: h.objective,
  }));

  return (
    <div className="panel chart-panel">
      <h2>Objective Convergence</h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
          <XAxis dataKey="iteration" stroke="var(--chart-axis)" />
          <YAxis stroke="var(--chart-axis)" />
          <Tooltip
            contentStyle={{
              background: "var(--tooltip-bg)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              color: "var(--text)",
            }}
          />
          <Line
            type="monotone"
            dataKey="objective"
            stroke="var(--chart-line)"
            strokeWidth={3}
            dot={{ r: 3, fill: "var(--chart-line)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}