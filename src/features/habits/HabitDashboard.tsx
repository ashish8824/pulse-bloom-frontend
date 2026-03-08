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
      <div className="p-4 sm:p-6 space-y-4">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-100">
            Habits
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Build consistency, one day at a time
          </p>
        </div>
        {/* Action buttons — stack on mobile, row on desktop */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link to="/app/habits/archived">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
              <Archive size={14} className="mr-1.5" />
              <span>Archived</span>
            </Button>
          </Link>
          {atLimit ? (
            <Link to="/app/billing">
              <Button
                variant="secondary"
                size="sm"
                className="text-xs sm:text-sm"
              >
                Upgrade
              </Button>
            </Link>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={openCreate}
              className="text-xs sm:text-sm"
            >
              <Plus size={14} className="mr-1.5" />
              <span>New Habit</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── Stats row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: ListTodo,
            label: "Active",
            value: activeHabits.length,
            color: "text-brand-400",
            bg: "bg-brand-500/10",
          },
          {
            icon: CheckCircle,
            label: "Done Today",
            value: completedTodayIds.size,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            icon: Flame,
            label: "On Streak",
            value: 0,
            color: "text-orange-400",
            bg: "bg-orange-500/10",
          },
          {
            icon: Archive,
            label: "Archived",
            value: (habits?.length ?? 0) - activeHabits.length,
            color: "text-gray-400",
            bg: "bg-gray-700/30",
          },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="card p-4 flex flex-col gap-2">
            <div
              className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}
            >
              <Icon size={16} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-100 leading-none">
                {value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Free plan limit banner ────────────────────────────── */}
      {atLimit && (
        <div className="rounded-2xl border border-brand-700 bg-brand-900/20 p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-300">
              Free plan limit reached
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Upgrade to Pro for unlimited habits
            </p>
          </div>
          <Link to="/app/billing" className="self-start sm:self-auto">
            <Button variant="primary" size="sm">
              Upgrade to Pro
            </Button>
          </Link>
        </div>
      )}

      {/* ── Habit list ────────────────────────────────────────── */}
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
