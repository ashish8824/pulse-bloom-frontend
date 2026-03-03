import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface LineChartProps {
  data: Record<string, unknown>[];
  lines: { key: string; color: string; label: string }[];
  xKey: string;
  yDomain?: [number, number];
  height?: number;
}

export function LineChart({
  data,
  lines,
  xKey,
  yDomain,
  height = 260,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReLineChart
        data={data}
        margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis
          dataKey={xKey}
          tick={{ fill: "#6b7280", fontSize: 11 }}
          axisLine={{ stroke: "#374151" }}
          tickLine={false}
        />
        <YAxis
          domain={yDomain}
          tick={{ fill: "#6b7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#111827",
            border: "1px solid #374151",
            borderRadius: "10px",
            fontSize: "12px",
            color: "#f3f4f6",
          }}
        />
        <Legend
          wrapperStyle={{
            fontSize: "12px",
            color: "#9ca3af",
            paddingTop: "8px",
          }}
        />
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            name={l.label}
            stroke={l.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </ReLineChart>
    </ResponsiveContainer>
  );
}
