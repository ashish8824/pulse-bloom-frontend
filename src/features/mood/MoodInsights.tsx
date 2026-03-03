import { Skeleton } from "@/components/ui/Skeleton";
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

  if (!data) return null;

  const dowData = data.dayOfWeekPattern.data.map((d) => ({
    day: d.day.slice(0, 3),
    averageMood: Number(d.averageMood.toFixed(2)),
  }));

  const todData = data.timeOfDayPattern.data.map((d) => ({
    time: d.timeOfDay,
    averageMood: Number(d.averageMood.toFixed(2)),
  }));

  return (
    <div className="space-y-4">
      {/* Day of week */}
      <div className="card p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h3 className="text-sm font-semibold text-gray-300">
            Day of Week Patterns
          </h3>
          <div className="flex gap-3 text-xs text-gray-500">
            <span>
              Best:{" "}
              <span className="text-emerald-400 font-medium">
                {data.dayOfWeekPattern.bestDay}
              </span>
            </span>
            <span>
              Worst:{" "}
              <span className="text-red-400 font-medium">
                {data.dayOfWeekPattern.worstDay}
              </span>
            </span>
          </div>
        </div>
        <BarChart
          data={dowData}
          xKey="day"
          barKey="averageMood"
          yDomain={[0, 5]}
          colorFn={(v) => (v >= 4 ? "#10b981" : v >= 3 ? "#f59e0b" : "#ef4444")}
        />
        <p className="text-xs text-gray-500 mt-3 italic">
          {data.dayOfWeekPattern.insight}
        </p>
      </div>

      {/* Time of day */}
      <div className="card p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h3 className="text-sm font-semibold text-gray-300">
            Time of Day Patterns
          </h3>
          <span className="text-xs text-gray-500">
            Best:{" "}
            <span className="text-emerald-400 font-medium">
              {data.timeOfDayPattern.bestTime}
            </span>
          </span>
        </div>
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
        <p className="text-xs text-gray-500 mt-3 italic">
          {data.timeOfDayPattern.insight}
        </p>
      </div>
    </div>
  );
}
