import { format, parseISO } from "date-fns";
import { TrendingUp, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { useGetMoodForecastQuery } from "@/services/moodApi";
import { moodToText } from "@/utils/moodColor";

const labelVariant = {
  "Very Low": "danger",
  Low: "warning",
  Moderate: "default",
  Good: "success",
  Excellent: "success",
} as const;

export function MoodForecast() {
  const { data, isLoading } = useGetMoodForecastQuery({ days: 7 });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (data?.insufficientData) {
    return (
      <EmptyState
        icon="📊"
        title="Not enough data yet"
        description={data.message}
      />
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-lg md:text-xl font-bold text-gray-100 flex items-center gap-2">
          <TrendingUp size={20} className="text-brand-400" />
          Mood Forecast
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Next 7 days predicted from your patterns
        </p>
      </div>

      {/* Baseline info */}
      {data?.basedOn && (
        <div className="card p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Baseline avg",
              value: data.basedOn.baselineAvg.toFixed(2),
            },
            {
              label: "Trend/day",
              value: data.basedOn.trendSlopePerDay.toFixed(3),
            },
            { label: "Entries used", value: data.basedOn.entriesAnalyzed },
            { label: "Baseline days", value: data.basedOn.baselineDays },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-800/50 rounded-xl p-3 text-center"
            >
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-gray-100">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Forecast days */}
      <div className="space-y-3">
        {data?.forecast.map((day) => (
          <div
            key={day.date}
            className="card p-4 flex flex-col sm:flex-row sm:items-center gap-3"
          >
            {/* Date */}
            <div className="sm:w-40 flex-shrink-0">
              <p className="text-sm font-semibold text-gray-200">
                {day.dayOfWeek}
              </p>
              <p className="text-xs text-gray-500">
                {format(parseISO(day.date), "MMM d, yyyy")}
              </p>
            </div>

            {/* Score bar */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xl font-bold ${moodToText(Math.round(day.predictedScore))}`}
                >
                  {day.predictedScore.toFixed(2)}
                </span>
                <Badge variant={labelVariant[day.label]} size="sm">
                  {day.label}
                </Badge>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-600 transition-all"
                  style={{ width: `${((day.predictedScore - 1) / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Signals breakdown */}
            <div className="sm:w-56 grid grid-cols-3 gap-2 text-center flex-shrink-0">
              {[
                {
                  label: "Base",
                  value: day.signals.baseline,
                  color: "text-blue-400",
                },
                {
                  label: "Weekday",
                  value: day.signals.dayOfWeekAdjustment,
                  color: "text-purple-400",
                },
                {
                  label: "Trend",
                  value: day.signals.trendContribution,
                  color: "text-emerald-400",
                },
              ].map((s) => (
                <div key={s.label} className="bg-gray-800/50 rounded-lg p-1.5">
                  <p className="text-[10px] text-gray-600">{s.label}</p>
                  <p className={`text-xs font-bold ${s.color}`}>
                    {s.value >= 0 ? "+" : ""}
                    {s.value.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Message */}
      {data?.message && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-gray-800/50 text-xs text-gray-500">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          {data.message}
        </div>
      )}
    </div>
  );
}
