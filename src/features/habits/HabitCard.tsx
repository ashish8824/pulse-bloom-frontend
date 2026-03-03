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
      className="card p-4 flex items-center gap-4 cursor-pointer hover:border-gray-700 transition-all group"
      onClick={() => navigate(`/app/habits/${habit.id}`)}
    >
      <div
        {...dragHandleProps}
        className="text-gray-600 cursor-grab active:cursor-grabbing hidden sm:block"
        onClick={(e) => e.stopPropagation()}
      >
        ⠿
      </div>

      <div
        className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl bg-gray-800 flex-shrink-0"
        style={{ borderColor: habit.color, borderWidth: habit.color ? 1 : 0 }}
      >
        {habit.icon ?? "✅"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-gray-100 truncate">
            {habit.title}
          </span>
          <Badge variant={CATEGORY_COLORS[habit.category] as any} size="sm">
            {habit.category}
          </Badge>
          <Badge variant="default" size="sm">
            {habit.frequency}
          </Badge>
        </div>
        {habit.description && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {habit.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 text-orange-400 text-sm font-bold flex-shrink-0">
        <Flame size={14} />
        <span>-</span>
      </div>

      <div
        className="flex items-center gap-2 flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-gray-200"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(habit);
            }}
          >
            <Pencil size={14} />
          </button>
          <button
            className="p-1.5 rounded-lg hover:bg-red-900/40 text-gray-400 hover:text-red-400"
            onClick={handleDelete}
          >
            <Trash2 size={14} />
          </button>
        </div>

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
            <CheckCircle size={14} className="mr-1" /> Done
          </Button>
        )}
      </div>
    </div>
  );
}
