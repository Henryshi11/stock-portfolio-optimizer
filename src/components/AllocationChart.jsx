import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AllocationChart({ rows }) {
  return (
    <div className="panel">
      <h2>Allocation</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={rows}>
          <XAxis dataKey="ticker" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="weight" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}