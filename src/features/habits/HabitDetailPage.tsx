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
      await deleteHabit(habit!.id);
      navigate("/app/habits");
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          className="mt-1 text-gray-400 hover:text-gray-200"
          onClick={() => navigate("/app/habits")}
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-3xl">{habit.icon ?? "✅"}</span>
            <h1 className="text-2xl font-bold text-gray-100">{habit.title}</h1>
            <Badge variant="default" size="sm">
              {habit.category}
            </Badge>
            <Badge variant="info" size="sm">
              {habit.frequency}
            </Badge>
          </div>
          {habit.description && (
            <p className="text-sm text-gray-400 mt-1 ml-12">
              {habit.description}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap justify-end">
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
              <CheckCircle size={14} className="mr-1" /> Done Today
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            <Pencil size={14} className="mr-1" /> Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={handleArchive}>
            <Archive size={14} className="mr-1" /> Archive
          </Button>
        </div>
      </div>

      {/* 2-col on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <HabitAnalyticsCard habitId={id!} />
          <HabitLogHistory habitId={id!} />
        </div>
        <div className="space-y-6">
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
