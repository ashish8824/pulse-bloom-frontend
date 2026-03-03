// src/features/habits/ArchivedHabits.tsx
import { ArrowLeft, RotateCcw, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useGetArchivedHabitsQuery,
  useRestoreHabitMutation,
  useDeleteHabitMutation,
} from "@/services/habitApi";
import { Button } from "@/components/ui/Button";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";

export function ArchivedHabits() {
  const navigate = useNavigate();
  const { data: habits, isLoading } = useGetArchivedHabitsQuery();
  const [restoreHabit] = useRestoreHabitMutation();
  const [deleteHabit] = useDeleteHabitMutation();

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          className="text-gray-400 hover:text-gray-200"
          onClick={() => navigate("/app/habits")}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-100">Archived Habits</h1>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : !habits?.length ? (
        <EmptyState
          title="No archived habits"
          description="Habits you archive will appear here."
        />
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <div key={habit.id} className="card p-4 flex items-center gap-4">
              <span className="text-2xl">{habit.icon ?? "✅"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-300">
                    {habit.title}
                  </span>
                  <Badge variant="default" size="sm">
                    {habit.category}
                  </Badge>
                </div>
                {habit.description && (
                  <p className="text-xs text-gray-500 truncate">
                    {habit.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => restoreHabit(habit.id)}
                >
                  <RotateCcw size={14} className="mr-1" /> Restore
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    confirm("Permanently delete?") && deleteHabit(habit.id)
                  }
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
