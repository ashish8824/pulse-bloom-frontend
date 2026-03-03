import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface DonutChartProps {
  value: number; // 0–100
  color?: string;
  size?: number;
  label?: string;
  sublabel?: string;
}

export function DonutChart({
  value,
  color = "#a92fd4",
  size = 120,
  label,
  sublabel,
}: DonutChartProps) {
  const data = [{ value: value }, { value: 100 - value }];

  return (
    <div className="relative inline-flex items-center justify-center">
      <ResponsiveContainer width={size} height={size}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="68%"
            outerRadius="85%"
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill={color} />
            <Cell fill="#1f2937" />
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#111827",
              border: "1px solid #374151",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(v: number, _: string, props: { dataIndex: number }) =>
              props.dataIndex === 0 ? [`${v}%`, label ?? "Score"] : null
            }
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Centre label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {label && (
          <span className="text-lg font-bold text-gray-100">{label}</span>
        )}
        {sublabel && <span className="text-xs text-gray-500">{sublabel}</span>}
      </div>
    </div>
  );
}
