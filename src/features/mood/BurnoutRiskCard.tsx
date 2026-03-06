import { AlertTriangle, TrendingDown, Activity } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { DonutChart } from "@/components/charts/DonutChart";
import { useGetBurnoutRiskQuery } from "@/services/moodApi";

// Safely map ANY riskLevel string → badge variant + color + message
function getRiskConfig(level: string | undefined) {
  switch (level) {
    case "Low":
      return {
        badge: "success" as const,
        color: "#10b981",
        label: "You're doing great! Keep up the healthy habits.",
      };
    case "Moderate":
      return {
        badge: "warning" as const,
        color: "#f59e0b",
        label: "Some signs of stress. Consider self-care practices.",
      };
    case "High":
      return {
        badge: "danger" as const,
        color: "#ef4444",
        label: "High burnout risk detected. Please rest and seek support.",
      };
    case "Insufficient Data":
    default:
      return {
        badge: "default" as const,
        color: "#6b7280",
        label:
          "Not enough data yet. Log at least 3 mood entries to calculate burnout risk.",
      };
  }
}

export function BurnoutRiskCard() {
  const { data, isLoading } = useGetBurnoutRiskQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-6">
            <Skeleton className="w-28 h-28 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon="⚠️"
        title="Could not load burnout data"
        description="Please try again later."
      />
    );
  }

  const config = getRiskConfig(data.riskLevel);
  const isInsufficient =
    data.riskLevel === "Insufficient Data" || !data.metrics;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* ── Page header ── */}
      <div>
        <h2 className="text-lg md:text-xl font-bold text-gray-100">
          Burnout Risk
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Based on your mood frequency, average, and volatility
        </p>
      </div>

      {/* ── Main card ── */}
      <div className="card p-4 md:p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={16} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-300">
            Risk Assessment
          </h3>
          <Badge variant={config.badge} size="sm" className="ml-auto">
            {data.riskLevel ?? "Unknown"}
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Donut */}
          <DonutChart
            value={data.riskScore ?? 0}
            color={config.color}
            size={120}
            label={`${data.riskScore ?? 0}`}
            sublabel="/ 100"
          />

          {/* Info */}
          <div className="flex-1 w-full space-y-3">
            <p className="text-sm text-gray-400">{config.label}</p>

            {/* Metrics — only if available */}
            {!isInsufficient && data.metrics && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <TrendingDown size={11} /> Avg Mood
                  </p>
                  <p className="text-lg font-bold text-gray-100">
                    {data.metrics.averageMood?.toFixed(1) ?? "—"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Activity size={11} /> Volatility
                  </p>
                  <p className="text-lg font-bold text-gray-100">
                    {data.metrics.volatility?.toFixed(2) ?? "—"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Low Mood Days</p>
                  <p className="text-lg font-bold text-gray-100">
                    {data.metrics.lowMoodDays ?? "—"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Entries</p>
                  <p className="text-lg font-bold text-gray-100">
                    {data.metrics.totalEntries ?? "—"}
                  </p>
                </div>
              </div>
            )}

            {/* Insufficient data helper */}
            {isInsufficient && (
              <div className="bg-gray-800/50 rounded-xl p-3 text-sm text-gray-500">
                Log at least{" "}
                <span className="text-gray-300 font-medium">
                  3 mood entries
                </span>{" "}
                to unlock the full burnout analysis.
              </div>
            )}
          </div>
        </div>

        {/* Backend message if any */}
        {data.message && (
          <p className="text-xs text-gray-600 mt-4 italic">{data.message}</p>
        )}
      </div>
    </div>
  );
}
