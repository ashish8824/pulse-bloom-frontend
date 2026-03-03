// src/features/habits/HabitDashboard.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Archive, CheckCircle, Flame, ListTodo } from "lucide-react";
import { useGetHabitsQuery } from "@/services/habitApi";
import { usePlanGate } from "@/hooks/usePlanGate";
import { FREE_HABIT_LIMIT } from "@/utils/planLimits";
import { Button } from "@/components/ui/Button";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import HabitList from "./HabitList";
import HabitForm from "./HabitForm";
import type { Habit } from "@/types/habit.types";

export function HabitDashboard() {
  const { data: habits, isLoading } = useGetHabitsQuery();
  const { canAccess } = usePlanGate("habit_create");
  const [formOpen, setFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [completedTodayIds, setCompletedTodayIds] = useState<Set<string>>(
    new Set(),
  );

  const activeHabits = habits?.filter((h) => !h.isArchived) ?? [];
  const atLimit = !canAccess && activeHabits.length >= FREE_HABIT_LIMIT;

  function handleCompleted(id: string) {
    setCompletedTodayIds((prev) => new Set([...prev, id]));
  }

  function handleUndone(id: string) {
    setCompletedTodayIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function openCreate() {
    setEditingHabit(null);
    setFormOpen(true);
  }

  function openEdit(habit: Habit) {
    setEditingHabit(habit);
    setFormOpen(true);
  }

  if (isLoading)
    return (
      <div className="p-6 space-y-4">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Habits</h1>
          <p className="text-sm text-gray-400 mt-1">
            Build consistency, one day at a time
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/app/habits/archived">
            <Button variant="ghost" size="sm">
              <Archive size={16} className="mr-2" /> Archived
            </Button>
          </Link>
          {atLimit ? (
            <Link to="/app/billing">
              <Button variant="secondary" size="sm">
                Upgrade for more habits
              </Button>
            </Link>
          ) : (
            <Button variant="primary" size="sm" onClick={openCreate}>
              <Plus size={16} className="mr-2" /> New Habit
            </Button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            icon: ListTodo,
            label: "Active",
            value: activeHabits.length,
            color: "text-brand-400",
          },
          {
            icon: CheckCircle,
            label: "Done Today",
            value: completedTodayIds.size,
            color: "text-emerald-400",
          },
          {
            icon: Flame,
            label: "On Streak",
            value: 0,
            color: "text-orange-400",
          },
          {
            icon: Archive,
            label: "Archived",
            value: (habits?.length ?? 0) - activeHabits.length,
            color: "text-gray-400",
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-4">
            <Icon size={18} className={`${color} mb-2`} />
            <p className="text-2xl font-bold text-gray-100">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Free plan limit banner */}
      {atLimit && (
        <div className="rounded-2xl border border-brand-700 bg-brand-900/20 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-300">
              Free plan limit reached
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Upgrade to Pro to track unlimited habits
            </p>
          </div>
          <Link to="/app/billing">
            <Button variant="primary" size="sm">
              Upgrade
            </Button>
          </Link>
        </div>
      )}

      {/* Habit list or empty state */}
      {activeHabits.length === 0 ? (
        <EmptyState
          title="No habits yet"
          description="Start building consistency by creating your first habit."
          action={{ label: "Create your first habit", onClick: openCreate }}
        />
      ) : (
        <HabitList
          habits={activeHabits}
          completedTodayIds={completedTodayIds}
          onEdit={openEdit}
          onCompleted={handleCompleted}
          onUndone={handleUndone}
        />
      )}

      <HabitForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        editingHabit={editingHabit}
      />
    </div>
  );
}
