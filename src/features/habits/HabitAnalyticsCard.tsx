// src/features/habits/HabitAnalyticsCard.tsx
import { DonutChart } from "@/components/charts/DonutChart";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useGetHabitAnalyticsQuery } from "@/services/habitApi";
import { Flame, Trophy, Calendar, TrendingDown } from "lucide-react";

export default function HabitAnalyticsCard({ habitId }: { habitId: string }) {
  const { data, isLoading } = useGetHabitAnalyticsQuery(habitId);

  if (isLoading) return <CardSkeleton />;

  if (!data) return null;

  const metrics = [
    {
      icon: CheckCircle,
      label: "Completion Rate",
      value: `${data.completionRate.toFixed(0)}%`,
      color: "text-emerald-400",
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${data.currentStreak}d`,
      color: "text-orange-400",
    },
    {
      icon: Trophy,
      label: "Longest Streak",
      value: `${data.longestStreak}d`,
      color: "text-yellow-400",
    },
    {
      icon: TrendingDown,
      label: "Missed Periods",
      value: data.missedPeriods,
      color: "text-red-400",
    },
    {
      icon: Calendar,
      label: "Best Day",
      value: data.bestDayOfWeek,
      color: "text-blue-400",
    },
    {
      icon: null,
      label: "Total Completions",
      value: data.totalCompletions,
      color: "text-gray-300",
    },
  ];

  return (
    <div className="card p-6">
      <h3 className="text-base font-semibold text-gray-200 mb-6">Analytics</h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <DonutChart
          value={data.consistencyScore}
          color="#c44ef0"
          size={120}
          label={`${data.consistencyScore}%`}
          sublabel="consistency"
        />
        <div className="grid grid-cols-2 gap-4 flex-1 w-full">
          {metrics.map(({ icon: Icon, label, value, color }) => (
            <div key={label}>
              <p className={`text-lg font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Fix missing import
import { CheckCircle } from "lucide-react";
