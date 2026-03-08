// src/features/habits/HabitDetailPage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Archive,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import {
  useGetHabitsQuery,
  useDeleteHabitMutation,
  useCompleteHabitMutation,
  useUndoCompletionMutation,
} from "@/services/habitApi";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import HabitAnalyticsCard from "./HabitAnalyticsCard";
import HabitHeatmap from "./HabitHeatmap";
import HabitCalendar from "./HabitCalendar";
import HabitLogHistory from "./HabitLogHistory";
import HabitForm from "./HabitForm";
import { showMilestoneToast } from "./MilestoneToast";

const CATEGORY_COLORS: Record<string, string> = {
  health: "success",
  fitness: "info",
  learning: "purple",
  mindfulness: "warning",
  productivity: "default",
  custom: "default",
};

export function HabitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: habits } = useGetHabitsQuery();
  const [deleteHabit] = useDeleteHabitMutation();
  const [completeHabit, { isLoading: completing }] = useCompleteHabitMutation();
  const [undoCompletion, { isLoading: undoing }] = useUndoCompletionMutation();
  const [editing, setEditing] = useState(false);
  const [isCompletedToday, setIsCompletedToday] = useState(false);

  const habit = habits?.find((h) => h.id === id);
  if (!habit) return <div className="p-6 text-gray-400">Habit not found.</div>;

  async function handleComplete() {
    try {
      const res = await completeHabit({ id: id!, body: {} }).unwrap();
      setIsCompletedToday(true);
      if (res.milestone) showMilestoneToast(res.milestone);
    } catch {}
  }

  async function handleUndo() {
    try {
      await undoCompletion(id!).unwrap();
      setIsCompletedToday(false);
    } catch {}
  }

  async function handleArchive() {
    if (confirm("Archive this habit?")) {
      await deleteHabit(habit.id);
      navigate("/app/habits");
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* ── Top bar: back + primary action ───────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <button
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors flex-shrink-0"
          onClick={() => navigate("/app/habits")}
        >
          <ArrowLeft size={18} />
        </button>

        {/* Done Today / Undo — top-right, always reachable */}
        <div className="flex-shrink-0">
          {isCompletedToday ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              loading={undoing}
            >
              <RotateCcw size={14} className="mr-1" /> Undo
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleComplete}
              loading={completing}
            >
              <CheckCircle size={14} className="mr-1" />
              <span>Done Today</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── Habit identity card ───────────────────────────────── */}
      <div className="card p-4 sm:p-5">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-800 text-2xl flex-shrink-0"
            style={{
              borderColor: habit.color ?? "transparent",
              borderWidth: habit.color ? 1 : 0,
            }}
          >
            {habit.icon ?? "✅"}
          </div>

          {/* Title + badges + description */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-100 leading-tight break-words">
              {habit.title}
            </h1>
            <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
              <Badge variant={CATEGORY_COLORS[habit.category] as any} size="sm">
                {habit.category}
              </Badge>
              <Badge variant="info" size="sm">
                {habit.frequency}
              </Badge>
              {isCompletedToday && (
                <Badge variant="success" size="sm">
                  ✓ Done today
                </Badge>
              )}
            </div>
            {habit.description && (
              <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                {habit.description}
              </p>
            )}
          </div>
        </div>

        {/* Edit + Archive — below on mobile, inline on desktop */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(true)}
            className="flex-1 sm:flex-none"
          >
            <Pencil size={13} className="mr-1.5" /> Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleArchive}
            className="flex-1 sm:flex-none text-red-400 hover:text-red-300"
          >
            <Archive size={13} className="mr-1.5" /> Archive
          </Button>
        </div>
      </div>

      {/* ── Analytics + content grid ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-4 sm:space-y-6">
          <HabitAnalyticsCard habitId={id!} />
          <HabitLogHistory habitId={id!} />
        </div>
        <div className="space-y-4 sm:space-y-6">
          <HabitCalendar habitId={id!} />
          <HabitHeatmap habitId={id!} />
        </div>
      </div>

      <HabitForm
        isOpen={editing}
        onClose={() => setEditing(false)}
        editingHabit={habit}
      />
    </div>
  );
}
