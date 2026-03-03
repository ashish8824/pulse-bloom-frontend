// src/features/habits/HabitHeatmap.tsx
import { useGetHabitHeatmapQuery } from "@/services/habitApi";
import { HeatmapGrid } from "@/components/charts/HeatmapGrid";
import { CardSkeleton } from "@/components/ui/Skeleton";

export default function HabitHeatmap({ habitId }: { habitId: string }) {
  const { data, isLoading } = useGetHabitHeatmapQuery({
    id: habitId,
    days: 365,
  });

  if (isLoading) return <CardSkeleton />;

  return (
    <div className="card p-6">
      <h3 className="text-base font-semibold text-gray-200 mb-4">
        365-Day History
      </h3>
      {data && (
        <HeatmapGrid
          days={data.heatmap.map((d) => ({ date: d.date, value: d.completed }))}
          mode="habit"
        />
      )}
    </div>
  );
}
