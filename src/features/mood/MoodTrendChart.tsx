import { Skeleton } from "@/components/ui/Skeleton";
import { LineChart } from "@/components/charts/LineChart";
import {
  useGetWeeklyTrendsQuery,
  useGetRollingAverageQuery,
} from "@/services/moodApi";

export function MoodTrendChart() {
  const { data: weekly, isLoading: l1 } = useGetWeeklyTrendsQuery();
  const { data: rolling, isLoading: l2 } = useGetRollingAverageQuery();

  if (l1 || l2) return <Skeleton className="h-64 w-full rounded-2xl" />;

  // Merge weekly + rolling by date
  const weeklyMap = new Map(
    weekly?.weeklyTrends.map((w) => [w.week, w.averageMood]) ?? [],
  );
  const merged =
    rolling?.rollingAverage.map((r) => ({
      date: r.date.slice(5), // "MM-DD"
      rolling: Number(r.averageMood.toFixed(2)),
      weekly: weeklyMap.get(r.date.slice(0, 7)) ?? null,
    })) ?? [];

  return (
    <div className="card p-4 md:p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Mood Trends</h3>
      <LineChart
        data={merged}
        xKey="date"
        yDomain={[1, 5]}
        lines={[
          { key: "rolling", color: "#a92fd4", label: "7-day Rolling Avg" },
          { key: "weekly", color: "#10b981", label: "Weekly Avg" },
        ]}
      />
    </div>
  );
}
