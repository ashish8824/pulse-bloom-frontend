import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

interface BarChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  barKey: string;
  color?: string;
  colorFn?: (value: number) => string;
  height?: number;
  yDomain?: [number, number];
}

export function BarChart({
  data,
  xKey,
  barKey,
  color = "#a92fd4",
  colorFn,
  height = 220,
  yDomain,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart
        data={data}
        margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#1f2937"
          vertical={false}
        />
        <XAxis
          dataKey={xKey}
          tick={{ fill: "#6b7280", fontSize: 11 }}
          axisLine={false}
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
          cursor={{ fill: "#ffffff08" }}
        />
        <Bar dataKey={barKey} radius={[6, 6, 0, 0]} fill={color}>
          {colorFn &&
            data.map((entry, i) => (
              <Cell key={i} fill={colorFn(entry[barKey] as number)} />
            ))}
        </Bar>
      </ReBarChart>
    </ResponsiveContainer>
  );
}
