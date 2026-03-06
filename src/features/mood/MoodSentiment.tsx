import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { useGetSentimentTrendsQuery } from "@/services/moodApi";
import { LineChart } from "@/components/charts/LineChart";

export function MoodSentiment() {
  const { data, isLoading } = useGetSentimentTrendsQuery();

  if (isLoading) return <Skeleton className="h-64 w-full rounded-2xl" />;

  if (data?.insufficientData) {
    return (
      <EmptyState
        icon="🧠"
        title="Not enough journal data"
        description="Write journal entries with your mood logs to see sentiment analysis."
      />
    );
  }

  const chartData =
    data?.weeks.map((w) => ({
      week: w.week.replace(/\d{4}-/, ""), // "W08"
      sentiment:
        w.avgSentiment != null ? Number(w.avgSentiment.toFixed(2)) : null,
      mood: w.avgMood != null ? Number((w.avgMood / 5).toFixed(2)) : null, // normalise 1-5 → 0-1
    })) ?? [];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-lg md:text-xl font-bold text-gray-100">
          Sentiment vs Mood
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          AI-extracted journal sentiment compared to self-reported mood
        </p>
      </div>

      {/* Summary */}
      {data?.summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Weeks analysed", value: data.summary.weeksAnalyzed },
            { label: "Total weeks", value: data.summary.totalWeeks },
            {
              label: "Divergent weeks",
              value: data.summary.divergentWeeks,
              warn: data.summary.divergentWeeks > 0,
            },
          ].map((s) => (
            <div key={s.label} className="card p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p
                className={`text-2xl font-bold ${s.warn ? "text-amber-400" : "text-gray-100"}`}
              >
                {s.value}
              </p>
            </div>
          ))}
          {data.summary.divergenceNote && (
            <div className="card p-4 col-span-2 sm:col-span-1 flex items-center">
              <p className="text-xs text-amber-400">
                {data.summary.divergenceNote}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Chart */}
      <div className="card p-4 md:p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">
          Weekly Sentiment (AI) vs Mood (Self-reported, normalised)
        </h3>
        <LineChart
          data={chartData}
          xKey="week"
          yDomain={[-1, 1]}
          lines={[
            {
              key: "sentiment",
              color: "#a92fd4",
              label: "Sentiment (-1 to +1)",
            },
            { key: "mood", color: "#10b981", label: "Mood (normalised 0-1)" },
          ]}
        />
        <p className="text-xs text-gray-600 mt-2">
          Divergent weeks = high mood score but negative sentiment — possible
          emotional suppression.
        </p>
      </div>

      {/* Weekly table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-xs text-gray-500">
                <th className="text-left px-4 py-3">Week</th>
                <th className="text-right px-4 py-3">Sentiment</th>
                <th className="text-right px-4 py-3">Avg Mood</th>
                <th className="text-right px-4 py-3">Journals</th>
                <th className="text-left px-4 py-3">Top Themes</th>
              </tr>
            </thead>
            <tbody>
              {data?.weeks.map((w) => {
                const divergent =
                  w.avgSentiment != null &&
                  w.avgMood != null &&
                  w.avgMood >= 3.5 &&
                  w.avgSentiment < -0.2;
                return (
                  <tr
                    key={w.week}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30"
                  >
                    <td className="px-4 py-3 font-medium text-gray-300">
                      {w.week}
                      {divergent && (
                        <Badge variant="warning" size="sm" className="ml-2">
                          Divergent
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {w.avgSentiment != null ? (
                        <span
                          className={
                            w.avgSentiment >= 0
                              ? "text-emerald-400"
                              : "text-red-400"
                          }
                        >
                          {w.avgSentiment >= 0 ? "+" : ""}
                          {w.avgSentiment.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      {w.avgMood?.toFixed(1) ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {w.journalCount}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {w.topThemes.slice(0, 3).map((t) => (
                          <Badge key={t} variant="purple" size="sm">
                            #{t}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
