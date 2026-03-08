// src/features/habits/HabitCard.tsx
import { useNavigate } from "react-router-dom";
import { CheckCircle, RotateCcw, Pencil, Trash2, Flame } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  useCompleteHabitMutation,
  useUndoCompletionMutation,
  useDeleteHabitMutation,
} from "@/services/habitApi";
import { showMilestoneToast } from "./MilestoneToast";
import type { Habit } from "@/types/habit.types";

interface HabitCardProps {
  habit: Habit;
  isCompletedToday: boolean;
  onEdit: (habit: Habit) => void;
  onCompleted: (id: string) => void;
  onUndone: (id: string) => void;
  dragHandleProps?: object;
}

const CATEGORY_COLORS: Record<string, string> = {
  health: "success",
  fitness: "info",
  learning: "purple",
  mindfulness: "warning",
  productivity: "default",
  custom: "default",
};

export default function HabitCard({
  habit,
  isCompletedToday,
  onEdit,
  onCompleted,
  onUndone,
  dragHandleProps,
}: HabitCardProps) {
  const navigate = useNavigate();
  const [completeHabit, { isLoading: completing }] = useCompleteHabitMutation();
  const [undoCompletion, { isLoading: undoing }] = useUndoCompletionMutation();
  const [deleteHabit] = useDeleteHabitMutation();

  async function handleComplete() {
    try {
      const res = await completeHabit({ id: habit.id, body: {} }).unwrap();
      onCompleted(habit.id);
      if (res.milestone) showMilestoneToast(res.milestone);
    } catch {}
  }

  async function handleUndo() {
    try {
      await undoCompletion(habit.id).unwrap();
      onUndone(habit.id);
    } catch {}
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm(`Delete "${habit.title}"?`)) await deleteHabit(habit.id);
  }

  return (
    <div
      className={`card p-3 sm:p-4 flex items-center gap-3 cursor-pointer transition-all group
        hover:border-gray-700 hover:bg-gray-800/50
        ${isCompletedToday ? "opacity-70" : ""}`}
      onClick={() => navigate(`/app/habits/${habit.id}`)}
    >
      {/* ── Drag handle (desktop only) ── */}
      <div
        {...dragHandleProps}
        className="hidden sm:flex text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing select-none flex-shrink-0 px-0.5"
        onClick={(e) => e.stopPropagation()}
      >
        ⠿
      </div>

      {/* ── Icon ── */}
      <div
        className="text-xl w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gray-800 flex-shrink-0"
        style={{
          borderColor: habit.color ?? "transparent",
          borderWidth: habit.color ? 1 : 0,
        }}
      >
        {habit.icon ?? "✅"}
      </div>

      {/* ── Title + badges ── */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`font-semibold text-sm sm:text-base truncate max-w-[120px] sm:max-w-none
              ${isCompletedToday ? "line-through text-gray-400" : "text-gray-100"}`}
          >
            {habit.title}
          </span>
          {/* Badges — hide on very small screens to avoid overflow */}
          <span className="hidden xs:inline-flex">
            <Badge variant={CATEGORY_COLORS[habit.category] as any} size="sm">
              {habit.category}
            </Badge>
          </span>
          <Badge variant="default" size="sm">
            {habit.frequency}
          </Badge>
        </div>
        {habit.description && (
          <p className="text-xs text-gray-500 mt-0.5 truncate hidden sm:block">
            {habit.description}
          </p>
        )}
      </div>

      {/* ── Streak indicator ── */}
      <div className="hidden sm:flex items-center gap-1 text-orange-400 text-xs font-bold flex-shrink-0">
        <Flame size={13} />
        <span>—</span>
      </div>

      {/* ── Actions ── */}
      <div
        className="flex items-center gap-1.5 flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Edit + Delete — always visible on mobile, hover-only on desktop */}
        <div className="flex gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-500 hover:text-gray-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(habit);
            }}
            title="Edit"
          >
            <Pencil size={13} />
          </button>
          <button
            className="p-1.5 rounded-lg hover:bg-red-900/40 text-gray-500 hover:text-red-400 transition-colors"
            onClick={handleDelete}
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Complete / Undo button */}
        {isCompletedToday ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            loading={undoing}
            className="text-xs px-2 sm:px-3"
          >
            <RotateCcw size={13} className="mr-1" />
            <span className="hidden sm:inline">Undo</span>
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={handleComplete}
            loading={completing}
            className="text-xs px-2 sm:px-3"
          >
            <CheckCircle size={13} className="mr-1" />
            <span>Done</span>
          </Button>
        )}
      </div>
    </div>
  );
}
