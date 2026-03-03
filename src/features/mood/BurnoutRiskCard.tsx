import { AlertTriangle, TrendingDown, Activity } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { DonutChart } from "@/components/charts/DonutChart";
import { useGetBurnoutRiskQuery } from "@/services/moodApi";

export function BurnoutRiskCard() {
  const { data, isLoading } = useGetBurnoutRiskQuery();

  const variantMap = {
    Low: {
      badge: "success",
      color: "#10b981",
      label: "You're doing great! Keep up the healthy habits.",
    },
    Moderate: {
      badge: "warning",
      color: "#f59e0b",
      label: "Some signs of stress. Consider self-care practices.",
    },
    High: {
      badge: "danger",
      color: "#ef4444",
      label: "High burnout risk detected. Please rest and seek support.",
    },
  } as const;

  if (isLoading) {
    return (
      <div className="card p-5 space-y-4">
        <Skeleton className="h-5 w-32" />
        <div className="flex items-center gap-6">
          <Skeleton className="w-28 h-28 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const variant = variantMap[data.riskLevel];

  return (
    <div className="card p-4 md:p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={16} className="text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-300">Burnout Risk</h3>
        <Badge variant={variant.badge} size="sm" className="ml-auto">
          {data.riskLevel}
        </Badge>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* Donut */}
        <DonutChart
          value={data.riskScore}
          color={variant.color}
          size={120}
          label={`${data.riskScore}`}
          sublabel="/ 100"
        />

        {/* Metrics */}
        <div className="flex-1 w-full space-y-3">
          <p className="text-sm text-gray-400">{variant.label}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800/50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <TrendingDown size={11} /> Avg Mood
              </p>
              <p className="text-lg font-bold text-gray-100">
                {data.metrics.averageMood.toFixed(1)}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Activity size={11} /> Volatility
              </p>
              <p className="text-lg font-bold text-gray-100">
                {data.metrics.volatility.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Low Mood Days</p>
              <p className="text-lg font-bold text-gray-100">
                {data.metrics.lowMoodDays}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Entries</p>
              <p className="text-lg font-bold text-gray-100">
                {data.metrics.totalEntries}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
