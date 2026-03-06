import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { BarChart } from "@/components/charts/BarChart";
import { useGetMoodDailyInsightsQuery } from "@/services/moodApi";
import { moodToText } from "@/utils/moodColor";

export function MoodInsights() {
  const { data, isLoading } = useGetMoodDailyInsightsQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-56 w-full rounded-2xl" />
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    );
  }

  // Guard — backend may return null or insufficientData shape
  if (!data || !data.dayOfWeekPattern || !data.timeOfDayPattern) {
    return (
      <EmptyState
        icon="🧠"
        title="Not enough data yet"
        description="Log at least 5 mood entries to see daily insight patterns."
      />
    );
  }

  // Guard individual arrays before mapping
  const dowData = (data.dayOfWeekPattern.data ?? []).map(
    (d: { day: string; averageMood: number }) => ({
      day: d.day.slice(0, 3),
      averageMood: Number(d.averageMood.toFixed(2)),
    }),
  );

  const todData = (data.timeOfDayPattern.data ?? []).map(
    (d: { timeOfDay: string; averageMood: number }) => ({
      time: d.timeOfDay,
      averageMood: Number(d.averageMood.toFixed(2)),
    }),
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* ── Page header ── */}
      <div>
        <h2 className="text-lg md:text-xl font-bold text-gray-100">
          Daily Insights
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Patterns in when and how you feel best
        </p>
      </div>

      {/* ── Day of week ── */}
      <div className="card p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h3 className="text-sm font-semibold text-gray-300">
            Day of Week Patterns
          </h3>
          <div className="flex gap-3 text-xs text-gray-500">
            {data.dayOfWeekPattern.bestDay && (
              <span>
                Best:{" "}
                <span className="text-emerald-400 font-medium">
                  {data.dayOfWeekPattern.bestDay}
                </span>
              </span>
            )}
            {data.dayOfWeekPattern.worstDay && (
              <span>
                Worst:{" "}
                <span className="text-red-400 font-medium">
                  {data.dayOfWeekPattern.worstDay}
                </span>
              </span>
            )}
          </div>
        </div>

        {dowData.length > 0 ? (
          <BarChart
            data={dowData}
            xKey="day"
            barKey="averageMood"
            yDomain={[0, 5]}
            colorFn={(v) =>
              v >= 4 ? "#10b981" : v >= 3 ? "#f59e0b" : "#ef4444"
            }
          />
        ) : (
          <p className="text-sm text-gray-500 py-8 text-center">
            No data available yet
          </p>
        )}

        {data.dayOfWeekPattern.insight && (
          <p className="text-xs text-gray-500 mt-3 italic">
            {data.dayOfWeekPattern.insight}
          </p>
        )}
      </div>

      {/* ── Time of day ── */}
      <div className="card p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h3 className="text-sm font-semibold text-gray-300">
            Time of Day Patterns
          </h3>
          {data.timeOfDayPattern.bestTime && (
            <span className="text-xs text-gray-500">
              Best:{" "}
              <span className="text-emerald-400 font-medium">
                {data.timeOfDayPattern.bestTime}
              </span>
            </span>
          )}
        </div>

        {todData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {todData.map((t) => (
              <div
                key={t.time}
                className="bg-gray-800/50 rounded-xl p-3 text-center"
              >
                <p className="text-xs text-gray-500 mb-1">{t.time}</p>
                <p
                  className={`text-xl font-bold ${moodToText(Math.round(t.averageMood))}`}
                >
                  {t.averageMood.toFixed(1)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 py-8 text-center">
            No data available yet
          </p>
        )}

        {data.timeOfDayPattern.insight && (
          <p className="text-xs text-gray-500 mt-3 italic">
            {data.timeOfDayPattern.insight}
          </p>
        )}
      </div>
    </div>
  );
}
